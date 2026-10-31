<!-- GERADO por scripts/sync-ai.mjs a partir de .claude/skills/tech-lead-review/references/review-rubric.md. Edite a fonte e rode: pnpm ai:sync -->

# Tech Lead — rubrica, regras e fontes

## Severidade

| Nível       | Significado                                                                                              | Ação                              |
| ----------- | -------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **BLOCKER** | Quebra camada (`view` falando com dados, domínio com framework) ou quebra white label (`client === ...`) | Bloqueia a tarefa                 |
| **MAJOR**   | Viola convenção escrita do projeto (cor fixa, URL fixa, padrão de tela, erro engolido...)                | Bloqueia a tarefa                 |
| **MINOR**   | Desvio de estilo/estrutura, melhoria opcional                                                            | Corrigir se já estiver no arquivo |
| **NIT**     | Preferência, texto, comentário                                                                           | Opcional                          |

Veredito: qualquer **BLOCKER** ou **MAJOR** → `REQUEST_CHANGES`. Caso contrário `APPROVE`.

---

## Regras automáticas (`scripts/check-patterns.mjs`)

| Regra                        | Sev.    | Onde                                                   | Detecta                                                                | Fonte                                              |
| ---------------------------- | ------- | ------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------- |
| `WL_CLIENT_CONDITION`        | BLOCKER | `src/**`                                               | `client === "x"`, `brand.client !== ...`                               | `movva-white-label.md` § Comportamento por cliente |
| `VIEW_DATA_LAYER`            | BLOCKER | `presentation/view`                                    | import de `domain/`, `data/`, `factories/`, `shared/data`              | `CLAUDE.md` § Arquitetura                          |
| `VIEW_HTTP`                  | BLOCKER | view, rota                                             | import de axios / `shared/data/infra/http`                             | `movva-data-api.md` § Onde cada coisa vive         |
| `VIEWMODEL_HTTP`             | BLOCKER | view-model                                             | import de axios / `shared/data/infra/http`                             | `movva-data-api.md` § Onde cada coisa vive         |
| `VIEWMODEL_JSX`              | BLOCKER | view-model                                             | JSX                                                                    | `CLAUDE.md` § Arquitetura                          |
| `VIEWMODEL_UI_IMPORT`        | BLOCKER | view-model                                             | import de componente/variants                                          | `create-screens` § ViewModel                       |
| `DOMAIN_FRAMEWORK`           | BLOCKER | `*/domain/**`                                          | import de react, react-native, axios, expo, React Query, burnt...      | `movva-data-api.md` § Onde cada coisa vive         |
| `REPOSITORY_UI`              | BLOCKER | `data/repositories`                                    | import de react, expo-router, toast                                    | `movva-data-api.md` § Onde cada coisa vive         |
| `WL_HARDCODED_COLOR`         | MAJOR   | `src/**`                                               | `"#fff"`, `rgba(...)` em string                                        | `movva-white-label.md` § Cores e tema              |
| `WL_TAILWIND_PALETTE`        | MAJOR   | `src/**`                                               | `bg-gray-200`, `text-white`, `border-red-500`...                       | `movva-white-label.md` § Cores e tema              |
| `WL_HARDCODED_URL`           | MAJOR   | `src/**`                                               | `"https://..."`                                                        | `movva-white-label.md` § API e URLs                |
| `CLIENT_CONFIG_PARITY`       | MAJOR   | `clients/*/config.json`                                | chave faltando entre clientes ou fora dos tipos `Theme`/`Features`     | `movva-white-label.md` § Configuração do cliente   |
| `VIEW_DIRECT_RQ`             | MAJOR   | view                                                   | import de React Query / hook do módulo                                 | `CLAUDE.md` § Arquitetura                          |
| `VIEW_RQ_CALL`               | MAJOR   | view                                                   | chamada de `useQuery`/`useMutation`                                    | `CLAUDE.md` § Arquitetura                          |
| `ROUTE_LOGIC`                | MAJOR   | `src/app/**` (exceto `_layout`)                        | `useState`, `useEffect`, `useForm`, `useQuery`, import de dados        | `create-screens` § Rota                            |
| `COMPONENT_BUSINESS`         | MAJOR   | componentes                                            | import de dados / React Query                                          | `movva-components.md` § Responsabilidade           |
| `AXIOS_OUTSIDE_DATA`         | MAJOR   | fora de `shared/data/infra/http` e `data/repositories` | import de axios                                                        | `movva-data-api.md` § Onde cada coisa vive         |
| `AXIOS_ERROR_OUTSIDE_MAPPER` | MAJOR   | fora de `shared/data/infra/http`                       | `isAxiosError(`, `AxiosError`                                          | `movva-data-api.md` § Erros                        |
| `TOAST_OUTSIDE_PRESENTATION` | MAJOR   | domain, data, factories                                | import de `burnt` / `@/shared/utils/toast`                             | `movva-data-api.md` § Erros                        |
| `SWALLOWED_ERROR`            | MAJOR   | `src/**`                                               | `catch {}` vazio                                                       | `movva-data-api.md` § Erros                        |
| `SCREEN_PATTERN`             | MAJOR   | view e rota `.tsx`                                     | sem bloco IMPORTS/EXPORTS, sem `export default`, com `export function` | `CLAUDE.md` § Padrão de tela                       |
| `DEEP_RELATIVE_IMPORT`       | MAJOR   | `src/**`                                               | `from "../../"`                                                        | `CLAUDE.md` § Outras regras                        |
| `DEBUG_CONSOLE`              | MAJOR   | `src/**`                                               | `console.log/debug/info`                                               | `standards.md` § Logs                              |
| `NAMING_TYPO`                | MAJOR   | `src/**`                                               | `singin`, `dashaborad`, `sucess`...                                    | `standards.md` § Nomenclatura                      |
| `NAMING_PLACEHOLDER`         | MAJOR   | `src/**`                                               | `foo`, `temp1`, `aaaa`                                                 | `standards.md` § Nomenclatura                      |
| `MUTATE_ASYNC_IN_VIEWMODEL`  | MINOR   | view-model                                             | `.mutateAsync(`                                                        | `movva-data-api.md` § React Query                  |
| `PARENT_RELATIVE_IMPORT`     | MINOR   | `src/**`                                               | `from "../x"`                                                          | `CLAUDE.md` § Outras regras                        |
| `SCREEN_SAFE_AREA`           | MAJOR   | Views (`presentation/view`)                            | tela sem `<Screen` na raiz                                             | `CLAUDE.md` § Padrão de tela                       |
| `SAFE_AREA_OUTSIDE_SCREEN`   | MINOR   | Views e componentes de módulo                          | `useSafeAreaInsets` / `SafeAreaView` / `KeyboardAvoidingView`          | `CLAUDE.md` § Padrão de tela                       |
| `COMPONENT_FOLDER`           | MAJOR   | componentes (`shared` e módulos)                       | `.tsx` solto em `components/` ou pasta sem `index.tsx`                 | `movva-components.md` § Estrutura                  |
| `COMPONENT_PROPS_INLINE`     | MINOR   | `.tsx` de componente                                   | `type XProps =` no `.tsx` (vai para `interface.ts`)                    | `movva-components.md` § Estrutura                  |
| `COMPONENT_TV_INLINE`        | MINOR   | `.tsx` de componente                                   | `tv({` no `.tsx` (vai para `<componente>.variants.ts`)                 | `movva-components.md` § Estrutura                  |
| `STYLESHEET`                 | MINOR   | apresentação                                           | `StyleSheet.create`                                                    | `movva-components.md` § Estilo                     |
| `INLINE_STYLE`               | MINOR   | apresentação                                           | `style={{`                                                             | `movva-components.md` § Estilo                     |
| `TS_ANY`                     | MINOR   | `src/**`                                               | `: any`, `as any`                                                      | `standards.md` § TypeScript                        |

