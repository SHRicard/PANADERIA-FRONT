import { StyleSheet, View } from 'react-native';
import { Croissant, Plus, Search, ShoppingBag, Trash2, Wheat } from 'lucide-react-native';
import {
  ESTILO_BARRA_POR_DEFECTO,
  ESTILO_ENCABEZADO_POR_DEFECTO,
  ESTILOS_BARRA,
  ESTILOS_ENCABEZADO,
} from '@/features/navegacion';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import {
  Alert,
  Badge,
  Button,
  Icon,
  InputField,
  ScreenContainer,
  Segmentado,
  Select,
  SelectorTema,
  Text,
  type BadgeTone,
  type OpcionSegmentado,
} from '@/shared/ui/atoms';
import {
  ESTILO_TIPOGRAFIA_POR_DEFECTO,
  ESTILOS_TIPOGRAFIA,
  useStyles,
  useTheme,
  useThemeMode,
  useTipografia,
  type ColorToken,
  type EstiloTipografia,
  type Fuentes,
  type TextVariant,
  type Theme,
} from '@/theme';
import { Grilla } from '../components/Grilla';
import { MuestraBarra } from '../components/MuestraBarra';
import { MuestraColor } from '../components/MuestraColor';
import { MuestraEncabezado } from '../components/MuestraEncabezado';
import { Seccion } from '../components/Seccion';
import { GUSTOS, PERIODOS, useDiseno } from '../hooks/useDiseno';

const GRUPOS_COLOR: { titulo: string; tokens: ColorToken[] }[] = [
  { titulo: 'Superficies', tokens: ['background', 'surface', 'surfaceMuted', 'border', 'shadow', 'overlay'] },
  { titulo: 'Texto', tokens: ['text', 'textMuted'] },
  { titulo: 'Marca', tokens: ['primary', 'primaryPressed', 'onPrimary', 'primarySoft', 'accent', 'onAccent'] },
  {
    titulo: 'Estados',
    tokens: ['success', 'successSoft', 'warning', 'warningSoft', 'danger', 'dangerSoft'],
  },
];

const EJEMPLOS_TEXTO: { variante: TextVariant; ejemplo: string }[] = [
  { variante: 'display', ejemplo: 'Panadería Digital' },
  { variante: 'heading', ejemplo: 'Promos de la semana' },
  { variante: 'title', ejemplo: 'Medialunas de manteca' },
  { variante: 'subtitle', ejemplo: 'Facturas' },
  { variante: 'body', ejemplo: 'Masa hojaldrada con manteca, horneada todas las mañanas.' },
  { variante: 'bodyStrong', ejemplo: '$ 4.800 la docena' },
  { variante: 'label', ejemplo: 'Disponible hoy' },
  { variante: 'caption', ejemplo: '12 unidades · 540 g' },
  { variante: 'overline', ejemplo: 'Jueves 15 de octubre' },
];

const OPCIONES_TIPOGRAFIA: OpcionSegmentado<EstiloTipografia>[] = Object.values(ESTILOS_TIPOGRAFIA).map(
  ({ estilo, nombre }) => ({ valor: estilo, label: nombre }),
);

const ROLES_FUENTE: (keyof Fuentes)[] = ['titulo', 'tituloSuave', 'texto', 'textoMedio', 'textoNegrita'];

const BADGES: { tono: BadgeTone; label: string }[] = [
  { tono: 'neutral', label: 'Sin categoría' },
  { tono: 'primary', label: 'Nuevo' },
  { tono: 'success', label: 'Disponible' },
  { tono: 'warning', label: 'Quedan pocos' },
  { tono: 'danger', label: 'Agotado' },
];

const COLORES_ICONO: ColorToken[] = ['text', 'textMuted', 'primary', 'accent', 'success', 'danger'];

