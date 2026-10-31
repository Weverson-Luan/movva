#!/usr/bin/env node
/**
 * PostToolUse (Write|Edit|MultiEdit)
 *
 * Roda o tech-lead nos arquivos que a IA acabou de alterar.
 * - mudança só de texto/classe de tema sem lógica -> fast-path, não revisa
 * - BLOCKER/MAJOR -> exit 2: gate reprovado, Claude precisa negociar a correção com o dev
 * - MINOR/NIT -> silencioso aqui (aparecem na revisão completa da skill)
 */

import {
  formatFinding,
  scanFiles,
  sortFindings,
  summarize,
} from "../skills/tech-lead-review/scripts/check-patterns.mjs";
import { classifyEdit } from "./lib/change-classifier.mjs";
import { techLeadGateMessage } from "./lib/gate.mjs";
import { editedFiles, editPairs, fail, ok, readPayload } from "./lib/hook-io.mjs";

const payload = await readPayload();
const files = editedFiles(payload);
if (files.length === 0) ok();

const pairs = editPairs(payload);
const toReview = [];
const skipped = [];

for (const file of files) {
  const trivial = pairs.length > 0 && pairs.every((pair) => classifyEdit(file, pair.oldString, pair.newString).trivial);
  if (trivial) skipped.push(file);
  else toReview.push(file);
}

if (toReview.length === 0) ok();

const findings = sortFindings(scanFiles(toReview));
if (summarize(findings).blocking === 0) ok();

const blockingLines = findings.filter((f) => f.severity === "BLOCKER" || f.severity === "MAJOR").map(formatFinding);

fail(techLeadGateMessage({ findings: blockingLines, skipped, stage: "post-tool" }));
