#!/usr/bin/env node
/**
 * Tech Lead — verificação estática dos padrões do app Movva (white label).
 *
 * Uso:
 *   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --git-diff
 *   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs src/modules/signin/presentation/view/signin-view.tsx
 *   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --dir src/modules/signin
 *   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --git-diff --json
 *   node .claude/skills/tech-lead-review/scripts/check-patterns.mjs --waive WL_HARDCODED_COLOR src/x.tsx "motivo"
 *
 * Saída (uma linha por achado):
 *   SEVERIDADE | arquivo:linha | REGRA | mensagem | Fonte: <arquivo § seção>
 *
 * Exit code:
 *   0 = sem BLOCKER/MAJOR (MINOR/NIT podem existir)
 *   1 = existe BLOCKER ou MAJOR  -> gate reprovado
 *   2 = erro de uso
 *
 * Este é o ÚNICO motor de regras: os hooks do Claude Code (.claude/hooks) e do
 * Cursor (.cursor/hooks) importam daqui.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "../../../..");
const WAIVERS_FILE = path.join(ROOT, ".claude", "tech-lead-waivers.json");

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);
const CLIENT_CONFIG = /^clients\/[^/]+\/config\.json$/;

/* ------------------------------------------------------------------ *
 * Contexto do arquivo
 * ------------------------------------------------------------------ */

