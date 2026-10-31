---
name: tech-lead-review
description: Revisa mudanças de código do app Movva (white label) contra a arquitetura em camadas, as regras de white label, dados/erros e o padrão de tela. Use após qualquer alteração de código feita por IA, antes de abrir PR, ou quando pedirem tech-lead / revisão de padrão / architecture review.
---

<!-- GERADO por scripts/sync-ai.mjs a partir de .claude/skills/tech-lead-review/SKILL.md. Edite a fonte e rode: pnpm ai:sync -->

# SKILL — Tech Lead Review (Movva)

Portão de qualidade do Movva. **Toda mudança de código feita por IA passa por aqui**
antes da tarefa continuar.

Fontes de padrão (é daqui que sai toda citação mostrada ao dev):

- [`CLAUDE.md`](../../../CLAUDE.md) — arquitetura, padrão de tela, regras gerais
- [`.claude/rules/movva-white-label.md`](../../../.claude/rules/movva-white-label.md)
- [`.claude/rules/movva-data-api.md`](../../../.claude/rules/movva-data-api.md)
- [`.claude/rules/movva-components.md`](../../../.claude/rules/movva-components.md)
- Skills [`create-screens`](../create-screens/SKILL.md), [`create-api-flow`](../create-api-flow/SKILL.md), [`create-components`](../create-components/SKILL.md), [`add-client`](../add-client/SKILL.md)
- [`references/standards.md`](references/standards.md) — o que não está nos arquivos acima

---

## Fast-path (adiantar o processo)

Mudança **apenas visual, sem lógica** não passa pela revisão:

- texto/label (inclusive dentro de JSX)
- troca de classe **entre classes do tema** / espaçamento (`p-4` → `p-6`, `bg-surface` → `bg-background`)

Só vale em `src/modules/*/presentation/view`, `src/modules/*/components` e `src/shared/components`.
**Nunca** vale para domain, data, factories, hooks, view-model, rotas (`src/app`),
`clients/`, nem para linha com URL/token, cor fixa, paleta padrão do Tailwind ou `client`.

Critério completo: [`references/fast-path.md`](references/fast-path.md).

---

## Verificação rápida (script)

Da raiz do projeto:

```bash
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --git-diff
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --dir src/modules/signin
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs clients/movva/config.json
node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --git-diff --json
```

Saída: `SEVERIDADE | arquivo:linha | REGRA | mensagem | Fonte: <arquivo § seção>`.
Exit `1` = existe BLOCKER ou MAJOR (gate reprovado).

Depois do script, sempre: `pnpm check` (Biome) e `npx tsc --noEmit`.

---

## Protocolo do gate (obrigatório)

Quando o check reprova (BLOCKER ou MAJOR):

1. **PARE a tarefa.** Não escreva mais código de feature.
2. Para **cada** achado, mostre ao dev: trecho atual (`arquivo:linha`), correção
   proposta (diff curto — o menor conserto) e a **fonte da regra** como o script citou.
3. Pergunte com `AskUserQuestion`: `Aceitar correção` | `Recusar (manter como está)` | `Ajustar proposta`.
4. **Aceitar** → aplique, rode o check de novo, siga a tarefa.
5. **Recusar** → registre o waiver e siga sem aplicar:

   ```bash
   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --waive <REGRA> <arquivo> "<motivo do dev>"
   ```

6. **Ajustar** → proponha a variação pedida e pergunte de novo.
7. Nunca aplique nem descarte a correção sem resposta do dev.

Modelo de mensagem: [`references/review-rubric.md`](references/review-rubric.md) § Como apresentar ao dev.

---

## Waivers

`.claude/tech-lead-waivers.json` guarda o que o time decidiu não corrigir (por regra + arquivo).
É versionado: a decisão vale para o time, não só para a sessão.

---

## Revisão completa (agent)

Para diff grande, feature inteira ou pedido explícito de review, use o agent
[`movva-tech-lead`](../../../.claude/agents/movva-tech-lead.md). O script pega o que regex vê;
o agent faz o julgamento (estado no lugar errado, ViewModel inchado, componente
que devia ir para `shared`, feature por cliente faltando em algum `config.json`,
nome inconsistente).

---

## Fluxo de correção

1. Rode o script no escopo.
2. Negocie BLOCKER/MAJOR com o dev (protocolo acima).
3. MINOR/NIT: corrija se já estiver mexendo no arquivo.
4. `pnpm check` e `npx tsc --noEmit`.
5. Rode o script de novo até zerar BLOCKER/MAJOR (ou tudo estar em waiver).
