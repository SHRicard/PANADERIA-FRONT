import { StyleSheet, View } from 'react-native';
import { Croissant, Plus, Search, ShoppingBag, Trash2, Wheat } from 'lucide-react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import {
  Alert,
  Badge,
  Button,
  Icon,
  InputField,
  ScreenContainer,
  Text,
  type BadgeTone,
} from '@/shared/ui/atoms';
import { useStyles, useTheme, type ColorToken, type TextVariant, type Theme } from '@/theme';
import { Grilla } from '../components/Grilla';
import { MuestraColor } from '../components/MuestraColor';
import { Seccion } from '../components/Seccion';
import { SelectorTema } from '../components/SelectorTema';
import { useDiseno } from '../hooks/useDiseno';

const GRUPOS_COLOR: { titulo: string; tokens: ColorToken[] }[] = [
  { titulo: 'Superficies', tokens: ['background', 'surface', 'surfaceMuted', 'border'] },
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
];

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
  const { columnas, cargando, simularCarga, texto, setTexto } = useDiseno();

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <View style={styles.intro}>
          <Badge tone="warning" label="Solo en desarrollo" />
          <Text color="textMuted">
            Los tokens del theme y los atoms de shared/ui/atoms, con los valores del tema activo. No llega a la APK de
            release ni a la web publicada.
          </Text>
          <SelectorTema />
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

        <Seccion titulo="Tipografía" descripcion="Variantes del atom Text: tamaño / interlineado · peso.">
          {EJEMPLOS_TEXTO.map(({ variante, ejemplo }) => {
            const { fontSize, lineHeight, fontWeight } = theme.text[variante];
            return (
              <View key={variante} style={styles.filaTexto}>
                <Text variant={variante}>{ejemplo}</Text>
                <Text variant="caption" color="textMuted">
                  {variante} · {fontSize}/{lineHeight} · {fontWeight}
                </Text>
              </View>
            );
          })}
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
            <Button variant="secondary" icon={Trash2} label="Borrar" onPress={simularCarga} />
            <Button label="Deshabilitado" onPress={simularCarga} disabled />
          </View>
          <Button icon={ShoppingBag} label="Ancho completo" onPress={simularCarga} fullWidth />
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
          <InputField label="Categoría" value="Facturas" disabled />
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
