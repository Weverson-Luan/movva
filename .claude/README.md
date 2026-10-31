# Claude Code / Cursor no Movva

Inspirado na orquestração do Jornada, adaptado para **white label**.

```txt
Agent  →  Rules  →  Skills  →  Código  →  Hooks (gate de qualidade)
```

| Pergunta                                  | Onde fica                                              |
| ----------------------------------------- | ------------------------------------------------------ |
| "Isso vale sempre?"                       | [`CLAUDE.md`](../CLAUDE.md) (carregado em toda sessão) |
| "Como devemos fazer nesta área?"          | Rule — [`rules/`](rules/)                              |
| "Como implementar, passo a passo?"        | Skill — [`skills/`](skills/)                           |
| "Quem executa / revisa?"                  | Agent — [`agents/`](agents/)                           |
| "Precisa ser verificado sempre, sozinho?" | Hook — [`hooks/`](hooks/)                              |

## Conteúdo

| Tipo  | Arquivo                     | Para quê                                                |
| ----- | --------------------------- | ------------------------------------------------------- |
| Rule  | `movva-white-label.md`      | cliente, tema, `config.json`, URLs, storage             |
| Rule  | `movva-data-api.md`         | camadas de dados, React Query, erros, toast             |
| Rule  | `movva-components.md`       | componentes, NativeWind, tailwind-variants              |
| Rule  | `movva-solution-options.md` | ≥ 2 abordagens antes de implementar                     |
| Skill | `create-screens`            | rota + View + ViewModel + schema                        |
| Skill | `create-api-flow`           | DTO → contrato → repositório → service → factory → hook |
| Skill | `create-components`         | componente reutilizável                                 |
| Skill | `add-client`                | cliente novo / campo novo em todos os clientes          |
| Skill | `tech-lead-review`          | gate + script `check-patterns.mjs` + rubrica            |
| Agent | `movva-tech-lead`           | revisão completa com veredito                           |
| Hook  | `tech-lead-audit.mjs`       | `PostToolUse`: revisa o arquivo recém-alterado          |
| Hook  | `tech-lead-audit-stop.mjs`  | `Stop`: revisa o diff antes de encerrar o turno         |

## Outros agentes (.cursor, .agents, AGENTS.md)

A fonte é sempre `CLAUDE.md` + `.claude/`. O `pnpm ai:sync` ([`scripts/sync-ai.mjs`](../scripts/sync-ai.mjs)) gera:

| Destino | Para quem | O quê |
|---------|-----------|-------|
| `.cursor/rules/*.mdc`, `.cursor/skills/`, `.cursor/agents/` | Cursor | rules com `globs`/`alwaysApply`, skills e agent |
| `.agents/skills/<skill do projeto>/` + `agents/openai.yaml` | Codex e agentes que seguem o padrão `.agents` | as 5 skills do projeto |
| `AGENTS.md` | Codex, Cursor, Gemini... | cópia do `CLAUDE.md` |

Escritos à mão (não gerados): `.cursor/rules/tech-lead-gate.mdc`, `.cursor/hooks*` e as
**skills externas** de `.agents/skills/`, trazidas do Jornada (Callstack, MIT) com uma seção
"Contexto Movva" no topo:

| Skill externa | Por que está aqui |
|---------------|-------------------|
| `react-native-best-practices` | performance; contexto: Expo, NativeWind, sem React Compiler, MMKV |
| `upgrading-react-native` | upgrade do Expo SDK validado cliente a cliente |
| `react-navigation` | opções de navegação aplicadas ao Expo Router (React Navigation embutido) |
| `validate-skills` | valida as skills (`pnpm ai:validate`) |

Ficaram de fora (não se aplicam a um app Expo white label): `github-actions` (build é no EAS),
brownfield, assess-migration, TV, create-library, react-compiler-audit.

Comandos:

```bash
pnpm ai:sync       # regenera .cursor, .agents (skills do projeto) e AGENTS.md
pnpm ai:validate   # valida skills: frontmatter, nome, links, referências
pnpm ai:check      # tech-lead no diff atual
```

## Um motor só

As regras automáticas moram em **um** arquivo:
[`skills/tech-lead-review/scripts/check-patterns.mjs`](skills/tech-lead-review/scripts/check-patterns.mjs).
Os hooks do Claude Code (`.claude/hooks`) e do Cursor (`.cursor/hooks`) importam dele,
então os dois nunca divergem. Para mudar uma regra, mude só ali (e a tabela da
[rubrica](skills/tech-lead-review/references/review-rubric.md)).

Rodar na mão:

```bash
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --git-diff
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --dir src
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs clients/movva/config.json
```

## Hooks

| Hook                       | Quando                          | Faz                                                                   |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `tech-lead-audit.mjs`      | após `Write`/`Edit`/`MultiEdit` | revisa o arquivo; BLOCKER/MAJOR reprova (exit 2)                      |
| `tech-lead-audit-stop.mjs` | fim do turno                    | revisa o diff do git; bloqueia o encerramento se houver BLOCKER/MAJOR |

Apoio em `hooks/lib/`: `hook-io.mjs` (payload, exit codes), `change-classifier.mjs`
(fast-path) e `gate.mjs` (mensagem e protocolo de aprovação).

## Waivers

Correção recusada pelo dev vira entrada em [`tech-lead-waivers.json`](tech-lead-waivers.json)
(regra + arquivo + motivo + data). É versionado: vale para o time.

## O que ficou de fora (e quando entra)

- **React Compiler audit** — o Movva não usa o plugin `react-compiler`. Entra se ele for ativado.
- **create-testing** — o projeto ainda não tem Jest. Entra junto com a configuração de testes.
- **Agent engenheiro** — as skills já cobrem a implementação; crie `movva-mobile-engineer`
  se quiser delegar features inteiras a um subagente.
