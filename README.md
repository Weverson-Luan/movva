# App White Label com Expo (SDK 58)

Um único código, vários apps na loja. Cada cliente tem nome, ícone, cores,
bundle ID, API e funcionalidades próprias.

## Estrutura

```
clients/
  movva/           config.json, icon.png, adaptive-icon.png, splash.png
  cinbal/          ...
src/
  app/                     rotas (Expo Router): cada arquivo é uma tela
    _layout.tsx            provedores globais e o Stack com as cores do cliente
    index.tsx              rota "/"
  modules/<módulo>/        domain, data, factories e presentation (view, view-model, hooks)
  shared/
    brand/brand.ts           lê a marca do cliente atual (expo-constants)
    brand/BrandProvider.tsx  useBrand, useTheme, useFeature, <Feature>
    components/ui/           componentes reutilizáveis (Input, InputControlled...)
    data/                    cliente HTTP (axios), storage (MMKV) e stores (zustand)
    interfaces/http/         tipos das requisições e respostas da API
app.config.js      escolhe o cliente pela variável CLIENT
tailwind.config.js cores e raio do NativeWind, lidos do config.json do cliente
global.css         entrada do Tailwind (importado no src/app/_layout.tsx)
index.js           ponto de entrada: filtra um aviso do NativeWind e carrega o Expo Router
eas.json           um perfil de build/submit por cliente
scripts/
  new-client.js    cria um cliente novo
  build-all.sh     build de todos os clientes
  update-all.sh    atualização OTA para todos os clientes
```

## Começando

```bash
npm install
npm run start:movva       # ou: npm run start:cinbal
```

Para conferir a configuração gerada de um cliente:

```bash
CLIENT=cinbal npm run config
```

> No Windows (PowerShell): `$env:CLIENT="cinbal"; npx expo start --clear`.
> Os scripts `start:*` já usam `cross-env` e funcionam em qualquer sistema.

Sempre use `--clear` ao trocar de cliente, para o Metro não reaproveitar o cache do anterior.

### API de cada cliente

Cada `clients/<cliente>/config.json` tem duas URLs:

- `apiUrl`: usada nos builds de produção.
- `apiUrlDev`: usada em desenvolvimento (`__DEV__`), por exemplo `http://localhost:3001`.
  O `localhost` é trocado automaticamente pelo IP do computador que roda o Metro,
  então funciona no simulador, no emulador Android e no celular. A API local precisa
  escutar em `0.0.0.0`, não só em `127.0.0.1`.

## Adicionar um cliente novo

```bash
npm run new-client -- mercado "Mercado Bom Preço" br.com.bompreco.app
```

O script copia o cliente `movva`, ajusta o `config.json` e adiciona os perfis
`mercado` e `mercado-preview` no `eas.json`. Depois:

1. Troque `icon.png` (1024×1024, sem transparência), `adaptive-icon.png` e `splash.png`.
2. Ajuste as cores do `theme` e as `features` no `config.json`.
3. `CLIENT=mercado npx eas init` cria o projeto EAS do cliente. Cole o
   `projectId` em `easProjectId`.
4. `npx eas build --profile mercado --platform all`

## Builds e publicação

| Ação                              | Comando                                         |
| --------------------------------- | ----------------------------------------------- |
| Build de teste (instala por link) | `npx eas build --profile movva-preview`         |
| Build de produção de um cliente   | `npx eas build --profile movva --platform all`  |
| Build de todos                    | `npm run build:all`                             |
| Enviar para as lojas              | `npx eas submit --profile movva --platform all` |
| Atualização OTA de todos          | `npm run update:all -- "Corrige tela de login"` |

A `version` e o `buildNumber` de cada cliente ficam no `config.json` dele.
Aumente o `buildNumber` a cada envio para a loja.

## Navegação com Expo Router

As rotas ficam em `src/app/`. O nome do arquivo vira o caminho:

| Arquivo                    | Rota           |
| -------------------------- | -------------- |
| `src/app/index.tsx`        | `/`            |
| `src/app/pedidos.tsx`      | `/pedidos`     |
| `src/app/pedidos/[id].tsx` | `/pedidos/123` |

