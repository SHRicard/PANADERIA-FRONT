// El preset de Expo de siempre (con el React Compiler de app.json) más un plugin propio: los íconos de Lucide se
// importan de a uno, así el bundle no lleva los ~2000 (babel/iconosLucide.js)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['./babel/iconosLucide'],
  };
};
