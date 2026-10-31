#!/usr/bin/env node
/**
 * Cursor stop — revisão final do tech-lead no diff antes de encerrar.
 * Devolve followup_message para o agente resolver o gate antes de parar.
 * (loop_limit: 1 no hooks.json evita repetir indefinidamente.)
 */

import { classifyGitDiff } from "../../.claude/hooks/lib/change-classifier.mjs";
import { techLeadGateMessage } from "../../.claude/hooks/lib/gate.mjs";
import {
  changedFiles,
  formatFinding,
  scanFiles,
  sortFindings,
  summarize,
} from "../../.claude/skills/tech-lead-review/scripts/check-patterns.mjs";
import { emitEmpty, emitFollowup, ROOT, readPayload } from "./lib/cursor-io.mjs";

await readPayload();

const files = changedFiles();
if (files.length === 0) emitEmpty();

const toReview = [];
const skipped = [];

for (const file of files) {
  if (classifyGitDiff(ROOT, file).trivial) skipped.push(file);
  else toReview.push(file);
}

if (toReview.length === 0) emitEmpty();

const findings = sortFindings(scanFiles(toReview));
if (summarize(findings).blocking === 0) emitEmpty();

const blockingLines = findings.filter((f) => f.severity === "BLOCKER" || f.severity === "MAJOR").map(formatFinding);

emitFollowup(techLeadGateMessage({ findings: blockingLines, skipped, stage: "stop", agent: "cursor" }));
