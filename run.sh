#!/usr/bin/env bash
# Levanta y compila el front de Panadería Digital, en Android y en web.
# Uso: ./run.sh [comando] [opciones]   — sin comando, muestra un menú.

set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")"

NODE_MINIMO=20
API_PORT="${API_PORT:-3000}" # puerto del backend local (PANADERIA-BACK)

# ── Salida ───────────────────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  VERDE=$'\e[32m' AMARILLO=$'\e[33m' ROJO=$'\e[31m' NEGRITA=$'\e[1m' NORMAL=$'\e[0m'
else
  VERDE='' AMARILLO='' ROJO='' NEGRITA='' NORMAL=''
fi

paso() { printf '%s▸ %s%s\n' "$NEGRITA" "$1" "$NORMAL"; }
ok() { printf '%s✔ %s%s\n' "$VERDE" "$1" "$NORMAL"; }
aviso() { printf '%s⚠ %s%s\n' "$AMARILLO" "$1" "$NORMAL" >&2; }
error() {
  printf '%s✖ %s%s\n' "$ROJO" "$1" "$NORMAL" >&2
  exit 1
}

ayuda() {
  cat <<EOF
${NEGRITA}Panadería Digital — front${NORMAL}

Uso: ./run.sh [comando] [opciones]

Desarrollo
  android     Compila la app, la instala en el celular o emulador y levanta Metro
  web         Levanta la web pública en el navegador
  start       Solo Metro (para una app que ya está instalada)

Compilar
  apk         Genera el APK de release en builds/
  web:build   Exporta la web estática a dist/

Otros
  check       Revisa tipos (tsc) y versiones de dependencias contra el SDK
  ayuda       Muestra esta ayuda

Opciones
  --limpio    (android, apk) Regenera android/ desde cero antes de compilar.
              Usalo después de tocar ícono, splash o plugins en app.json.
  --instalar  (apk) Instala el APK en el celular conectado al terminar.

Variables
  API_PORT    Puerto del backend local que se redirige al celular (por defecto 3000)
EOF
}

