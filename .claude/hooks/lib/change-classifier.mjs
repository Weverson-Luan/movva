/**
 * Classificador de mudanças — decide se uma alteração é "trivial"
 * (texto, classe de tema, espaçamento) e pode pular a revisão do tech-lead.
 *
 * Regra do time: mudança só de texto/visual que NÃO envolve lógica adianta o processo.
 * Na dúvida, o classificador é conservador e devolve trivial = false.
 *
 * Diferença para o Jornada: no Movva as cores ficam em className. Trocar uma
 * string de classe é "conteúdo", mas trocar para cor fixa ou paleta padrão do
 * Tailwind quebra o white label — essas linhas nunca são triviais.
 */

import { execFileSync } from "node:child_process";

/** Só caminhos puramente visuais podem entrar no fast-path. */
const FAST_PATH_ALLOWED = [
  /^src\/modules\/[^/]+\/presentation\/view\//,
  /^src\/modules\/[^/]+\/components\//,
  /^src\/shared\/components\//,
];

/** Nunca fast-path: negócio, dados, rotas, configuração do cliente. */
const FAST_PATH_BLOCKED = [
  /\/domain\//,
  /\/data\//,
  /\/factories\//,
  /\/presentation\/hooks\//,
  /\/presentation\/view-model\//,
  /^src\/app\//,
  /^src\/shared\/(brand|data|domain|utils)\//,
  /^clients\//,
  /\.(spec|test)\.(ts|tsx)$/,
];

/** Linhas com URL, chave, token: nunca triviais mesmo sendo string. */
const SENSITIVE = /(https?:|\/api\/|baseURL|endpoint|token|secret|password|apiKey|KEY\s*[:=])/i;

/** Cor fixa ou paleta padrão do Tailwind: quebra o white label, sempre revisa. */
const WHITE_LABEL_RISK =
  /#[0-9a-fA-F]{3,8}\b|rgba?\s*\(|(?<![\w-])(?:[a-z]+:)*(?:bg|text|border|ring|fill|stroke|from|via|to|divide|placeholder|shadow|outline)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b|\bclient\b/;

/** Qualquer sinal de lógica invalida o fast-path. */
const LOGIC =
  /\b(import|export|from|require|if|else|switch|case|for|while|do|try|catch|finally|throw|await|async|function|return|new|delete|typeof|instanceof|yield|router|navigate|useEffect|useState|useQuery|useMutation|useForm|useFeature)\b|=>|\?|&&|\|\|/;

export function isFastPathEligible(relPath) {
  if (FAST_PATH_BLOCKED.some((re) => re.test(relPath))) return false;
  return FAST_PATH_ALLOWED.some((re) => re.test(relPath));
}

function normalize(line) {
  let s = line.trim();
  if (!s || s.startsWith("//") || s.startsWith("/*") || s.startsWith("*")) return "";
  // conteúdo de string vira marcador: mudar texto ou className não muda a estrutura
  s = s.replace(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g, "@S@");
  // texto solto entre tags JSX (<Text>Olá</Text>) também é conteúdo
  s = s.replace(/>[^<>{}]+</g, ">@T@<");
  return s.replace(/\s+/g, " ");
}

/**
 * @param {string[]} removed linhas removidas
 * @param {string[]} added linhas adicionadas
 * @returns {{trivial: boolean, reason: string}}
 */
export function classifyLines(removed, added) {
  const all = [...removed, ...added];
  if (all.length === 0) return { trivial: true, reason: "sem alteração de conteúdo" };

  for (const line of all) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*")) continue;
    if (SENSITIVE.test(line)) return { trivial: false, reason: "linha sensível (url/chave/token)" };
    if (LOGIC.test(line)) return { trivial: false, reason: `alteração com lógica: ${t.slice(0, 60)}` };
  }

  for (const line of added) {
    if (WHITE_LABEL_RISK.test(line)) {
      return { trivial: false, reason: `risco de white label (cor fixa/cliente): ${line.trim().slice(0, 60)}` };
    }
  }

  const before = removed.map(normalize).filter(Boolean);
  const after = added.map(normalize).filter(Boolean);

  if (before.length !== after.length) {
    return { trivial: false, reason: "estrutura alterada (linhas adicionadas/removidas)" };
  }
  for (let i = 0; i < before.length; i += 1) {
    if (before[i] !== after[i]) return { trivial: false, reason: `estrutura alterada: ${after[i].slice(0, 60)}` };
  }

  return { trivial: true, reason: "apenas texto/classe de tema/espaçamento" };
}

/** Fast-path para um Edit (tem old_string/new_string no payload do hook). */
export function classifyEdit(relPath, oldString, newString) {
  if (!isFastPathEligible(relPath)) return { trivial: false, reason: "arquivo fora do escopo visual do fast-path" };
  if (typeof oldString !== "string" || typeof newString !== "string") {
    return { trivial: false, reason: "sem conteúdo anterior para comparar" };
  }
  return classifyLines(oldString.split(/\r?\n/), newString.split(/\r?\n/));
}

/** Fast-path a partir do diff do git (usado pelo hook de Stop). */
export function classifyGitDiff(root, relPath) {
  if (!isFastPathEligible(relPath)) return { trivial: false, reason: "arquivo fora do escopo visual do fast-path" };

  let diff = "";
  try {
    diff = execFileSync("git", ["-C", root, "diff", "-U0", "HEAD", "--", relPath], { encoding: "utf8" });
  } catch {
    return { trivial: false, reason: "não foi possível ler o diff" };
  }

  // arquivo novo (untracked) ou sem diff versus HEAD
  if (!diff.trim()) return { trivial: false, reason: "arquivo novo ou sem histórico" };

  const removed = [];
  const added = [];
  for (const line of diff.split(/\r?\n/)) {
    if (line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@")) continue;
    if (line.startsWith("-")) removed.push(line.slice(1));
    else if (line.startsWith("+")) added.push(line.slice(1));
  }

  return classifyLines(removed, added);
}