Silenciar uma linha: comentário `tech-lead-ignore` na própria linha (use pouco — o
caminho normal é o waiver, que registra o motivo).

---

## Checklist manual (o que o script não vê)

- [ ] Funciona igual para um cliente que ainda não existe? Nada depende do nome do cliente
- [ ] Feature nova está em **todos** os `config.json` e no tipo `Features`
- [ ] Campo novo do `config.json` lido em runtime está no `extra` do `app.config.js` e no tipo `Brand`
- [ ] Rota em `src/app` só compõe: `<XView {...useXViewModel()} />`
- [ ] View recebe tudo por props (`FC<XViewModel>`); não chama hook de dados
- [ ] ViewModel é dono do estado de tela; `useState` só para UI temporária
- [ ] Nova chamada de API tem DTO → contrato → impl → service → factory → hook
- [ ] Service relança como `AppError`; toast só no `onError` do hook
- [ ] Mensagem de erro é a do backend (não reescrita no app)
- [ ] Componente usado por 2+ módulos está em `src/shared/components`
- [ ] Cor de ícone / placeholder via `useTheme()`
- [ ] Dependência nativa nova (MMKV, Burnt...) avisada: exige `prebuild` e não roda no Expo Go
- [ ] Nomes expressam intenção e o mesmo conceito tem o mesmo nome no projeto
  (`grep` antes de nomear: não ter `makeAuthService` e `makeAuthServiceFactory` para a mesma coisa)
- [ ] Nada de segredo, token ou URL fixa

---

## Como apresentar ao dev

Um bloco por achado:

````markdown
### MAJOR · WL_TAILWIND_PALETTE · src/shared/components/ui/input/input.variants.ts:12

**Hoje**
```ts
wrapper: "border-b border-gray-200",
```

**Correção proposta**
```ts
wrapper: "border-b border-muted/40",
```

**Fonte:** `.claude/rules/movva-white-label.md` § Cores e tema
````

Depois de listar todos, **uma** `AskUserQuestion` com
`Aceitar correção` | `Recusar (manter como está)` | `Ajustar proposta`.

---

## Relatório (revisão completa)

```markdown
# Tech Lead Review — <escopo>

## Resumo

- BLOCKER: N | MAJOR: N | MINOR: N | NIT: N
- Veredito: **APPROVE** | **REQUEST CHANGES**

## Achados

| Sev. | Local | Regra | Achado | Correção | Fonte |
| ---- | ----- | ----- | ------ | -------- | ----- |

## Follow-ups (não bloqueiam)
```