function rel(file) {
  const abs = path.isAbsolute(file) ? file : path.join(ROOT, file);
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

function fileContext(relPath) {
  const base = relPath.split("/").pop() ?? "";
  const isSpec = /\.(spec|test)\.(ts|tsx)$/.test(base);
  const isRoute = relPath.startsWith("src/app/") && !isSpec;
  return {
    rel: relPath,
    base,
    isSpec,
    isRoute,
    isLayout: isRoute && base.startsWith("_layout"),
    isView: /\/presentation\/view\//.test(relPath) && !isSpec,
    isViewModel: /\/presentation\/view-model\//.test(relPath) && !/-schema\.ts$/.test(base) && !isSpec,
    isHook: /\/presentation\/hooks\//.test(relPath) && !isSpec,
    isPresentation: /\/presentation\//.test(relPath) || isRoute || relPath.startsWith("src/shared/components/"),
    isDomain: /^src\/(modules\/[^/]+|shared)\/domain\//.test(relPath) && !isSpec,
    isRepositoryImpl: /^src\/modules\/[^/]+\/data\/repositories\//.test(relPath) && !isSpec,
    isFactory: /^src\/modules\/[^/]+\/factories\//.test(relPath) && !isSpec,
    isHttpInfra: relPath.startsWith("src/shared/data/infra/http/"),
    isComponent:
      (relPath.startsWith("src/shared/components/") ||
        /^src\/(modules|shared\/presentation)\/[^/]+\/components\//.test(relPath)) &&
      !isSpec,
    isClientConfig: CLIENT_CONFIG.test(relPath),
  };
}

function shouldScan(relPath) {
  if (relPath.includes("node_modules/")) return false;
  if (CLIENT_CONFIG.test(relPath)) return true;
  if (!relPath.startsWith("src/")) return false;
  return CODE_EXT.has(path.extname(relPath));
}

/* ------------------------------------------------------------------ *
 * Padrões
 * ------------------------------------------------------------------ */

const DATA_LAYER_IMPORT = /from\s+["']@\/(modules\/[^/"']+\/(domain|data|factories)\/|shared\/data\/)/;
const HTTP_IMPORT = /from\s+["'](axios|@\/shared\/data\/infra\/http)/;
const UI_IMPORT =
  /from\s+["'](@\/shared\/components\/|@\/(modules|shared\/presentation)\/[^/"']+\/components\/|[^"']*\.variants)/;
const JSX_MARKER = /<\/[A-Za-z][\w.]*>|<[A-Z][\w.]*(\s[^<>]*)?\/>/;
const REACT_QUERY_HOOK = /\b(useQuery|useMutation|useInfiniteQuery|useSuspenseQuery)\s*\(/;
const REACT_QUERY_IMPORT = /from\s+["'](@tanstack\/react-query|@\/modules\/[^/"']+\/presentation\/hooks\/)/;
const FRAMEWORK_IMPORT =
  /from\s+["'](react|react-native|axios|expo-[\w-]+|@tanstack\/[\w-]+|burnt|react-hook-form|zustand|nativewind)(\/[^"']*)?["']/;
const UI_SIDE_EFFECT_IMPORT =
  /from\s+["'](burnt|expo-router|react|react-native|@\/shared\/utils\/toast)(\/[^"']*)?["']/;
const TOAST_IMPORT = /from\s+["'](burnt|@\/shared\/utils\/toast)["']/;

/** Condição por cliente: `client === "movva"`, `brand.client !== 'x'`, `"movva" === client`. */
const CLIENT_CONDITION =
  /\b(?:brand\.)?client\s*[!=]==?\s*["'`]|["'`][\w-]+["'`]\s*[!=]==?\s*(?:brand\.)?client\b|case\s+["'`][\w-]+["'`]\s*:.*client/;

/** Cor fixa dentro de string: "#fff", '#E63946', "rgba(0,0,0,.5)". */
const HARDCODED_COLOR = /["'`][^"'`]*(#[0-9a-fA-F]{3,8}\b|rgba?\s*\()[^"'`]*["'`]/;

/** Paleta padrão do Tailwind em className/tv: bg-gray-200, text-white, border-red-500... */
const TAILWIND_PALETTE =
  /(?<![\w-])(?:[a-z]+:)*(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|fill|stroke|from|via|to|divide|placeholder|shadow|outline|decoration|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?(?:\/\d{1,3})?(?![\w-])/;

const HARDCODED_URL = /["'`]https?:\/\/[^"'`\s]+/;

/**
 * Nomenclatura — dicionário de erros de digitação comuns em identificadores.
 * Chave em minúsculo (typo) -> grafia correta. Lista aberta: adicione o que aparecer em review.
 * Nunca adicione palavra que seja português válido (o código mistura PT e EN).
 */
const NAME_TYPOS = {
  singin: "signin",
  sinign: "signin",
  singup: "signup",
  dashaborad: "dashboard",
  dashbaord: "dashboard",
  seperator: "separator",
  seperate: "separate",
  lenght: "length",
  widht: "width",
  heigth: "height",
  funtion: "function",
  fucntion: "function",
  initalize: "initialize",
  sucess: "success",
  succesful: "successful",
  paramter: "parameter",
  retrun: "return",
  recieve: "receive",
  recieved: "received",
  adress: "address",
  occured: "occurred",
  defualt: "default",
  differnt: "different",
  similiar: "similar",
  compenent: "component",
  compoment: "component",
  enviroment: "environment",
  managment: "management",
  intial: "initial",
  langauge: "language",
  respository: "repository",
  repostory: "repository",
  servcie: "service",
};
/**
 * Casa o typo como palavra inteira ou como pedaço de camelCase:
 * `singin`, `singinUpScheme`, `useSinginMutation`, `SINGIN` — mas não `designing`.
 * Sem a flag `i`: com ela o `(?![a-z])` também barraria a maiúscula do camelCase.
 * Fronteira manual porque o \b do JS trata letra acentuada ("ç") como não-palavra.
 */
const WORD_CHAR = "A-Za-z0-9_\\u00C0-\\u024F";
const typoAlternatives = Object.keys(NAME_TYPOS).flatMap((typo) => {
  const capitalized = typo[0].toUpperCase() + typo.slice(1);
  return [
    `(?<![${WORD_CHAR}])${typo}`, // minúsculo: precisa começar a palavra
    capitalized, // Capitalizado: pode estar no meio do camelCase
    typo.toUpperCase(),
  ];
});
const NAME_TYPO_RE = new RegExp(`(?:${typoAlternatives.join("|")})(?![a-z\\u00E0-\\u00FF])`);

const PLACEHOLDER_EXACT = "(?:foo|bar|baz|qux|foobar|asdf|qwerty|lorem|ipsum|xpto|blah|dummy|whatever|coisa)";
const PLACEHOLDER_NUMBERED = "(?:temp|tmp|test|teste|data|value|item|obj|var)\\d+";
const REPEATED_CHAR_NAME = "([a-zA-Z])\\1{2,}[a-zA-Z0-9_$]*";
const NAME_PLACEHOLDER_RE = new RegExp(
  `\\b(?:const|let|var|function\\*?|class)\\s+(?:${PLACEHOLDER_EXACT}\\d*|${PLACEHOLDER_NUMBERED}|${REPEATED_CHAR_NAME})\\b`,
  "i",
);

const S = {
  claude: "CLAUDE.md",
  wl: ".claude/rules/movva-white-label.md",
  data: ".claude/rules/movva-data-api.md",
  comp: ".claude/rules/movva-components.md",
  screens: ".claude/skills/create-screens/SKILL.md",
  standards: ".claude/skills/tech-lead-review/references/standards.md",
};

/* ------------------------------------------------------------------ *
 * Regras linha a linha — cada uma cita a FONTE (para mostrar ao dev)
 * ------------------------------------------------------------------ */

const RULES = [
  // ---------- White label ----------
  {
    id: "WL_CLIENT_CONDITION",
    severity: "BLOCKER",
    applies: (c) => !c.isClientConfig,
    line: CLIENT_CONDITION,
    message: "Condição por cliente no código — use uma feature em `features` (useFeature / <Feature>)",
    source: `${S.wl} § Comportamento por cliente`,
  },
  {
    id: "WL_HARDCODED_COLOR",
    severity: "MAJOR",
    applies: (c) => !c.isClientConfig,
    line: HARDCODED_COLOR,
    message: "Cor fixa (hex/rgb) no código — use a classe do tema (bg-primary) ou useTheme()",
    source: `${S.wl} § Cores e tema`,
  },
  {
    id: "WL_TAILWIND_PALETTE",
    severity: "MAJOR",
    applies: (c) => !c.isClientConfig,
    line: TAILWIND_PALETTE,
    message: (m) =>
      `Cor da paleta padrão do Tailwind ("${m[0]}") — use as cores do tema (primary, text, muted, danger...)`,
    source: `${S.wl} § Cores e tema`,
  },
  {
    id: "WL_HARDCODED_URL",
    severity: "MAJOR",
    applies: (c) => !c.isClientConfig,
    line: HARDCODED_URL,
    message: "URL fixa no código — a base vem de apiUrl/apiUrlDev do cliente; no repositório use só o caminho",
    source: `${S.wl} § API e URLs`,
  },

  // ---------- Camadas ----------
  {
    id: "VIEW_DATA_LAYER",
    severity: "BLOCKER",
    applies: (c) => c.isView,
    line: DATA_LAYER_IMPORT,
    message: "View importa domain/data/factory — a View só recebe props do ViewModel",
    source: `${S.claude} § Arquitetura -> "View só recebe props do ViewModel"`,
  },
  {
    id: "VIEW_HTTP",
    severity: "BLOCKER",
    applies: (c) => c.isView || c.isRoute,
    line: HTTP_IMPORT,
    message: "View/rota acessa HTTP (axios) diretamente",
    source: `${S.data} § Onde cada coisa vive`,
  },
  {
    id: "VIEWMODEL_HTTP",
    severity: "BLOCKER",
    applies: (c) => c.isViewModel,
    line: HTTP_IMPORT,
    message: "ViewModel acessa HTTP (axios) — use o hook de React Query do módulo",
    source: `${S.data} § Onde cada coisa vive`,
  },
  {
    id: "VIEWMODEL_JSX",
    severity: "BLOCKER",
    applies: (c) => c.isViewModel,
    line: JSX_MARKER,
    message: "ViewModel renderiza JSX — a marcação pertence à View",
    source: `${S.claude} § Arquitetura -> "ViewModel não renderiza JSX"`,
  },
  {
    id: "VIEWMODEL_UI_IMPORT",
    severity: "BLOCKER",
    applies: (c) => c.isViewModel,
    line: UI_IMPORT,
    message: "ViewModel importa componente visual/variants — orquestração não conhece UI",
    source: `${S.screens} § ViewModel`,
  },
  {
    id: "DOMAIN_FRAMEWORK",
    severity: "BLOCKER",
    applies: (c) => c.isDomain,
    line: FRAMEWORK_IMPORT,
    message: "Domínio importa framework (React, RN, axios, expo, React Query, toast...) — o domínio é TypeScript puro",
    source: `${S.data} § Onde cada coisa vive`,
  },
  {
    id: "REPOSITORY_UI",
    severity: "BLOCKER",
    applies: (c) => c.isRepositoryImpl,
    line: UI_SIDE_EFFECT_IMPORT,
    message: "Repositório importa React/navegação/toast — repositório só faz a chamada HTTP",
    source: `${S.data} § Onde cada coisa vive`,
  },
  {
    id: "VIEW_DIRECT_RQ",
    severity: "MAJOR",
    applies: (c) => c.isView,
    line: REACT_QUERY_IMPORT,
    message: "View importa React Query/hook do módulo — exponha os dados pelo ViewModel",
    source: `${S.claude} § Arquitetura -> fluxo "hooks -> view-model -> view"`,
  },
  {
    id: "VIEW_RQ_CALL",
    severity: "MAJOR",
    applies: (c) => c.isView,
    line: REACT_QUERY_HOOK,
    message: "View chama useQuery/useMutation — isso pertence ao hook consumido pelo ViewModel",
    source: `${S.claude} § Arquitetura -> fluxo "hooks -> view-model -> view"`,
  },
  {
    id: "ROUTE_LOGIC",
    severity: "MAJOR",
    applies: (c) => c.isRoute && !c.isLayout,
    line: /\b(useState|useEffect|useQuery|useMutation|useForm)\s*\(|from\s+["']@\/(modules\/[^/"']+\/(domain|data|factories)\/|shared\/data\/infra)/,
    message: "Rota com lógica — a rota só liga o ViewModel à View (`<View {...useXViewModel()} />`)",
    source: `${S.screens} § Rota`,
  },
  {
    id: "COMPONENT_BUSINESS",
    severity: "MAJOR",
    applies: (c) => c.isComponent,
    line: new RegExp(`${DATA_LAYER_IMPORT.source}|${REACT_QUERY_IMPORT.source}`),
    message: "Componente reutilizável importa dados/React Query — componente só recebe props",
    source: `${S.comp} § Responsabilidade`,
  },

  // ---------- Dados, erros e toast ----------
  {
    id: "AXIOS_OUTSIDE_DATA",
    severity: "MAJOR",
    applies: (c) => !c.isHttpInfra && !c.isRepositoryImpl && !c.isView && !c.isViewModel && !c.isRoute,
    line: /from\s+["']axios["']/,
    message: "axios fora da camada de dados — só em shared/data/infra/http e modules/*/data/repositories",
    source: `${S.data} § Onde cada coisa vive`,
  },
  {
    id: "AXIOS_ERROR_OUTSIDE_MAPPER",
    severity: "MAJOR",
    applies: (c) => !c.isHttpInfra,
    line: /\bisAxiosError\s*\(|\bAxiosError\b/,
    message: "Tratando erro do axios fora do mapper — erros já chegam como AppError (instanceof UnauthorizedError...)",
    source: `${S.data} § Erros`,
  },
  {
    id: "TOAST_OUTSIDE_PRESENTATION",
    severity: "MAJOR",
    applies: (c) => !c.isPresentation && !c.rel.startsWith("src/shared/utils/toast/"),
    line: TOAST_IMPORT,
    message: "Toast fora da apresentação — service/repositório lançam AppError; o hook mostra o toast (onError)",
    source: `${S.data} § Erros`,
  },
  {
    id: "SWALLOWED_ERROR",
    severity: "MAJOR",
    applies: (c) => !c.isSpec,
    line: /catch\s*(\(\s*\w*\s*\))?\s*\{\s*\}/,
    message: "catch vazio engole o erro — relance como AppError (service) ou deixe o onError da mutation tratar",
    source: `${S.data} § Erros`,
  },
  {
    id: "MUTATE_ASYNC_IN_VIEWMODEL",
    severity: "MINOR",
    applies: (c) => c.isViewModel,
    line: /\.mutateAsync\s*\(/,
    message: "mutateAsync no ViewModel exige try/catch — prefira mutate(dados, { onSuccess })",
    source: `${S.data} § React Query`,
  },

  // ---------- Código ----------
  {
    id: "DEEP_RELATIVE_IMPORT",
    severity: "MAJOR",
    applies: () => true,
    line: /from\s+["']\.\.\/\.\.\//,
    message: "Import relativo profundo — use o alias @/ (aponta para src/)",
    source: `${S.claude} § Outras regras -> "Imports entre pastas usam @/"`,
  },
  {
    id: "PARENT_RELATIVE_IMPORT",
    severity: "MINOR",
    applies: () => true,
    line: /from\s+["']\.\.\/(?!\.\.\/)/,
    message: "Import de pasta acima com ../ — relativo só na mesma pasta; use @/",
    source: `${S.claude} § Outras regras -> "Imports entre pastas usam @/"`,
  },
  {
    id: "DEBUG_CONSOLE",
    severity: "MAJOR",
    applies: (c) => !c.isSpec,
    line: /console\.(log|debug|info)\s*\(/,
    message: "console.log/debug deixado no código",
    source: `${S.standards} § Logs`,
  },
  {
    id: "SAFE_AREA_OUTSIDE_SCREEN",
    severity: "MINOR",
    applies: (c) => c.isView || /^src\/(modules|shared\/presentation)\/[^/]+\/components\//.test(c.rel),
    line: /\buseSafeAreaInsets\b|<SafeAreaView\b|<KeyboardAvoidingView\b/,
    message: "Área segura/teclado manual na tela — use `<Screen>` (edges, scroll, keyboard)",
    source: `${S.claude} § Padrão de tela (obrigatório)`,
  },
  {
    id: "COMPONENT_PROPS_INLINE",
    severity: "MINOR",
    applies: (c) => c.isComponent && /\.tsx$/.test(c.base),
    line: /^\s*(export\s+)?(type|interface)\s+\w*Props\b/,
    message: "Props declaradas no .tsx — mova para `interface.ts` da pasta do componente",
    source: `${S.comp} § Estrutura`,
  },
  {
    id: "COMPONENT_TV_INLINE",
    severity: "MINOR",
    applies: (c) => c.isComponent && /\.tsx$/.test(c.base),
    line: /\btv\(\s*\{/,
    message: "tv() no .tsx — mova os estilos para `<componente>.variants.ts`",
    source: `${S.comp} § Estrutura`,
  },
  {
    id: "STYLESHEET",
    severity: "MINOR",
    applies: (c) => c.isPresentation,
    line: /StyleSheet\.create\s*\(/,
    message: "StyleSheet.create — o projeto usa className (NativeWind) com as cores do tema",
    source: `${S.comp} § Estilo`,
  },
  {
    id: "INLINE_STYLE",
    severity: "MINOR",
    applies: (c) => c.isPresentation,
    line: /\bstyle=\{\{/,
    message: "Estilo inline — use className; style só para valor dinâmico que o Tailwind não cobre",
    source: `${S.comp} § Estilo`,
  },
  {
    id: "TS_ANY",
    severity: "MINOR",
    applies: (c) => !c.isSpec,
    line: /:\s*any\b|\bas\s+any\b/,
    message: "Uso de any — TypeScript strict",
    source: `${S.standards} § TypeScript`,
  },
  {
    id: "NAMING_TYPO",
    severity: "MAJOR",
    applies: (c) => !c.isClientConfig,
    line: NAME_TYPO_RE,
    message: (m) =>
      `Possível erro de digitação em identificador: "${m[0]}" → considere "${NAME_TYPOS[m[0].toLowerCase()]}"`,
    source: `${S.standards} § Nomenclatura -> "Sem erro de digitação"`,
  },
  {
    id: "NAMING_PLACEHOLDER",
    severity: "MAJOR",
    applies: (c) => !c.isClientConfig,
    line: NAME_PLACEHOLDER_RE,
    message: "Nome placeholder (foo, temp1, aaaa...) — dê um nome que descreva o que é/faz",
    source: `${S.standards} § Nomenclatura -> "Sem placeholder"`,
  },
];

/* ------------------------------------------------------------------ *
 * Regras de arquivo inteiro
 * ------------------------------------------------------------------ */

/** Chaves (achatadas) de um objeto JSON: theme.primary, features.chat... */
function flatKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => flatKeys(v, prefix ? `${prefix}.${k}` : k));
}

/** Chaves de um `type X = { ... }` em src/shared/brand/brand.ts. */
function typeKeys(typeName) {
  const file = path.join(ROOT, "src/shared/brand/brand.ts");
  if (!existsSync(file)) return null;
  const text = readFileSync(file, "utf8");
  const block = text.match(new RegExp(`type\\s+${typeName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`));
  if (!block) return null;
  return [...block[1].matchAll(/^\s*(\w+)\??\s*:/gm)].map((m) => m[1]);
}

function clientConfigFindings(relPath) {
  const dir = path.join(ROOT, "clients");
  const configs = readdirSync(dir)
    .filter((c) => existsSync(path.join(dir, c, "config.json")))
    .map((c) => {
      try {
        return {
          client: c,
          keys: new Set(flatKeys(JSON.parse(readFileSync(path.join(dir, c, "config.json"), "utf8")))),
        };
      } catch {
        return { client: c, keys: null };
      }
    });

  const findings = [];
  const current = relPath.split("/")[1];
  const mine = configs.find((c) => c.client === current);
  if (!mine?.keys) {
    return [
      { message: `config.json de "${current}" não é um JSON válido`, source: `${S.wl} § Configuração do cliente` },
    ];
  }

  // 1) Paridade entre clientes: toda chave existe em todos.
  for (const other of configs) {
    if (other.client === current || !other.keys) continue;
    const missingHere = [...other.keys].filter((k) => !mine.keys.has(k));
    const missingThere = [...mine.keys].filter((k) => !other.keys.has(k));
    if (missingHere.length) {
      findings.push({
        message: `"${current}" não tem ${missingHere.join(", ")} (existe em "${other.client}")`,
        source: `${S.wl} § Configuração do cliente`,
      });
    }
    if (missingThere.length) {
      findings.push({
        message: `"${other.client}" não tem ${missingThere.join(", ")} (existe em "${current}")`,
        source: `${S.wl} § Configuração do cliente`,
      });
    }
  }

  // 2) theme/features do JSON batem com os tipos Theme/Features do brand.ts.
  for (const [group, typeName] of [
    ["theme", "Theme"],
    ["features", "Features"],
  ]) {
    const declared = typeKeys(typeName);
    if (!declared) continue;
    const inJson = [...mine.keys].filter((k) => k.startsWith(`${group}.`)).map((k) => k.slice(group.length + 1));
    const notTyped = inJson.filter((k) => !declared.includes(k));
    const notInJson = declared.filter((k) => !inJson.includes(k));
    if (notTyped.length) {
      findings.push({
        message: `${group}.${notTyped.join(`, ${group}.`)} não está no tipo ${typeName} (src/shared/brand/brand.ts)`,
        source: `${S.wl} § Configuração do cliente`,
      });
    }
    if (notInJson.length) {
      findings.push({
        message: `tipo ${typeName} declara ${notInJson.join(", ")}, mas "${current}" não tem em ${group}`,
        source: `${S.wl} § Configuração do cliente`,
      });
    }
  }

  return findings;
}

const FILE_RULES = [
  {
    id: "SCREEN_PATTERN",
    severity: "MAJOR",
    applies: (c) => (c.isView || c.isRoute) && /\.tsx$/.test(c.base),
    check: (text) => {
      const missing = [];
      if (!/\/\*\*\s*\n\s*\*\s*IMPORTS/.test(text)) missing.push("bloco /** IMPORTS */");
      if (!/\/\*\*\s*\n\s*\*\s*EXPORTS?/.test(text)) missing.push("bloco /** EXPORTS */");
      if (!/export\s+default\s+[A-Z]\w*\s*;/.test(text)) missing.push("export default <Componente>; no fim");
      if (/export\s+(default\s+)?function\b/.test(text)) missing.push("sem `export function` (use const arrow)");
      return missing.length ? [{ message: `Fora do padrão de tela: ${missing.join("; ")}` }] : [];
    },
    source: `${S.claude} § Padrão de tela (obrigatório)`,
  },
  {
    id: "SCREEN_SAFE_AREA",
    severity: "MAJOR",
    applies: (c) => c.isView && /\.tsx$/.test(c.base),
    check: (text) =>
      /<Screen[\s>]/.test(text)
        ? []
        : [{ message: "Tela sem `<Screen>` na raiz — área segura e respiro da base ficam desprotegidos" }],
    source: `${S.claude} § Padrão de tela (obrigatório)`,
  },
  {
    id: "COMPONENT_FOLDER",
    severity: "MAJOR",
    applies: (c) => c.isComponent && /\.tsx?$/.test(c.base),
    check: (_text, c) => {
      // Arquivo direto em components/ (ou components/ui/) em vez de components/<componente>/.
      const loose =
        /^src\/((modules|shared\/presentation)\/[^/]+\/components|shared\/components(\/ui)?)\/[^/]+\.tsx?$/.test(c.rel);
      if (loose) {
        return [{ message: "Componente solto — crie a pasta `components/<componente>/` com index.tsx + interface.ts" }];
      }
      const dir = path.join(ROOT, path.dirname(c.rel));
      if (!existsSync(path.join(dir, "index.tsx"))) {
        return [{ message: `Pasta do componente sem index.tsx (${path.dirname(c.rel)})` }];
      }
      return [];
    },
    source: `${S.comp} § Estrutura`,
  },
  {
    id: "CLIENT_CONFIG_PARITY",
    severity: "MAJOR",
    applies: (c) => c.isClientConfig,
    check: (_text, c) => clientConfigFindings(c.rel),
    source: `${S.wl} § Configuração do cliente`,
  },
];

/* ------------------------------------------------------------------ *
 * Waivers (correções recusadas pelo dev)
 * ------------------------------------------------------------------ */

export function loadWaivers() {
  if (!existsSync(WAIVERS_FILE)) return [];
  try {
    const parsed = JSON.parse(readFileSync(WAIVERS_FILE, "utf8"));
    return Array.isArray(parsed?.waivers) ? parsed.waivers : [];
  } catch {
    return [];
  }
}

function isWaived(finding, waivers) {
  return waivers.some((w) => w.rule === finding.rule && w.file === finding.file);
}

function addWaiver(rule, file, reason) {
  const waivers = loadWaivers();
  const entry = {
    rule,
    file: rel(file),
    reason: reason || "recusado pelo desenvolvedor",
    date: new Date().toISOString().slice(0, 10),
  };
  const next = waivers.filter((w) => !(w.rule === entry.rule && w.file === entry.file));
  next.push(entry);
  writeFileSync(WAIVERS_FILE, `${JSON.stringify({ waivers: next }, null, 2)}\n`, "utf8");
  return entry;
}

/* ------------------------------------------------------------------ *
 * Scan
 * ------------------------------------------------------------------ */

export function scanFile(file) {
  const relPath = rel(file);
  if (!shouldScan(relPath)) return [];

  const abs = path.join(ROOT, relPath);
  if (!existsSync(abs) || !statSync(abs).isFile()) return [];

  const text = readFileSync(abs, "utf8");
  const ctx = fileContext(relPath);
  const findings = [];

  if (!ctx.isClientConfig) {
    text.split(/\r?\n/).forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
      if (/biome-ignore|tech-lead-ignore/.test(line)) return;

      for (const rule of RULES) {
        if (!rule.applies(ctx)) continue;
        const match = line.match(rule.line);
        if (!match) continue;
        findings.push({
          severity: rule.severity,
          file: relPath,
          line: index + 1,
          rule: rule.id,
          message: typeof rule.message === "function" ? rule.message(match) : rule.message,
          source: rule.source,
          evidence: trimmed.slice(0, 120),
        });
      }
    });
  }

  for (const rule of FILE_RULES) {
    if (!rule.applies(ctx)) continue;
    for (const result of rule.check(text, ctx)) {
      findings.push({
        severity: rule.severity,
        file: relPath,
        line: 1,
        rule: rule.id,
        message: result.message,
        source: result.source ?? rule.source,
        evidence: "",
      });
    }
  }

  return findings;
}

export function scanFiles(files) {
  const waivers = loadWaivers();
  const seen = new Set();
  const findings = [];

  for (const file of files) {
    const relPath = rel(file);
    if (seen.has(relPath)) continue;
    seen.add(relPath);
    findings.push(...scanFile(relPath));
  }

  return findings.filter((f) => !isWaived(f, waivers));
}

export function scanDirectory(dir) {
  const abs = path.isAbsolute(dir) ? dir : path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const files = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (CODE_EXT.has(path.extname(entry.name)) || entry.name === "config.json") files.push(full);
    }
  };
  walk(abs);
  return scanFiles(files);
}

export function changedFiles() {
  const run = (args) => {
    try {
      return execFileSync("git", ["-C", ROOT, ...args], { encoding: "utf8" });
    } catch {
      return "";
    }
  };
  const raw = [
    run(["diff", "--name-only", "HEAD"]),
    run(["diff", "--name-only", "--cached"]),
    run(["ls-files", "--others", "--exclude-standard"]),
  ].join("\n");

  return [
    ...new Set(
      raw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean),
    ),
  ].filter(shouldScan);
}

/* ------------------------------------------------------------------ *
 * Relatório
 * ------------------------------------------------------------------ */

const ORDER = { BLOCKER: 0, MAJOR: 1, MINOR: 2, NIT: 3 };

export function summarize(findings) {
  const summary = { blocker: 0, major: 0, minor: 0, nit: 0 };
  for (const f of findings) summary[f.severity.toLowerCase()] += 1;
  const verdict = summary.blocker > 0 || summary.major > 0 ? "REQUEST_CHANGES" : "APPROVE";
  return { summary, verdict, blocking: summary.blocker + summary.major };
}

export function formatFinding(f) {
  return `${f.severity} | ${f.file}:${f.line} | ${f.rule} | ${f.message} | Fonte: ${f.source}`;
}

export function sortFindings(findings) {
  return [...findings].sort(
    (a, b) => ORDER[a.severity] - ORDER[b.severity] || a.file.localeCompare(b.file) || a.line - b.line,
  );
}

function main(argv) {
  const args = argv.slice(2);
  if (args.length === 0) {
    console.error(
      "Uso: check-patterns.mjs <arquivo...> | --git-diff | --dir <pasta> | --waive <REGRA> <arquivo> [motivo]",
    );
    return 2;
  }

  if (args[0] === "--waive") {
    if (args.length < 3) {
      console.error("Uso: --waive <REGRA> <arquivo> [motivo]");
      return 2;
    }
    const entry = addWaiver(args[1], args[2], args.slice(3).join(" "));
    console.log(`Waiver registrado: ${entry.rule} em ${entry.file} — ${entry.reason}`);
    return 0;
  }

  const json = args.includes("--json");
  const rest = args.filter((a) => a !== "--json");

  let findings = [];
  let scope = "";

  if (rest[0] === "--git-diff") {
    const files = changedFiles();
    scope = files.length ? `${files.length} arquivo(s) alterado(s)` : "nenhum arquivo alterado";
    findings = scanFiles(files);
  } else if (rest[0] === "--dir") {
    if (rest.length < 2) {
      console.error("--dir exige um caminho");
      return 2;
    }
    scope = rest[1];
    findings = scanDirectory(rest[1]);
  } else {
    scope = rest.join(", ");
    findings = scanFiles(rest);
  }

  const sorted = sortFindings(findings);
  const { summary, verdict, blocking } = summarize(sorted);

  if (json) {
    console.log(JSON.stringify({ scope, verdict, summary, findings: sorted }, null, 2));
    return blocking > 0 ? 1 : 0;
  }

  if (sorted.length === 0) {
    console.log(`OK: nenhum desvio de padrão em ${scope}.`);
    return 0;
  }

  for (const f of sorted) console.log(formatFinding(f));
  console.log("");
  console.log(
    `Resumo: BLOCKER ${summary.blocker} | MAJOR ${summary.major} | MINOR ${summary.minor} | NIT ${summary.nit} — Veredito: ${verdict}`,
  );
  return blocking > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv));
}
