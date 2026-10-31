<!-- GERADO por scripts/sync-ai.mjs a partir de .claude/skills/tech-lead-review/references/standards.md. Edite a fonte e rode: pnpm ai:sync -->

# Tech Lead — padrões do Movva

Fonte primária: [`CLAUDE.md`](../../../../CLAUDE.md) e [`.claude/rules/`](../../../../.claude/rules).
Este arquivo registra o que o tech-lead cobra e **ainda não está escrito** em outro lugar.

---

## Camadas

```txt
interfaces/http (DTO) → domain/repositories (contrato) → data/repositories (impl)
  → domain/use-cases (service) → factories → presentation/hooks (React Query)
  → presentation/view-model → presentation/view → src/app (rota)
```

| Camada        | Onde vive                                                    | Pode                                                      | Não pode                      |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------- | ----------------------------- |
| DTO           | `src/shared/interfaces/http/<recurso>`                       | tipos                                                     | lógica                        |
| Contrato      | `src/modules/<m>/domain/repositories`                        | interface                                                 | implementação                 |
| Repositório   | `src/modules/<m>/data/repositories`                          | `AxiosInstance` injetado                                  | toast, navegação, React       |
| Service       | `src/modules/<m>/domain/use-cases`                           | regra de negócio, normalizar entrada, relançar `AppError` | framework                     |
| Factory       | `src/modules/<m>/factories`                                  | montar repositório + service                              | JSX, estado                   |
| Hook          | `src/modules/<m>/presentation/hooks`                         | React Query, toast                                        | JSX, axios                    |
| ViewModel     | `src/modules/<m>/presentation/view-model`                    | estado de tela, formulário, navegação                     | JSX, axios, componente visual |
| View          | `src/modules/<m>/presentation/view`                          | render, props do ViewModel                                | hook de dados, domain, data   |
| Rota          | `src/app/**`                                                 | ligar ViewModel + View                                    | lógica, estado                |
| Compartilhado | `src/shared/{brand,components,data,domain,interfaces,utils}` | o que mais de um módulo usa                               | depender de um módulo         |

`src/shared` nunca importa de `src/modules`.

---

## Estrutura de um módulo

```txt
src/modules/<modulo>/
├── domain/
│   ├── repositories/<nome>-repository-contract.ts
│   └── use-cases/<nome>.service.ts
├── data/repositories/<nome>-repository-impl.ts
├── factories/make-<nome>-service.ts
├── components/                      (opcional, só deste módulo)
└── presentation/
    ├── hooks/queries/<recurso>/use-<acao>-mutation.ts | use-<recurso>-query.ts
    ├── view-model/<tela>-view-model.ts + <tela>-schema.ts
    └── view/<tela>-view.tsx
```

---

## Estado

- Sessão/usuário: `useUserStore` (zustand + persist MMKV).
- Dados do servidor: React Query (cache) — não copie para zustand.
- Formulário: react-hook-form + yup no ViewModel.
- `useState` só para UI temporária (foco, mostrar senha, modal).

---

## Logs

- `console.log`/`debug`/`info` não vão para o `main`.
- `console.warn`/`console.error` tolerados em caminho de erro real.

---

## TypeScript

- Strict. Sem `any`; use `unknown` + narrowing (`instanceof AppError`).
- Tipos de props da View: `FC<XViewModel>` com `type XViewModel = ReturnType<typeof useXViewModel>`.
- Interfaces/DTOs exportados com `export type { ... }`.

---

## Nomenclatura

| Errado         | Certo                             |
| -------------- | --------------------------------- |
| `handleTest()` | `handleSignIn()`                  |
| `data`, `res`  | `signInResponse`, `userList`      |
| `loading`      | `isSubmitting`, `isLoadingOrders` |

### Sem erro de digitação

Dicionário em `NAME_TYPOS` no [`check-patterns.mjs`](../../../../.claude/skills/tech-lead-review/scripts/check-patterns.mjs) (lista aberta).
Já encontrados no Movva: `singin` → `signin`, `dashaborad` → `dashboard`.
Nunca adicione palavra que seja português válido.

### Sem placeholder

Reprovado: `foo`, `bar`, `asdf`, `xpto`, `temp1`, `data2`, `aaaa`.

### Mesmo conceito, mesmo nome

Antes de nomear algo novo, `grep` por equivalente existente. Um verbo por conceito
(`make*` para factory, `use*Mutation`/`use*Query` para hook, `*.service.ts` para service).

---

## Nativo e Expo

- Lib com código nativo (MMKV, Burnt...) → instalar com `npx expo install`, avisar que
  exige `npx expo prebuild --clean` e não roda no Expo Go.
- pnpm é estrito: dependência transitiva importada no código vira dependência direta.
- API exclusiva de plataforma em arquivo `.android.ts` / `.ios.ts`.
