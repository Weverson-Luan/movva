#!/usr/bin/env node
/**
 * Gera a configuração de IA dos outros agentes a partir da do Claude Code.
 *
 * Fonte única: CLAUDE.md e .claude/{rules,skills,agents}. Aqui só muda o formato:
 * - Cursor  -> .cursor/rules/*.mdc, .cursor/skills/<nome>/, .cursor/agents/
 * - .agents -> .agents/skills/<skill do projeto>/ (+ agents/openai.yaml para o Codex)
 * - AGENTS.md na raiz (instruções lidas por Codex e outros agentes)
 * Links relativos são reescritos para continuar apontando para os arquivos originais.
 *
 * Skills externas em .agents/skills (react-native-best-practices, etc.) NÃO são tocadas:
 * só as pastas com o mesmo nome de uma skill de .claude/skills são recriadas.
 *
 * Uso (da raiz): pnpm ai:sync
 * Rode sempre que mudar CLAUDE.md ou .claude/. Não edite os arquivos gerados.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLAUDE = path.join(ROOT, ".claude");
const CURSOR = path.join(ROOT, ".cursor");
const AGENTS = path.join(ROOT, ".agents");

/** Regras: fonte -> metadados do Cursor. */
const RULES = [
  {
    source: "CLAUDE.md",
    target: "movva-project.mdc",
    description: "Movva — arquitetura, padrão de tela e regras sempre aplicadas",
    alwaysApply: true,
  },
  {
    source: ".claude/rules/movva-white-label.md",
    target: "movva-white-label.mdc",
    description: "White label — cliente, tema, config.json, URLs, storage",
    globs: "src/**,clients/**,app.config.js,tailwind.config.js",
  },
  {
    source: ".claude/rules/movva-data-api.md",
    target: "movva-data-api.mdc",
    description: "Dados — camadas, React Query, erros de domínio e toast",
    globs:
      "src/modules/*/domain/**,src/modules/*/data/**,src/modules/*/factories/**,src/modules/*/presentation/hooks/**,src/modules/*/presentation/view-model/**,src/shared/data/**,src/shared/domain/**,src/shared/interfaces/**",
  },
  {
    source: ".claude/rules/movva-components.md",
    target: "movva-components.mdc",
    description: "Componentes reutilizáveis e estilo (NativeWind + tailwind-variants)",
    globs: "src/shared/components/**,src/modules/*/components/**,src/modules/*/presentation/view/**",
  },
  {
    source: ".claude/rules/movva-solution-options.md",
    target: "movva-solution-options.mdc",
    description: "Apresentar no mínimo duas abordagens antes de implementar",
    alwaysApply: true,
  },
];

const GENERATED = (source) =>
  `<!-- GERADO por scripts/sync-ai.mjs a partir de ${source}. Edite a fonte e rode: pnpm ai:sync -->`;

const toPosix = (p) => p.split(path.sep).join("/");

function stripFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

function frontmatterField(text, field) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  return fm?.[1].match(new RegExp(`^${field}:\\s*(.*)$`, "m"))?.[1].trim() ?? "";
}

/**
 * Reescreve links markdown relativos: resolvidos na pasta de origem, relativizados na de destino.
 * Links para dentro de `keepInside` (a própria skill copiada) ficam como estão: a cópia tem a mesma estrutura.
 */
function rewriteLinks(text, fromDir, toDir, keepInside) {
  return text.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (match, href) => {
    const [target, hash = ""] = href.split("#");
    if (!target) return match;
    const abs = path.resolve(fromDir, target);
    const insideCopy = keepInside && (abs === keepInside || abs.startsWith(`${keepInside}${path.sep}`));
    // scripts/ não é copiado (motor único em .claude): esse link continua apontando para o original
    if (insideCopy && !abs.split(path.sep).includes("scripts")) return match;
    let relative = toPosix(path.relative(toDir, abs));
    if (!relative.startsWith(".")) relative = `./${relative}`;
    return `](${relative}${hash ? `#${hash}` : ""})`;
  });
}

