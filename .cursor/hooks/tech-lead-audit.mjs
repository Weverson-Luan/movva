#!/usr/bin/env node
/**
 * Cursor postToolUse — roda o tech-lead nos arquivos que o agente acabou de alterar.
 *
 * Mudança só de texto/classe de tema sem lógica passa pelo fast-path.
 * BLOCKER/MAJOR volta como additional_context com o protocolo do gate.
 */

import { classifyEdit } from "../../.claude/hooks/lib/change-classifier.mjs";
import { techLeadGateMessage } from "../../.claude/hooks/lib/gate.mjs";
import {
  formatFinding,
  scanFiles,
  sortFindings,
  summarize,
} from "../../.claude/skills/tech-lead-review/scripts/check-patterns.mjs";
import { editedFiles, editPairs, emitContext, emitEmpty, readPayload } from "./lib/cursor-io.mjs";

const payload = await readPayload();
const files = editedFiles(payload);
if (files.length === 0) emitEmpty();

const pairs = editPairs(payload);
const toReview = [];
const skipped = [];

for (const file of files) {
  const trivial = pairs.length > 0 && pairs.every((pair) => classifyEdit(file, pair.oldString, pair.newString).trivial);
  if (trivial) skipped.push(file);
  else toReview.push(file);
}

if (toReview.length === 0) emitEmpty();

const findings = sortFindings(scanFiles(toReview));
if (summarize(findings).blocking === 0) emitEmpty();

const blockingLines = findings.filter((f) => f.severity === "BLOCKER" || f.severity === "MAJOR").map(formatFinding);

emitContext(techLeadGateMessage({ findings: blockingLines, skipped, stage: "post-tool", agent: "cursor" }));
