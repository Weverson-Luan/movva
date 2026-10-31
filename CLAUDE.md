# Movva — instruções para agentes

App **white label** com Expo (SDK 58): um código, um app por cliente. Este arquivo é
carregado em toda sessão e reúne o que vale **sempre**; as regras por área e os
passo a passo ficam em `.claude/` (ver [.claude/README.md](.claude/README.md)).
Estrutura de pastas e comandos: [README.md](README.md).

Pergunta de controle em toda mudança: **"isso funciona igual para um cliente que ainda não existe?"**

---

# Arquitetura

Fluxo obrigatório (não pule camadas):

```txt
interfaces/http (DTO) → domain/repositories (contrato) → data/repositories (impl)
  → domain/use-cases (service) → factory → presentation/hooks (React Query)
  → presentation/view-model → presentation/view → src/app (rota)
```

- Código de feature em `src/modules/<módulo>/`; o que mais de um módulo usa em `src/shared/`.
- **Rota** (`src/app`) só liga ViewModel e View: `<XView {...useXViewModel()} />`.
- **View só recebe props do ViewModel** (`FC<XViewModel>`); não chama hook de dados nem importa domain/data.
- **ViewModel não renderiza JSX**, não importa componente visual nem axios.
- **Domínio** (contratos, services, erros) é TypeScript puro.
- **Erros**: o interceptor converte em `AppError` com a mensagem do backend; o service
  relança; o hook mostra o toast (`onError: showErrorToast`). Nunca `catch {}` vazio.

# Padrão de tela (obrigatório)

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

# Outras regras

- Imports entre pastas usam `@/` (aponta para `src/`).
- Aspas duplas e ponto e vírgula (Biome). Rode `pnpm check` antes de terminar.
- Estilos com `className` (NativeWind) e só cores do tema (`bg-primary`, `text-muted`...).
- Nada de `if (client === "...")`: use `features` do `config.json` com `useFeature`/`<Feature>`.
- Nada de cor fixa, paleta padrão do Tailwind (`bg-gray-200`) ou URL fixa no código.
- Lib com código nativo: `npx expo install`, e avise que exige `prebuild` (não roda no Expo Go).

# Opções antes de implementar

Tarefa com mais de um caminho razoável começa com **no mínimo duas abordagens**,
impacto de cada uma (white label, arquitetura, nativo, esforço, evolução), uma
recomendação e o conceito por trás; o dev escolhe via `AskUserQuestion`.
Exceções: fast-path, abordagem já definida pelo dev, correção de achado do gate, caminho único.
Protocolo: [.claude/rules/movva-solution-options.md](.claude/rules/movva-solution-options.md).

# Regras por área

Consulte antes de mexer nestas áreas:

- **White label** (cliente, tema, `config.json`, URLs) → [.claude/rules/movva-white-label.md](.claude/rules/movva-white-label.md)
  (escopo: `src/**`, `clients/**`, `app.config.js`, `tailwind.config.js`)
- **Dados, React Query, erros e toast** → [.claude/rules/movva-data-api.md](.claude/rules/movva-data-api.md)
  (escopo: `src/modules/*/{domain,data,factories,presentation/hooks,presentation/view-model}`, `src/shared/{data,domain,interfaces}`)
- **Componentes e estilo** → [.claude/rules/movva-components.md](.claude/rules/movva-components.md)
  (escopo: `src/shared/components/**`, `src/modules/*/components/**`, views)

# Quality gate (sempre aplicado)

Toda mudança de código feita por IA passa pelo tech-lead. Os hooks em
[.claude/hooks/](.claude/hooks/) rodam sozinhos após `Write`/`Edit` e no fim do turno.

**Fast-path** — só texto, classe do tema ou espaçamento em arquivo visual, sem lógica,
passa direto. Critério: [.claude/skills/tech-lead-review/references/fast-path.md](.claude/skills/tech-lead-review/references/fast-path.md).

**Gate reprovado (BLOCKER/MAJOR)** — pare a tarefa e, para cada achado:

1. mostre o trecho atual (`arquivo:linha`);
2. proponha a correção (diff curto);
3. **cite a fonte da regra** (arquivo + seção, como o script informa);
4. pergunte com `AskUserQuestion`: `Aceitar correção` | `Recusar (manter como está)` | `Ajustar proposta`;
5. aceitou → aplique e siga; recusou → registre o waiver e siga:
   `node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --waive <REGRA> <arquivo> "<motivo>"`.

Nunca aplique nem descarte a correção sem a resposta do dev.
Protocolo completo: [.claude/skills/tech-lead-review/SKILL.md](.claude/skills/tech-lead-review/SKILL.md).

# Skills (como implementar)

- **create-screens** — tela: rota + View + ViewModel + schema.
- **create-api-flow** — endpoint novo: DTO → contrato → repositório → service → factory → hook.
- **create-components** — componente reutilizável com NativeWind + tailwind-variants.
- **add-client** — cliente novo ou campo/cor/feature novo em todos os clientes.
- **tech-lead-review** — revisar o código contra os padrões (gate de qualidade).

# Skills externas (referência)

Guias da Callstack (MIT) em [.agents/skills/](.agents/skills/), cada um com uma seção
**"Contexto Movva"** no topo que diz o que muda aqui. Leia o `SKILL.md` quando o assunto aparecer:

- **react-native-best-practices** — performance (FPS, TTI, bundle, memória, listas).
- **upgrading-react-native** — upgrade do Expo SDK, validado em todos os clientes.
- **react-navigation** — opções de header, sheet, tabs e safe area aplicadas ao Expo Router.
- **validate-skills** — valida skills/agents/rules: `pnpm ai:validate`.

`.cursor/`, as skills do projeto em `.agents/skills/` e o `AGENTS.md` são **gerados** a partir
deste arquivo e de `.claude/`: depois de editar qualquer um deles, rode `pnpm ai:sync`.

# Agent

- **movva-tech-lead** — revisão de arquitetura, white label e padrões, com veredito e fonte da regra.
  Ver [.claude/agents/movva-tech-lead.md](.claude/agents/movva-tech-lead.md).