/** Copia uma árvore de markdown reescrevendo links; scripts ficam só em .claude (motor único). */
function copyTree(fromDir, toDir, keepInside = fromDir) {
  mkdirSync(toDir, { recursive: true });
  for (const entry of readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "scripts") copyTree(from, to, keepInside);
    } else if (entry.name.endsWith(".md")) {
      const rewritten = rewriteLinks(readFileSync(from, "utf8"), fromDir, toDir, keepInside);
      // mantém o frontmatter no topo (as ferramentas leem name/description dele)
      const match = rewritten.match(/^---\n[\s\S]*?\n---\n/);
      const label = GENERATED(toPosix(path.relative(ROOT, from)));
      writeFileSync(
        to,
        match ? `${match[0]}\n${label}\n${rewritten.slice(match[0].length)}` : `${label}\n\n${rewritten}`,
      );
    } else {
      cpSync(from, to);
    }
  }
}

/** Interface da skill para o Codex (mesmo formato das skills externas em .agents). */
function openAiYaml(name, description) {
  const title = name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  const short = description.split(/[.—]/)[0].trim().replace(/"/g, "'");
  return [
    "interface:",
    `  display_name: "Movva — ${title}"`,
    `  short_description: "${short}"`,
    `  default_prompt: "Use $${name} seguindo as regras do Movva (white label) em AGENTS.md."`,
    "",
  ].join("\n");
}

// ---------- Cursor ----------
mkdirSync(path.join(CURSOR, "rules"), { recursive: true });
for (const rule of RULES) {
  const sourceAbs = path.join(ROOT, rule.source);
  const body = rewriteLinks(
    stripFrontmatter(readFileSync(sourceAbs, "utf8")),
    path.dirname(sourceAbs),
    path.join(CURSOR, "rules"),
  );
  const front = [
    "---",
    `description: ${rule.description}`,
    ...(rule.globs ? [`globs: ${rule.globs}`] : []),
    `alwaysApply: ${rule.alwaysApply ? "true" : "false"}`,
    "---",
    "",
    GENERATED(rule.source),
    "",
  ].join("\n");
  writeFileSync(path.join(CURSOR, "rules", rule.target), `${front}${body}`);
}

// skills e agents do Cursor: recriados do zero para não sobrar skill apagada
for (const dir of ["skills", "agents"]) {
  const target = path.join(CURSOR, dir);
  if (existsSync(target)) rmSync(target, { recursive: true });
  copyTree(path.join(CLAUDE, dir), target);
}

// ---------- .agents (skills do projeto) ----------
const projectSkills = readdirSync(path.join(CLAUDE, "skills"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

for (const name of projectSkills) {
  const target = path.join(AGENTS, "skills", name);
  if (existsSync(target)) rmSync(target, { recursive: true });
  copyTree(path.join(CLAUDE, "skills", name), target);

  const description = frontmatterField(
    readFileSync(path.join(CLAUDE, "skills", name, "SKILL.md"), "utf8"),
    "description",
  );
  mkdirSync(path.join(target, "agents"), { recursive: true });
  writeFileSync(path.join(target, "agents", "openai.yaml"), openAiYaml(name, description));
}

// ---------- AGENTS.md ----------
const claudeMd = readFileSync(path.join(ROOT, "CLAUDE.md"), "utf8");
const agentsHeader = [
  GENERATED("CLAUDE.md"),
  "",
  "> Instruções para agentes de IA (Codex, Cursor, Gemini e outros). Conteúdo idêntico ao",
  "> `CLAUDE.md`. Skills do projeto e externas em [`.agents/skills/`](.agents/skills/); onde o",
  "> texto citar `AskUserQuestion`, pergunte no chat e espere a resposta.",
  "",
  "",
].join("\n");
writeFileSync(path.join(ROOT, "AGENTS.md"), `${agentsHeader}${claudeMd}`);

console.log(
  [
    "IA sincronizada a partir de CLAUDE.md e .claude/:",
    `- Cursor: ${RULES.length} rules, ${projectSkills.length} skills, agents (tech-lead-gate.mdc é mantido à mão)`,
    `- .agents/skills: ${projectSkills.join(", ")} (+ agents/openai.yaml)`,
    "- AGENTS.md",
  ].join("\n"),
);
