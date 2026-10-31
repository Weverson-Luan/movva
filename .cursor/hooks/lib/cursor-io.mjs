/**
 * Utilidades dos hooks do Cursor no Movva.
 *
 * Contrato do Cursor (diferente do Claude Code):
 * - payload JSON chega pelo stdin
 * - a resposta sai como JSON no **stdout**, sempre com exit 0
 *   - postToolUse -> { "additional_context": "..." }  devolve texto para o agente
 *   - stop        -> { "followup_message": "..." }    faz o agente continuar
 *   - nada a dizer -> {}
 *
 * O motor de regras é o mesmo do Claude Code (.claude/skills/tech-lead-review),
 * para não existirem dois conjuntos de regras divergindo.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "../../..");

export async function readPayload() {
  if (process.stdin.isTTY) return {};
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function toRelative(file) {
  if (!file) return "";
  const abs = path.isAbsolute(file) ? file : path.join(ROOT, file);
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

const BLOCKS = ["arguments", "tool_input", "input", "params"];

/** O Cursor varia o formato do payload conforme a tool — cobrimos as variações conhecidas. */
export function editedFiles(payload) {
  const files = [];
  const push = (value) => {
    if (typeof value === "string" && value.trim()) files.push(toRelative(value.trim()));
  };

  push(payload?.path);
  push(payload?.file_path);

  for (const key of BLOCKS) {
    const block = payload?.[key];
    if (block && typeof block === "object") {
      push(block.path);
      push(block.file_path);
      push(block.target_notebook);
      if (Array.isArray(block.edits)) for (const edit of block.edits) push(edit?.file_path ?? edit?.path);
    }
  }

  if (Array.isArray(payload?.edits)) for (const edit of payload.edits) push(edit?.file_path ?? edit?.path);

  return [...new Set(files.filter(Boolean))];
}

/** Pares old/new, quando o payload traz o conteúdo da edição (habilita o fast-path). */
export function editPairs(payload) {
  const pairs = [];
  const add = (oldString, newString) => {
    if (typeof oldString === "string" && typeof newString === "string") pairs.push({ oldString, newString });
  };

  add(payload?.old_string, payload?.new_string);

  for (const key of BLOCKS) {
    const block = payload?.[key];
    if (!block || typeof block !== "object") continue;
    add(block.old_string, block.new_string);
    if (Array.isArray(block.edits)) for (const edit of block.edits) add(edit?.old_string, edit?.new_string);
  }

  if (Array.isArray(payload?.edits)) for (const edit of payload.edits) add(edit?.old_string, edit?.new_string);

  return pairs;
}

export function emitContext(text) {
  process.stdout.write(`${JSON.stringify({ additional_context: text })}\n`);
  process.exit(0);
}

export function emitFollowup(text) {
  process.stdout.write(`${JSON.stringify({ followup_message: text })}\n`);
  process.exit(0);
}

export function emitEmpty() {
  process.stdout.write("{}\n");
  process.exit(0);
}