menu() {
  local comandos=(android web start apk web:build check)
  local etiquetas=(
    "android     compilar, instalar en el celular y levantar Metro"
    "web         levantar la web en el navegador"
    "start       solo Metro"
    "apk         generar el APK de release"
    "web:build   exportar la web estática"
    "check       revisar tipos y versiones"
  )
  local eleccion
  PS3=$'\nElegí una opción (número): '
  select eleccion in "${etiquetas[@]}"; do
    if [[ "$REPLY" =~ ^[0-9]+$ ]] && ((REPLY >= 1 && REPLY <= ${#comandos[@]})); then
      COMANDO="${comandos[REPLY - 1]}"
      return
    fi
    echo "Opción inválida."
  done
  exit 0 # Ctrl+D
}

# ── Requisitos ───────────────────────────────────────────────────────────────

verificar_node() {
  command -v node >/dev/null || error "No encuentro Node.js. Instalá Node $NODE_MINIMO o más nuevo."
  local mayor
  mayor="$(node -p 'process.versions.node.split(".")[0]')"
  ((mayor >= NODE_MINIMO)) || error "Node $(node -v) es viejo: Expo SDK 57 pide Node $NODE_MINIMO o más."
}

dependencias() {
  # npm deja node_modules/.package-lock.json al terminar: si el lock es más nuevo,
  # alguien instaló o actualizó algo y hay que sincronizar.
  if [[ ! -d node_modules ]] || [[ package-lock.json -nt node_modules/.package-lock.json ]]; then
    paso "Instalando dependencias…"
    npm install
  fi
}

java_ok() {
  local java_bin="${JAVA_HOME:+$JAVA_HOME/bin/}java"
  command -v "$java_bin" >/dev/null 2>&1 || return 1
  local mayor
  mayor="$("$java_bin" -version 2>&1 | awk -F'"' '/version/ { split($2, v, "."); print v[1]; exit }')"
  [[ "$mayor" =~ ^[0-9]+$ ]] && ((mayor >= 17))
}

entorno_android() {
  # Fuera de una terminal con el .bashrc cargado (tareas de VS Code, cron) estas variables pueden faltar.
  export ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}}"
  [[ -d "$ANDROID_HOME" ]] || error "No encuentro el SDK de Android en $ANDROID_HOME. Instalalo con Android Studio o exportá ANDROID_HOME."
  export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
  command -v adb >/dev/null || error "Falta adb: instalá 'Android SDK Platform-Tools' desde el SDK Manager de Android Studio."

  if ! java_ok; then
    local candidato
    for candidato in /usr/lib/jvm/java-17-openjdk-amd64 /snap/android-studio/current/jbr /opt/android-studio/jbr "$HOME/android-studio/jbr"; do
      [[ -x "$candidato/bin/java" ]] || continue
      export JAVA_HOME="$candidato" PATH="$candidato/bin:$PATH"
      java_ok && break
    done
    java_ok || error "Gradle necesita un JDK 17 o más nuevo. Instalá openjdk-17-jdk o exportá JAVA_HOME."
  fi
}

dispositivos() { adb devices | awk 'NR > 1 && $2 == "device" { print $1 }'; }

preparar_dispositivo() {
  adb start-server >/dev/null 2>&1

  if [[ -n "$(dispositivos)" ]]; then
    ok "Dispositivo listo: $(dispositivos | paste -sd ' ')"
    return
  fi

  if adb devices | awk 'NR > 1 && $2 == "unauthorized"' | grep -q .; then
    aviso "Hay un celular conectado sin autorizar: aceptá el cartel de 'Depuración USB' en la pantalla y volvé a correr el comando."
  fi

  local avd
  avd="$(emulator -list-avds 2>/dev/null | head -n1)"
  [[ -n "$avd" ]] || error "No hay ningún celular conectado ni emulador creado.
  • Celular: activá 'Depuración USB' en Opciones de desarrollador y conectalo por cable.
  • Emulador: creá uno en Android Studio → Device Manager."

  paso "Arrancando el emulador $avd…"
  nohup emulator -avd "$avd" -netdelay none -netspeed full >/dev/null 2>&1 &
  adb wait-for-device
  local intentos=0
  until [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do
    ((++intentos > 90)) && error "El emulador no terminó de arrancar en 3 minutos."
    sleep 2
  done
  ok "Emulador $avd listo"
}

redirigir_api() {
  # Con esto, la app en el celular llega al backend de esta compu como http://localhost:$API_PORT.
  local serie
  for serie in $(dispositivos); do
    adb -s "$serie" reverse "tcp:$API_PORT" "tcp:$API_PORT" >/dev/null
  done
  ok "Backend local redirigido al celular (puerto $API_PORT)"
}

prebuild_android() {
  # android/ se genera desde app.json (CNG): nunca se edita a mano ni se commitea.
  local args=(--platform android --no-install)
  if $LIMPIO; then
    args+=(--clean)
    paso "Regenerando android/ desde cero…"
  else
    paso "Sincronizando android/ con app.json…"
  fi
  # Sin esto, prebuild frena a preguntar si hay cambios sin commitear.
  EXPO_NO_GIT_STATUS=1 npx expo prebuild "${args[@]}"
}

# ── Comandos ─────────────────────────────────────────────────────────────────

cmd_android() {
  verificar_node
  dependencias
  entorno_android
  preparar_dispositivo
  prebuild_android
  redirigir_api
  paso "Compilando e instalando la app (la primera vez tarda varios minutos)…"
  exec npx expo run:android
}

cmd_web() {
  verificar_node
  dependencias
  exec npx expo start --web
}

cmd_start() {
  verificar_node
  dependencias
  exec npx expo start
}

cmd_apk() {
  verificar_node
  dependencias
  entorno_android
  prebuild_android

  paso "Compilando el APK de release (puede tardar varios minutos)…"
  (cd android && ./gradlew assembleRelease)

  local origen="android/app/build/outputs/apk/release/app-release.apk"
  [[ -f "$origen" ]] || error "Gradle terminó pero no encuentro $origen."
  local version destino
  version="$(node -p "require('./app.json').expo.version")"
  destino="builds/panaderia-digital-$version.apk"
  mkdir -p builds
  cp "$origen" "$destino"
  ok "APK lista: $destino"
  aviso "Está firmada con la clave de debug: sirve para instalarla a mano en el celular, no para subirla a Play Store."

  if $INSTALAR; then
    preparar_dispositivo
    local serie
    for serie in $(dispositivos); do
      paso "Instalando en $serie…"
      adb -s "$serie" install -r "$destino"
    done
    ok "Instalada"
  else
    echo "Para instalarla en el celular conectado: adb install -r $destino"
  fi
}

cmd_web_build() {
  verificar_node
  dependencias
  paso "Exportando la web estática…"
  npx expo export --platform web
  ok "Web lista en dist/ — para probarla local: npx expo serve"
}

cmd_check() {
  verificar_node
  dependencias
  paso "Revisando tipos…"
  npx tsc --noEmit
  ok "Tipos en orden"
  paso "Revisando versiones contra el SDK de Expo…"
  npx expo install --check
}

# ── Entrada ──────────────────────────────────────────────────────────────────

COMANDO="${1:-}"
[[ $# -gt 0 ]] && shift

LIMPIO=false
INSTALAR=false
for arg in "$@"; do
  case "$arg" in
    --limpio) LIMPIO=true ;;
    --instalar) INSTALAR=true ;;
    *) error "Opción desconocida: $arg (mirá ./run.sh ayuda)" ;;
  esac
done

if [[ -z "$COMANDO" ]]; then
  if [[ -t 0 ]]; then
    menu
  else
    ayuda
    exit 0
  fi
fi

case "$COMANDO" in
  android) cmd_android ;;
  web) cmd_web ;;
  start) cmd_start ;;
  apk) cmd_apk ;;
  web:build) cmd_web_build ;;
  check) cmd_check ;;
  ayuda | -h | --help) ayuda ;;
  *) error "Comando desconocido: $COMANDO (mirá ./run.sh ayuda)" ;;
esac
