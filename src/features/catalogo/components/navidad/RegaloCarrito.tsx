import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { BotonCarrito, useCarrito } from '@/features/carrito';
import { useTheme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { Ilustracion } from './Ilustracion';

// Al sumar un producto, el regalo da un saltito: crece, se tuerce para un lado y para el otro, y vuelve
const SALTITO: CSSAnimationKeyframes = {
  '0%': { transform: [{ scale: 1 }, { rotate: '0deg' }] },
  '25%': { transform: [{ scale: 1.25 }, { rotate: '-10deg' }] },
  '50%': { transform: [{ scale: 0.95 }, { rotate: '8deg' }] },
  '75%': { transform: [{ scale: 1.08 }, { rotate: '-4deg' }] },
  '100%': { transform: [{ scale: 1 }, { rotate: '0deg' }] },
};

/**
 * El carrito de Navidad: un regalo (el mismo `BotonCarrito`, con otro dibujo y sin el recuadro) que da un saltito cada
 * vez que cambia cuántos productos lleva. Quieto con «reducir movimiento»
 */
export function RegaloCarrito({ nombre = 'regaloRojo' }: { nombre?: NombreAssetNavidad }) {
  const theme = useTheme();
  const calma = useReducedMotion();
  const { unidades } = useCarrito();

  return (
    <BotonCarrito
      sinMarco
      dibujo={
        // Con otra `key` se vuelve a montar: el saltito arranca de nuevo
        <Animated.View
          key={unidades}
          style={!calma && unidades > 0 && { animationName: SALTITO, animationDuration: '0.6s', animationTimingFunction: 'ease-out' }}
        >
          <Ilustracion nombre={nombre} alto={theme.sizes.regaloCarrito} />
        </Animated.View>
      }
    />
  );
}
