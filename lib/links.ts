// Cuenta regresiva: viernes 13/11/2026 09:00, hora de Argentina (UTC-03:00).
// El reglamento publicado no fija una hora de cierre; la hora la define la organización del track.
export const DEADLINE_ISO = "2026-11-13T09:00:00-03:00";

export const REFERRAL_URL = "https://build.avax.network/?ref=NNFFY";
export const DOCS_URL = "https://docs.avax.network";
export const ACADEMY_URL = "https://docs.avax.network/academy";
export const L1_COURSE_URL =
  "https://docs.avax.network/academy/avalanche-l1/avalanche-fundamentals/04-creating-an-l1/01-creating-an-l1";

export const COMPETENCIA_URL = "https://competencia.argentinaspace.com";
export const REGLAMENTO_URL = "https://competencia.argentinaspace.com/reglamento";

export const SKILLS_REPO = process.env.NEXT_PUBLIC_SKILLS_REPO || "";

/** Salta capital, para medir la distancia a la ISS en el hero */
export const SALTA = { lat: -24.7821, lon: -65.4232, name: "Salta" };

export type AiTool = {
  name: string;
  url: string;
  note: string;
  /** archivo en /public/tools; sin archivo se muestra una inicial */
  icon?: string;
};

export const AI_TOOLS: AiTool[] = [
  { name: "Claude", url: "https://claude.ai", note: "Chat, código y artefactos", icon: "claude.svg" },
  { name: "ChatGPT", url: "https://chatgpt.com", note: "Chat y código", icon: "openai.svg" },
  { name: "Gemini", url: "https://gemini.google.com", note: "Chat de Google", icon: "gemini.svg" },
  { name: "GLM", url: "https://chat.z.ai", note: "Modelos de Z.ai", icon: "chatglm.svg" },
  { name: "DeepSeek", url: "https://chat.deepseek.com", note: "Razonamiento y código", icon: "deepseek.svg" },
  { name: "Qwen", url: "https://chat.qwen.ai", note: "Modelos de Alibaba", icon: "qwen.svg" },
  { name: "Kimi", url: "https://www.kimi.com", note: "Contexto largo", icon: "kimi.svg" },
  { name: "Stitch", url: "https://stitch.withgoogle.com", note: "Diseño de UI" },
  { name: "v0", url: "https://v0.app", note: "Prototipos de frontend", icon: "v0.svg" },
  { name: "Lovable", url: "https://lovable.dev", note: "Apps sin código", icon: "lovable.svg" },
  { name: "Gamma", url: "https://gamma.app", note: "Pitch deck" },
];

export const FUJI = {
  chainId: 43113,
  chainIdHex: "0xA869",
  name: "Avalanche Fuji C-Chain",
  rpc: "https://api.avax-test.network/ext/bc/C/rpc",
  explorer: "https://explorer-test.avax.network/c-chain",
  symbol: "AVAX",
};
