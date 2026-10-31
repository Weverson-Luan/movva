# Cursor no Movva

Mesma orquestração do Claude Code (ver [`.claude/README.md`](../.claude/README.md)),
com **uma fonte só**:

| Cursor                     | Vem de                                                                | Como                                                |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| `rules/movva-*.mdc`        | `CLAUDE.md` e `.claude/rules/*.md`                                    | gerado por `pnpm ai:sync`                  |
| `skills/**`                | `.claude/skills/**`                                                   | gerado por `pnpm ai:sync`                  |
| `agents/**`                | `.claude/agents/**`                                                   | gerado por `pnpm ai:sync`                  |
| `rules/tech-lead-gate.mdc` | —                                                                     | escrito à mão (protocolo do gate no chat do Cursor) |
| `hooks/*.mjs`              | motor em `.claude/skills/tech-lead-review/scripts/check-patterns.mjs` | importam o motor e o classificador do `.claude`     |

**Não edite os arquivos gerados** (têm o aviso `GERADO por scripts/sync-ai.mjs`).
Edite `CLAUDE.md` ou `.claude/` e rode:

```bash
pnpm ai:sync
```

## Hooks (`hooks.json`)

| Evento                                                | Script                     | Faz                                                             |
| ----------------------------------------------------- | -------------------------- | --------------------------------------------------------------- |
| `postToolUse` (`Write`, `StrReplace`, `EditNotebook`) | `tech-lead-audit.mjs`      | revisa o arquivo; BLOCKER/MAJOR volta como `additional_context` |
| `stop` (`loop_limit: 1`)                              | `tech-lead-audit-stop.mjs` | revisa o diff; BLOCKER/MAJOR volta como `followup_message`      |

Diferença para o Claude Code: o Cursor não tem pergunta estruturada, então o
protocolo pede para perguntar no chat e esperar a resposta.
