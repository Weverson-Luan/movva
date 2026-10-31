---
name: add-client
description: Adiciona um cliente novo ao white label do Movva (config.json, ícones, perfis EAS, projeto EAS) ou adiciona um campo/cor/feature novo a todos os clientes. Use quando pedirem um app novo para um cliente ou uma configuração que varia por cliente.
---

<!-- GERADO por scripts/sync-ai.mjs a partir de .claude/skills/add-client/SKILL.md. Edite a fonte e rode: pnpm ai:sync -->

# SKILL — Cliente novo / configuração por cliente

## A) Cliente novo

### 1. Gerar a pasta

```bash
npm run new-client -- <id> "<Nome do App>" <bundle.id>
# ex.: npm run new-client -- mercado "Mercado Bom Preço" br.com.bompreco.app
```

O script (`scripts/new-client.js`) copia o cliente base, ajusta `name`, `slug`,
`scheme`, `bundleId`, `apiUrl` e cria os perfis `<id>` e `<id>-preview` no `eas.json`.

`<id>`: minúsculo, números e hífen. `bundleId`: **definitivo** depois de publicado na loja — confirme com o cliente.

### 2. Ajustar `clients/<id>/config.json`

- `theme`: todas as cores (inclusive `danger`) e `radius`. Contraste de `primaryText` sobre `primary`.
- `brandBackground`: fundo do ícone (Android) e do splash. Separado do `primary` para a marca
  ter cor própria (ex.: Movva usa preto no ícone e vermelho nos botões). Sem ele, usa `theme.primary`.
- `features`: liga/desliga o que o cliente contratou.
- `apiUrl` / `apiUrlDev`, `supportEmail`.
- Não remova chaves: todos os clientes têm as mesmas (check `CLIENT_CONFIG_PARITY`).

### 3. Assets em `clients/<id>/`

| Arquivo             | Formato                                                 |
| ------------------- | ------------------------------------------------------- |
| `icon.png`          | 1024×1024, sem transparência                            |
| `adaptive-icon.png` | 1024×1024, conteúdo no centro (fundo = `brandBackground`) |
| `splash.png`        | logo, fundo transparente (fundo = `brandBackground`)    |
| `logo.png`          | logo da splash animada, sobre o `theme.background`     |
| `login-logo.png`    | marca do login, 1024×1024, fundo transparente (o nome vem do `displayName`) |
| `wordmark.png`      | nome da marca desenhado, fundo transparente, recortado justo (cabeçalhos via `BrandWordmark`) |
| `onboarding/1..3.png` | ilustração de cada slide (textos em `onboarding.slides`) |

Textos de abertura no `config.json`: `tagline`, `loaderIcon` (nome do MaterialCommunityIcons)
e `onboarding.slides` (um por imagem). Sem onboarding: `features.onboarding: false`.

### 4. Projeto EAS e lojas

```bash
CLIENT=<id> npx eas init          # mostra o projectId → cole em easProjectId
```

- iOS: conta Apple Developer **do cliente** (diretriz 4.2.6); preencha `ascAppId`/`appleTeamId` no `eas.json`.
- Android: `clients/<id>/google-service-account.json` (está no `.gitignore`).

### 5. Validar

```bash
CLIENT=<id> npm run config                     # config gerada
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs clients/<id>/config.json
CLIENT=<id> npx expo prebuild --clean && npx expo run:android
```

Confira ícone, splash, cores e nome no aparelho (não no Expo Go — ele mostra o ícone do Expo).
Adicione o script `start:<id>` no `package.json`.

---

## B) Campo novo para todos os clientes

| Tipo                                     | Onde mexer                                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Feature**                              | `features` em todos os `config.json` + tipo `Features` (`src/shared/brand/brand.ts`); usar com `useFeature`/`<Feature>` |
| **Cor do tema**                          | `theme` em todos os `config.json` + tipo `Theme` + `tailwind.config.js` (`colors`) + tabela no `README.md`              |
| **Outro campo lido no app**              | todos os `config.json` + `extra` no `app.config.js` + tipo `Brand`                                                      |
| **Campo só de build** (ícone, bundle...) | todos os `config.json` + uso no `app.config.js`                                                                         |

Depois: `--clear` no Metro (as cores entram no bundle) e o check de paridade:

```bash
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs clients/*/config.json
```

`app.config.js` e `eas.json` são somente leitura no disco: `chmod u+w` para editar e `chmod u-w` depois.
