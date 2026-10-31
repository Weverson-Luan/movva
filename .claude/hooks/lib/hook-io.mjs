/**
 * Utilidades comuns aos hooks do Claude Code no Movva.
 *
 * Contrato usado:
 * - payload JSON chega pelo stdin
 * - exit 0  = segue o fluxo em silêncio
 * - exit 2  = mensagem no stderr volta para o Claude (PostToolUse: aviso; Stop: bloqueia o encerramento)
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

/** Caminho relativo (posix) a partir da raiz do projeto. */
export function toRelative(file) {
  if (!file) return "";
  const abs = path.isAbsolute(file) ? file : path.join(ROOT, file);
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

/** Arquivos tocados pela ferramenta que disparou o hook. */
export function editedFiles(payload) {
  const input = payload?.tool_input;
  if (!input || typeof input !== "object") return [];

  const files = [];
  const push = (value) => {
    if (typeof value === "string" && value.trim()) files.push(toRelative(value.trim()));
  };

  push(input.file_path);
  push(input.notebook_path);

  if (Array.isArray(input.edits)) {
    for (const edit of input.edits) push(edit?.file_path);
  }

  return [...new Set(files.filter(Boolean))];
}

/** Pares old/new de um Edit ou MultiEdit (Write não tem: arquivo inteiro sempre é revisado). */
export function editPairs(payload) {
  const input = payload?.tool_input;
  if (!input || typeof input !== "object") return [];

  if (typeof input.old_string === "string" && typeof input.new_string === "string") {
    return [{ oldString: input.old_string, newString: input.new_string }];
  }

  if (Array.isArray(input.edits)) {
    return input.edits
      .filter((e) => typeof e?.old_string === "string" && typeof e?.new_string === "string")
      .map((e) => ({ oldString: e.old_string, newString: e.new_string }));
  }

  return [];
}

export function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

export function ok() {
  process.exit(0);
}
