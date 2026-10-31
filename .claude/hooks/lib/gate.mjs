/**
 * Mensagens do gate de tech-lead.
 *
 * O hook não conversa com o dev — ele instrui o agente a conduzir o
 * protocolo de aprovação (propor correção + citar a fonte + perguntar).
 * O mesmo texto serve ao Claude Code e ao Cursor; só muda como perguntar.
 */

const ASK = {
  claude:
    '3. Use AskUserQuestion com as opções: "Aceitar correção" | "Recusar (manter como está)" | "Ajustar proposta".',
  cursor:
    "3. Pergunte no chat e ESPERE a resposta, oferecendo: [1] Aceitar correção  [2] Recusar (manter como está)  [3] Ajustar proposta.",
};

function protocol(agent) {
  return [
    "PROTOCOLO OBRIGATÓRIO (não pule etapas):",
    "1. PARE a tarefa atual. Não escreva mais código de feature enquanto o gate estiver reprovado.",
    "2. Para CADA achado acima, mostre ao dev:",
    "   a) o trecho atual (arquivo:linha);",
    "   b) a correção proposta (diff curto, o menor conserto que restaura o padrão);",
    "   c) a FONTE da regra — exatamente o arquivo e a seção citados no achado.",
    ASK[agent],
    "4. ACEITAR  -> aplique a correção, rode o check de novo e siga a tarefa.",
    "5. RECUSAR  -> registre o waiver e siga a tarefa sem aplicar a correção:",
    '   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --waive <REGRA> <arquivo> "<motivo do dev>"',
    "6. AJUSTAR  -> proponha a variação pedida e pergunte de novo.",
    "7. Nunca aplique nem descarte a correção sem a resposta do dev.",
    "",
    "Revisão completa: .claude/skills/tech-lead-review/SKILL.md",
    "Rubrica e fontes: .claude/skills/tech-lead-review/references/review-rubric.md",
  ].join("\n");
}

function block(findings, limit = 12) {
  const shown = findings.slice(0, limit).map((line) => `- ${line}`);
  if (findings.length > limit) shown.push(`- ... e mais ${findings.length - limit} achado(s)`);
  return shown.join("\n");
}

export function techLeadGateMessage({ findings, skipped = [], stage, agent = "claude" }) {
  const header =
    stage === "stop"
      ? "TECH-LEAD GATE (Movva) — REPROVADO (revisão final do diff)"
      : "TECH-LEAD GATE (Movva) — REPROVADO (arquivo recém-alterado)";

  const parts = [header, "", block(findings), ""];

  if (skipped.length > 0)
    parts.push(`Fast-path aplicado (texto/classe de tema, sem lógica): ${skipped.join(", ")}`, "");

  parts.push(protocol(agent));
  return parts.join("\n");
}
