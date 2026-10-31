#!/usr/bin/env node
/**
 * Valida as skills do Movva (agentskills.io + boas práticas do Claude Code).
 *
 * Uso (da raiz): node .agents/skills/validate-skills/scripts/validate-skills.mjs
 * Exit 0 = ok | 1 = existe FAIL
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const SKILL_ROOTS = [".claude/skills", ".agents/skills", ".cursor/skills"];
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let fails = 0;
let warns = 0;

/** Frontmatter simples (chave: valor no primeiro nível). */
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const raw = match[1];
  const fields = {};
  for (const line of raw.split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { raw, fields, bodyStart: match[0].length };
}

/** Links markdown relativos de um arquivo, já resolvidos. */
function relativeLinks(file, text) {
  const links = [];
  const add = (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return;
    links.push({ href, abs: path.resolve(path.dirname(file), href.split("#")[0]) });
  };
  // exemplos dentro de código (``` ... ``` e `...`) não são links
  const prose = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const m of prose.matchAll(/\]\(([^)\s]+)\)/g)) add(m[1]);
  // links de referência: [nome]: caminho
  for (const m of prose.matchAll(/^\[[^\]]+\]:\s*(\S+)/gm)) add(m[1]);
  return links;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

function validateSkill(dir) {
  const rel = path.relative(ROOT, dir);
  const results = [];
  const fail = (msg) => {
    fails += 1;
    results.push(`  [FAIL] ${msg}`);
  };
  const warn = (msg) => {
    warns += 1;
    results.push(`  [WARN] ${msg}`);
  };

  const skillFile = path.join(dir, "SKILL.md");
  if (!existsSync(skillFile)) {
    fail("sem SKILL.md");
    return { rel, results };
  }

  const text = readFileSync(skillFile, "utf8");
  const fm = parseFrontmatter(text);
  const folder = path.basename(dir);

  if (!fm) {
    fail("frontmatter ausente ou malformado (precisa começar com --- e fechar com ---)");
    return { rel, results };
  }
  if (fm.raw.split("\n").some((l) => l.trim() === "")) fail("linha em branco dentro do frontmatter");

  const { name = "", description = "" } = fm.fields;
  if (!NAME_RE.test(name) || name.length > 64) fail(`name inválido: "${name}"`);
  if (name !== folder) fail(`name "${name}" diferente da pasta "${folder}"`);
  if (!description) fail("description vazia");
  else if (description.length > 1024) fail(`description com ${description.length} caracteres (máx. 1024)`);

  const bodyLines = text.slice(fm.bodyStart).split("\n").length;
  if (bodyLines > 500) warn(`corpo com ${bodyLines} linhas (recomendado < 500)`);

  // links do SKILL.md e das referências existem
  const mdFiles = walk(dir).filter((f) => f.endsWith(".md"));
  for (const file of mdFiles) {
    for (const link of relativeLinks(file, readFileSync(file, "utf8"))) {
      if (!existsSync(link.abs)) fail(`link quebrado em ${path.relative(dir, file)}: ${link.href}`);
    }
  }

  // um nível: toda referência é linkada direto do SKILL.md
  const refsDir = path.join(dir, "references");
  if (existsSync(refsDir) && statSync(refsDir).isDirectory()) {
    const linkedFromSkill = new Set(relativeLinks(skillFile, text).map((l) => l.abs));
    for (const ref of walk(refsDir).filter((f) => f.endsWith(".md"))) {
      if (!linkedFromSkill.has(ref)) warn(`references/${path.relative(refsDir, ref)} não é linkado pelo SKILL.md`);
    }
  }

  return { rel, results };
}

for (const root of SKILL_ROOTS) {
  const abs = path.join(ROOT, root);
  if (!existsSync(abs)) continue;
  console.log(`\n## ${root}`);
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const { rel, results } = validateSkill(path.join(abs, entry.name));
    console.log(results.length ? `${rel}\n${results.join("\n")}` : `${rel}  [PASS]`);
  }
}

console.log(`\nResumo: FAIL ${fails} | WARN ${warns}`);
process.exit(fails > 0 ? 1 : 0);
