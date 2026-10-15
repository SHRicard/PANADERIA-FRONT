// Los .svg llegan como componentes de react-native-svg (ver metro.config.js)
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const Svg: FC<SvgProps>;
  export default Svg;
}
