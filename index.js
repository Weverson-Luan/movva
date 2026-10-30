// Ponto de entrada do app.
//
// O NativeWind (react-native-css-interop) acessa o ImageBackground ao iniciar
// para habilitar `className` nele, e o React Native 0.88 avisa que esse
// componente está depreciado. O aviso é inofensivo (não usamos ImageBackground),
// então filtramos só essa mensagem. Tem que rodar antes de carregar o app,
// por isso o `require` em vez de `import` (imports sobem para o topo).
const warn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].startsWith('ImageBackground is deprecated')) return;
  warn(...args);
};

// As rotas ficam em src/app (Expo Router).
require('expo-router/entry');