Mantenha os arquivos de rota curtos e coloque a tela em `src/modules/<módulo>/presentation/view/`
(`export default DashboardView`). Para navegar, use `<Link href="/pedidos">` ou
`router.push("/pedidos")`. Os caminhos são tipados: os tipos são gerados em
`.expo/types` quando o `expo start` roda.

O cabeçalho já usa as cores do cliente (definido no `_layout.tsx`). Para
esconder em uma tela, use `<Stack.Screen name="..." options={{ headerShown: false }} />`.

## Estilos com NativeWind

Os estilos são feitos com [NativeWind](https://www.nativewind.dev) (Tailwind para
React Native) usando `className`. As cores de cada cliente viram classes:

| Campo do `theme` | Classes                                           |
| ---------------- | ------------------------------------------------- |
| `primary`        | `bg-primary`, `text-primary`, `border-primary`... |
| `primaryText`    | `text-primary-text`                               |
| `background`     | `bg-background`                                   |
| `surface`        | `bg-surface`                                      |
| `text`           | `text-text`                                       |
| `muted`          | `text-muted`                                      |
| `danger`         | `text-danger`, `border-danger` (erros)            |
| `warning`        | `text-warning` (atenção, ex.: perto do repouso)   |
| `radius`         | `rounded-brand`                                   |

```tsx
<View className="rounded-brand bg-surface p-4">
  <Text className="font-semibold text-primary">Olá</Text>
</View>;
```

O `tailwind.config.js` lê o `config.json` do cliente indicado em `CLIENT`, então
as classes são as mesmas para todos e só os valores mudam. Por isso o `--clear`
ao trocar de cliente é obrigatório. Para adicionar uma cor nova ao tema,
coloque-a em todos os `config.json`, no tipo `Theme` e no `tailwind.config.js`.

## Qualidade de código (Biome + Husky)

O [Biome](https://biomejs.dev) faz a formatação e o lint (configurado em `biome.json`).

| Comando          | O que faz                                     |
| ---------------- | --------------------------------------------- |
| `pnpm check`     | verifica formatação, lint e ordem dos imports |
| `pnpm check:fix` | corrige o que for seguro                      |
| `pnpm format`    | só formata                                    |
| `pnpm lint`      | só lint                                       |

O [Husky](https://typicode.github.io/husky) roda `.husky/pre-commit` a cada commit:
formata os arquivos do commit com o Biome e roda o `typecheck`. Se houver erro,
o commit é bloqueado. Os hooks são instalados pelo `pnpm install` (script `prepare`).

No VS Code, instale a extensão **Biome** (sugerida em `.vscode/extensions.json`):
o arquivo é formatado ao salvar.

## Regras do código

- **Toda tela segue o mesmo padrão**: bloco `IMPORTS` no topo, componente como
  arrow function em `const` e um único `export default` no bloco `EXPORTS`.
  Vale para as rotas em `src/app/` e as views dos módulos.

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

- **Imports entre pastas usam `@/`**, que aponta para `src/`:
  `import { useBrand } from "@/shared/brand/BrandProvider"`. Caminho relativo só para
  arquivos da mesma pasta (`./brand`). O alias é definido em `paths` no `tsconfig.json`.
- **Nunca use cor fixa** em componente (nem `bg-red-500`). Use as classes do
  tema (`bg-primary`) ou, fora do `className`, `useTheme()`.
- **Nunca faça `if (client === 'movva')`**. Crie uma feature em `features` e use
  `useFeature("nome")` ou `<Feature name="nome">`. Ao adicionar uma feature
  nova, coloque-a no tipo `Features` em `src/shared/brand/brand.ts` e em todos os
  `config.json`.
- Textos com o nome do app vêm de `useBrand().displayName`.

## Contas das lojas (importante)

- **Apple:** apps feitos a partir de um mesmo template precisam ser publicados
  na **conta Apple Developer de cada cliente** (diretriz 4.2.6). Peça ao
  cliente para criar a conta e te adicionar como Admin ou App Manager. Depois
  preencha `ascAppId` e `appleTeamId` no `eas.json`.
- **Google Play:** o ideal é usar também a conta do cliente. Coloque a chave da
  conta de serviço em `clients/<id>/google-service-account.json`. Esse
  arquivo está no `.gitignore` e nunca deve ir para o repositório.
- Os ícones atuais são provisórios (só a inicial do nome).
