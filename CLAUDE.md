# Movva — instruções para agentes

App white label com Expo (SDK 58), Expo Router, NativeWind e Biome. Leia o
`README.md` para a estrutura e as regras do código; o resumo obrigatório está abaixo.

## Padrão de tela (obrigatório)

Toda tela (rotas em `src/app/` e views em `src/modules/<módulo>/presentation/view/`)
segue exatamente este formato:

```tsx
/**
 * IMPORTS
 */
import { Text, View } from "react-native";

const SingIn = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>login</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export default SingIn;
```

- Bloco `/** IMPORTS */` no topo e `/** EXPORTS */` no final.
- Componente como arrow function em `const`, com `return` explícito.
- Um único `export default` no bloco EXPORTS; nada de `export function`.
- Componentes auxiliares da tela também são `const` arrow, declarados antes da tela.

## Outras regras

- Imports entre pastas usam `@/` (aponta para `src/`).
- Aspas duplas e ponto e vírgula (Biome). Rode `pnpm check` antes de terminar.
- Estilos com `className` (NativeWind) e só cores do tema (`bg-primary`, `text-muted`...).
- Nada de `if (client === "...")`: use `features` do `config.json` com `useFeature`/`<Feature>`.
