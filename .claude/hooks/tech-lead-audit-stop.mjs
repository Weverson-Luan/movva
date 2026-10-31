#!/usr/bin/env node
/**
 * Stop — revisão final do tech-lead antes de encerrar o turno.
 *
 * Varre o diff do working tree (arquivos alterados e novos), ignora o que for
 * mudança trivial de texto/classe de tema e bloqueia o encerramento se houver
 * BLOCKER/MAJOR em aberto.
 */

import {
  changedFiles,
  formatFinding,
  scanFiles,
  sortFindings,
  summarize,
} from "../skills/tech-lead-review/scripts/check-patterns.mjs";
import { classifyGitDiff } from "./lib/change-classifier.mjs";
import { techLeadGateMessage } from "./lib/gate.mjs";
import { fail, ok, ROOT, readPayload } from "./lib/hook-io.mjs";

const payload = await readPayload();
// já está continuando por causa deste hook: não entra em loop
if (payload?.stop_hook_active) ok();

const files = changedFiles();
if (files.length === 0) ok();

const toReview = [];
const skipped = [];

for (const file of files) {
  if (classifyGitDiff(ROOT, file).trivial) skipped.push(file);
  else toReview.push(file);
}

if (toReview.length === 0) ok();

const findings = sortFindings(scanFiles(toReview));
if (summarize(findings).blocking === 0) ok();

const blockingLines = findings.filter((f) => f.severity === "BLOCKER" || f.severity === "MAJOR").map(formatFinding);

fail(techLeadGateMessage({ findings: blockingLines, skipped, stage: "stop" }));
