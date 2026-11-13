// Plugin de Babel: convierte `import { Plus, Trash2 } from 'lucide-react-native'` en un import por ícono
// (`import Plus from 'lucide-react-native/icons/plus'`).
//
// Por qué: Metro no descarta lo que no se usa (no hay tree shaking), así que el import por nombre del índice arrastraba
// los ~2000 íconos de Lucide: 2,1 MB, un tercio del bundle de la APK y de la web. Así entran solo los que se usan.
// El código de la app no cambia: se sigue importando por nombre desde 'lucide-react-native' (CLAUDE.md, Íconos).
//
// La tabla nombre → archivo sale del índice del paquete, así sigue sola a cada versión nueva de Lucide. Lo que no es un
// ícono (el tipo LucideIcon, LucideProvider…) se queda en el import de siempre.
/* global __dirname */
const fs = require('fs');
const path = require('path');

const PAQUETE = 'lucide-react-native';

function leerTabla() {
  // El paquete no exporta su package.json: se busca el índice desde la raíz del proyecto
  const indice = fs.readFileSync(path.join(__dirname, '..', 'node_modules', PAQUETE, 'dist/esm/lucide-react-native.mjs'), 'utf8');
  const tabla = new Map();
  for (const [, nombres, archivo] of indice.matchAll(/export \{ ([^}]+) \} from '\.\/icons\/([a-z0-9-]+)\.mjs'/g)) {
    for (const [, nombre] of nombres.matchAll(/default as (\w+)/g)) tabla.set(nombre, archivo);
  }
  if (tabla.size === 0) throw new Error(`iconosLucide: no encontré los íconos en el índice de ${PAQUETE}. ¿Cambió su formato?`);
  return tabla;
}

let tabla;

module.exports = function iconosLucide({ types: t }) {
  return {
    name: 'iconos-lucide',
    visitor: {
      // `export { Plus } from 'lucide-react-native'` y `export * from …` arrastrarían el índice entero sin avisar: se
      // cortan acá, con el motivo. Los íconos se importan por nombre y se usan con el atom Icon
      ExportNamedDeclaration(ruta) {
        if (ruta.node.source?.value === PAQUETE) throw ruta.buildCodeFrameError(`iconosLucide: no reexportes desde '${PAQUETE}': importá el ícono por nombre donde se usa.`);
      },
      ExportAllDeclaration(ruta) {
        if (ruta.node.source.value === PAQUETE) throw ruta.buildCodeFrameError(`iconosLucide: no reexportes desde '${PAQUETE}': importá el ícono por nombre donde se usa.`);
      },
      ImportDeclaration(ruta) {
        const { node } = ruta;
        if (node.source.value !== PAQUETE || node.importKind === 'type') return;
        tabla ??= leerTabla();
        // `import * as Iconos` o `import Lucide from` traen el índice entero: se cortan con el motivo
        if (node.specifiers.some((spec) => !t.isImportSpecifier(spec))) {
          throw ruta.buildCodeFrameError(`iconosLucide: importá cada ícono por nombre (import { Plus } from '${PAQUETE}'), no el paquete entero.`);
        }

        const porIcono = [];
        const quedan = [];
        for (const spec of node.specifiers) {
          const nombre = t.isImportSpecifier(spec) && spec.importKind !== 'type' && t.isIdentifier(spec.imported) ? spec.imported.name : null;
          const archivo = nombre && tabla.get(nombre);
          if (archivo) {
            porIcono.push(
              t.importDeclaration([t.importDefaultSpecifier(t.identifier(spec.local.name))], t.stringLiteral(`${PAQUETE}/icons/${archivo}`))
            );
          } else quedan.push(spec);
        }
        if (porIcono.length === 0) return;

        if (quedan.length === 0) ruta.replaceWithMultiple(porIcono);
        else {
          node.specifiers = quedan;
          ruta.insertAfter(porIcono);
        }
      },
    },
  };
};