export function DisenoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { columnas, cargando, simularCarga, texto, setTexto, periodo, setPeriodo, gusto, setGusto } = useDiseno();
  const tipografia = useTipografia();
  const tema = useThemeMode();

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <View style={styles.intro}>
          <Badge tone="warning" label="Solo en desarrollo" />
          <Text color="textMuted">
            Los tokens del theme y los atoms de shared/ui/atoms, con los valores del tema activo. No llega a la APK de
            release ni a la web publicada.
          </Text>
          <SelectorTema valor={tema.preferencia} alCambiar={tema.cambiarPreferencia} />
        </View>

        <Seccion titulo="Colores" descripcion="Tokens semánticos. Los componentes usan estos nombres, nunca la paleta cruda.">
          {GRUPOS_COLOR.map(({ titulo, tokens }) => (
            <View key={titulo} style={styles.grupo}>
              <Text variant="label" color="textMuted">
                {titulo}
              </Text>
              <Grilla columnas={columnas}>
                {tokens.map((token) => (
                  <MuestraColor key={token} token={token} />
                ))}
              </Grilla>
            </View>
          ))}
        </Seccion>

        <Seccion
          titulo="Tipografía"
          descripcion={`Tres estilos de fuentes; el dueño elige el suyo en Más → Preferencias (por defecto, ${ESTILOS_TIPOGRAFIA[ESTILO_TIPOGRAFIA_POR_DEFECTO].nombre.toLowerCase()}). Cambiarlo acá lo cambia en toda la app.`}
        >
          <Segmentado
            opciones={OPCIONES_TIPOGRAFIA}
            valor={tipografia.estilo}
            alCambiar={tipografia.cambiarEstilo}
            accessibilityLabel="Tipografía"
          />
          <Text variant="caption" color="textMuted">
            {ESTILOS_TIPOGRAFIA[tipografia.estilo].descripcion}
          </Text>

          <View style={styles.grupo}>
            <Text variant="label" color="textMuted">
              Variantes del atom Text: tamaño / interlineado · fuente
            </Text>
            {EJEMPLOS_TEXTO.map(({ variante, ejemplo }) => {
              const { fontSize, lineHeight, fontFamily } = theme.text[variante];
              return (
                <View key={variante} style={styles.filaTexto}>
                  <Text variant={variante}>{ejemplo}</Text>
                  <Text variant="caption" color="textMuted">
                    {variante} · {fontSize}/{lineHeight} · {fontFamily}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.grupo}>
            <Text variant="label" color="textMuted">
              theme.fonts: para un estilo propio, sin fontWeight
            </Text>
            {ROLES_FUENTE.map((rol) => (
              <View key={rol} style={styles.filaTexto}>
                <Text style={{ fontFamily: theme.fonts[rol] }}>Medialunas de manteca · $ 4.800</Text>
                <Text variant="caption" color="textMuted">
                  {rol} · {theme.fonts[rol]}
                </Text>
              </View>
            ))}
          </View>
        </Seccion>

        <Seccion titulo="Espaciado" descripcion="Escala base 4, para márgenes, padding y gap.">
          {Object.entries(theme.spacing)
            .filter(([, valor]) => valor > 0)
            .map(([nombre, valor]) => (
              <View key={nombre} style={styles.filaEscala}>
                <View style={[styles.barra, { width: valor }]} />
                <Text variant="caption" color="textMuted">
                  {nombre} · {valor}
                </Text>
              </View>
            ))}
        </Seccion>

        <Seccion titulo="Radios">
          <View style={styles.filaLibre}>
            {Object.entries(theme.radius).map(([nombre, valor]) => (
              <View key={nombre} style={styles.item}>
                <View style={[styles.cuadro, { borderRadius: valor }]} />
                <Text variant="caption" color="textMuted">
                  {nombre} · {valor}
                </Text>
              </View>
            ))}
          </View>
        </Seccion>

        <Seccion titulo="Botones" descripcion="Tocá «Guardar» para ver el estado de carga.">
          <View style={styles.filaLibre}>
            <Button label="Guardar" onPress={simularCarga} loading={cargando} />
            <Button variant="secondary" label="Editar" onPress={simularCarga} />
            <Button variant="ghost" label="Cancelar" onPress={simularCarga} />
          </View>
          <View style={styles.filaLibre}>
            <Button icon={Plus} label="Nuevo producto" onPress={simularCarga} />
            <Button variant="danger" icon={Trash2} label="Eliminar" onPress={simularCarga} />
            <Button label="Deshabilitado" onPress={simularCarga} disabled />
          </View>
          <Button icon={ShoppingBag} label="Ancho completo" onPress={simularCarga} fullWidth />
          <View style={styles.filaLibre}>
            <Button size="sm" icon={Plus} label="Nuevo" onPress={simularCarga} />
            <Text variant="caption" color="textMuted">
              size="sm": la píldora al lado de un título
            </Text>
          </View>
        </Seccion>

        <Seccion titulo="Campos" descripcion="InputField: label, ícono, ayuda y error.">
          <InputField
            label="Nombre del producto"
            placeholder="Medialunas de manteca"
            icon={Croissant}
            value={texto}
            onChangeText={setTexto}
            helper="Así lo van a ver los clientes en el catálogo."
          />
          <InputField label="Buscar" placeholder="Pan, facturas, tortas…" icon={Search} />
          <InputField label="Precio" value="mil doscientos" error="Ingresá solo números, por ejemplo 1200" />
          <InputField label="Gusto" value="Dulce" disabled />
        </Seccion>

        <Seccion
          titulo="Select"
          descripcion="Elegir una entre varias en un formulario: se ve como un campo y abre una hoja desde abajo. Lo usa el gusto del producto."
        >
          <Select
            label="Gusto"
            tituloHoja="¿De qué gusto es?"
            opciones={GUSTOS}
            valor={gusto}
            alCambiar={setGusto}
            placeholder="Dulce, salado, picante…"
          />
          <Select label="Gusto" opciones={GUSTOS} valor={null} alCambiar={setGusto} error="Elegí un gusto" />
          <Select label="Gusto" opciones={[]} valor={null} alCambiar={setGusto} placeholder="Cargando gustos…" disabled />
        </Seccion>

        <Seccion titulo="Segmentado" descripcion="Elegir una entre pocas opciones, todas a la vista. Lo usan el tema, la barra de pestañas y la tipografía.">
          <Segmentado opciones={PERIODOS} valor={periodo} alCambiar={setPeriodo} accessibilityLabel="Período" />
        </Seccion>

        <Seccion titulo="Badges" descripcion="El texto va siempre en color de texto: el tono lo dan el fondo y el punto.">
          <View style={styles.filaLibre}>
            {BADGES.map(({ tono, label }) => (
              <Badge key={tono} tone={tono} label={label} />
            ))}
          </View>
        </Seccion>

        <Seccion titulo="Alertas">
          <Alert tone="info" message="Los precios se actualizan al guardar." />
          <Alert tone="success" title="Producto guardado" message="Ya aparece en el catálogo." />
          <Alert tone="warning" message="Esta promo vence mañana." />
          <Alert tone="danger" message="Usuario o contraseña incorrectos" />
        </Seccion>

        <Seccion titulo="Íconos" descripcion="Lucide a través del atom Icon: tamaño y color salen del theme.">
          <View style={styles.filaLibre}>
            {(Object.keys(theme.iconSize) as (keyof Theme['iconSize'])[]).map((tamano) => (
              <View key={tamano} style={styles.item}>
                <Icon icon={Wheat} size={tamano} />
                <Text variant="caption" color="textMuted">
                  {tamano} · {theme.iconSize[tamano]}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.filaLibre}>
            {COLORES_ICONO.map((color) => (
              <View key={color} style={styles.item}>
                <Icon icon={Croissant} size="lg" color={color} />
                <Text variant="caption" color="textMuted">
                  {color}
                </Text>
              </View>
            ))}
          </View>
        </Seccion>

        <Seccion
          titulo="Barra de pestañas"
          descripcion="Los estilos que el dueño elige en Más → Preferencias. Tocá las pestañas para ver la activa."
        >
          {Object.values(ESTILOS_BARRA).map(({ estilo, nombre, descripcion, Barra }) => (
            <View key={estilo} style={styles.grupo}>
              <View style={styles.filaTexto}>
                <Text variant="label">{estilo === ESTILO_BARRA_POR_DEFECTO ? `${nombre} (por defecto)` : nombre}</Text>
                <Text variant="caption" color="textMuted">
                  {descripcion}
                </Text>
              </View>
              <MuestraBarra Barra={Barra} />
            </View>
          ))}
        </Seccion>

        <Seccion
          titulo="Encabezado de las pestañas"
          descripcion="Los estilos que el dueño elige en Más → Preferencias. El grande va arriba de cada pestaña; al bajar, queda la barra chica."
        >
          {Object.values(ESTILOS_ENCABEZADO).map(({ estilo, nombre, descripcion, Encabezado, BarraChica }) => (
            <View key={estilo} style={styles.grupo}>
              <View style={styles.filaTexto}>
                <Text variant="label">{estilo === ESTILO_ENCABEZADO_POR_DEFECTO ? `${nombre} (por defecto)` : nombre}</Text>
                <Text variant="caption" color="textMuted">
                  {descripcion}
                </Text>
              </View>
              <MuestraEncabezado Encabezado={Encabezado} BarraChica={BarraChica} />
            </View>
          ))}
        </Seccion>

        <Seccion
          titulo="Logo"
          descripcion="src/shared/assets/logo-dama-blanca.svg, importado como componente. Es multicolor: no sigue el tema."
        >
          <View style={styles.filaLibre}>
            {[theme.sizes.logo, theme.sizes.logo / 2, theme.sizes.control].map((tamano) => (
              <View key={tamano} style={styles.item}>
                <View accessible role="img" aria-label="Dama Blanca Horneados">
                  <LogoDamaBlanca width={tamano} height={tamano} aria-hidden />
                </View>
                <Text variant="caption" color="textMuted">
                  {tamano}
                </Text>
              </View>
            ))}
          </View>
        </Seccion>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    intro: { gap: theme.spacing.md },
    grupo: { gap: theme.spacing.sm },
    filaTexto: { gap: theme.spacing.xxs },
    filaEscala: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    barra: { height: theme.spacing.lg, borderRadius: theme.radius.sm, backgroundColor: theme.colors.primary },
    filaLibre: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.md },
    item: { alignItems: 'center', gap: theme.spacing.xs },
    cuadro: {
      width: theme.sizes.control,
      height: theme.sizes.control,
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
  });
