---
name: validate-skills
description: Validates the Movva skills (.claude/skills, .agents/skills, .cursor/skills) against the agentskills.io spec and Claude Code best practices, and checks the generated copies are in sync. Use after creating or editing a skill, rule or agent, or via /validate-skills.
license: MIT
metadata:
  author: Callstack (adaptado para o Movva)
  tags: validation, linting, skill-authoring
---

# Validate Skills

Valida as skills do Movva contra a spec do agentskills.io e as boas práticas do Claude Code.

## Contexto Movva (white label)

- **Fonte das skills do projeto:** `.claude/skills/` (e `.claude/agents/`, `.claude/rules/`, `CLAUDE.md`).
- **Gerados** por `pnpm ai:sync` (não editar à mão): `.cursor/skills/`, `.cursor/rules/*.mdc`,
  `.cursor/agents/`, as skills do projeto em `.agents/skills/` e o `AGENTS.md`.
- **Externas** (Callstack, MIT) em `.agents/skills/`: `react-native-best-practices`,
  `upgrading-react-native`, `react-navigation`, `validate-skills` — cada uma com um bloco
  "Contexto Movva" logo após o título.
- O Biome **não** formata esses Markdown (`biome.json` → `files.includes`): o formatador de
  Markdown dele quebra o frontmatter YAML.

## Como rodar

```bash
node .agents/skills/validate-skills/scripts/validate-skills.mjs
```

Exit `1` = existe FAIL. Depois corrija na **fonte** e rode `pnpm ai:sync`.

## Checklist

### Spec (agentskills.io)

| Check | Regra |
|-------|-------|
| `name` | 1-64 caracteres, minúsculo, números e hífen, sem hífen no início/fim/duplo |
| `name` = pasta | o nome da pasta é igual ao `name` |
| `description` | 1-1024 caracteres |
| Frontmatter | YAML válido no topo, **sem linha em branco** dentro |

### Boas práticas (Claude Code)

| Check | Regra |
|-------|-------|
| Descrição | o que faz + quando usar |
| Tamanho | corpo com menos de 500 linhas |
| Um nível de profundidade | todo arquivo de `references/` é linkado direto do `SKILL.md` |
| Links | `[texto](caminho)` relativo e existente |
| Sincronia | cópias geradas iguais à fonte (rode `pnpm ai:sync` e veja se o git ficou limpo) |

O script cobre todos os checks automáticos acima, menos a qualidade da descrição
(revisão humana: terceira pessoa, diz **quando** usar).

## Referências

- [agentskills.io spec](https://agentskills.io/specification)
- [Claude Code best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
