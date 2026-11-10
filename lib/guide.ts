export const TIPS = [
  { t: "Un solo flujo", d: "Dato real, contrato, explorer. Nada más." },
  { t: "Contrato primero", d: "Sin contrato no hay entrega. Desplegalo temprano." },
  { t: "Guardá datos reales", d: "Una respuesta de cada API en sample-data/." },
  { t: "Justificá la cadena", d: "Tené las 4 respuestas del test escritas." },
  { t: "Grabá una prueba", d: "El video falla más que el código." },
  { t: "Recortá sin culpa", d: "Un MVP que corre le gana a uno ambicioso." },
];

export const PROBLEM_QUESTIONS = [
  "¿A quién le pasa? Alguien concreto del NOA.",
  "¿Qué pasa y qué cuesta?",
  "¿Hay un dato público que lo mida?",
  "¿Alguien tiene que confiar en alguien? Ahí entra la cadena.",
];

export type Role = {
  id: string;
  name: string;
  what: string;
  tasks: string[];
  output: string;
  tools: string[];
};

export const ROLES: Role[] = [
  {
    id: "frontend",
    name: "Desarrollo frontend",
    what: "Muestra el dato y la acción on-chain.",
    tasks: ["Conectar Core Wallet a Fuji", "Leer el contrato y sus eventos", "Link a cada transacción"],
    output: "Una pantalla que funcione de punta a punta.",
    tools: ["v0", "Lovable", "Claude"],
  },
  {
    id: "ui",
    name: "UI y diseño",
    what: "Se entiende en 10 segundos.",
    tasks: ["Jerarquía: dato, acción, prueba", "Estados de carga y error", "Capturas para deck y video"],
    output: "Pantallas listas para capturar.",
    tools: ["Stitch", "v0", "Gemini"],
  },
  {
    id: "contratos",
    name: "Contratos y relayer",
    what: "Contrato en Fuji y script que lleva el dato.",
    tasks: ["Una función clave y eventos", "Desplegar temprano", "Relayer con dato real guardado"],
    output: "Contrato en el explorer y una transacción real.",
    tools: ["Claude", "ChatGPT", "DeepSeek"],
  },
  {
    id: "pitch",
    name: "Pitch deck y pitch",
    what: "La historia en 5 a 7 slides.",
    tasks: ["Slide «por qué blockchain»", "Guion del video", "Ensayar con cronómetro"],
    output: "Deck, guion y pitch ensayado.",
    tools: ["Gamma", "Claude", "Gemini"],
  },
  {
    id: "mercado",
    name: "Investigación de mercado",
    what: "Valida problema y modelo.",
    tasks: ["Quién sufre y qué hay hoy", "Quién paga y quién cobra", "Fuentes y atribución"],
    output: "Una página de problema y modelo.",
    tools: ["Claude", "ChatGPT", "Kimi"],
  },
];

export const SPLITS = [
  { size: "3 personas", plan: ["Contratos y relayer", "Frontend y UI", "Pitch, mercado y video"] },
  { size: "4 personas", plan: ["Contratos y relayer", "Frontend", "UI y video", "Pitch y mercado"] },
  {
    size: "5 personas",
    plan: ["Contratos y relayer", "Frontend", "UI y diseño", "Pitch deck y pitch", "Mercado y entrega"],
  },
];

export const SOLUTION_EXAMPLES = [
  {
    name: "Incendios",
    dato: "FIRMS: foco de calor confirmado",
    condicion: "dentro de la zona registrada y con confianza alta",
    accion: "libera una recompensa del fondo a quien lo reportó",
    persona: "productores del NOA",
  },
  {
    name: "Clima espacial",
    dato: "NOAA SWPC: índice Kp",
    condicion: "llega a 5 o más",
    accion: "publica la alerta y pausa las operaciones de riesgo",
    persona: "operadores de infraestructura sensible",
  },
  {
    name: "Cosecha",
    dato: "Sentinel-2: NDVI del lote",
    condicion: "supera el hito acordado",
    accion: "libera el siguiente tramo del préstamo",
    persona: "productores y quien les financia",
  },
];

export const CONTRACT_EXAMPLE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Contrato mínimo: guarda la huella del dato y avisa si cruza un umbral.
contract ThresholdAlert {
    address public immutable publisher;
    uint256 public immutable threshold; // ej: Kp 5

    struct Reading {
        bytes32 dataHash;
        uint64 timestamp;
        uint32 value;
    }
    Reading[] public readings;

    event ReadingPublished(uint256 indexed id, bytes32 dataHash, uint32 value, uint64 timestamp);
    event ThresholdCrossed(uint256 indexed id, uint32 value);

    constructor(uint256 _threshold) {
        publisher = msg.sender;
        threshold = _threshold;
    }

    function publish(bytes32 dataHash, uint32 value, uint64 timestamp) external {
        require(msg.sender == publisher, "solo el publicador");
        readings.push(Reading(dataHash, timestamp, value));
        uint256 id = readings.length - 1;
        emit ReadingPublished(id, dataHash, value, timestamp);
        if (value >= threshold) emit ThresholdCrossed(id, value);
    }
}`;

export const MVP_YES = [
  "1 contrato en Fuji, 1 función clave",
  "1 dato real, guardado en sample-data/",
  "1 pantalla con dato y transacción",
];

export const MVP_NO = ["Login y panel propio", "Varias cadenas", "Base de datos propia"];

export const DEMO_SCRIPT = [
  { t: "0:00 a 0:20", h: "Problema", d: "Una frase y una imagen real." },
  { t: "0:20 a 1:10", h: "Dato y contrato", d: "Dato real, relayer, transacción en el explorer." },
  { t: "1:10 a 1:40", h: "Por qué blockchain", d: "Las 4 respuestas en una pantalla." },
];

export const DEMO_TIPS = [
  "Tené una transacción confirmada de respaldo.",
  "Grabá una prueba antes de la final.",
  "1080p, sin notificaciones.",
];

export const FLOW = [
  {
    t: "Buscar el problema",
    d: "Brainstorming e investigación con IA.",
    bullets: ["Lluvia de problemas del NOA", "Investigá si existe y cuánto cuesta", "Cruzalo con un dato del dashboard"],
    tools: ["Claude", "Gemini", "Kimi"],
    out: "3 problemas candidatos",
  },
  {
    t: "Proponer la solución",
    d: "Una frase y un contrato mínimo.",
    bullets: ["Cuando [dato], el contrato [acción]", "Una sola función clave", "Elegí 1 de los 3"],
    tools: ["Claude", "ChatGPT"],
    out: "La frase de tu solución",
  },
  {
    t: "Cuestionar la idea",
    d: "La IA hace de jurado escéptico.",
    bullets: ["¿Por qué no una base de datos?", "¿Quién miente y quién paga?", "¿Se hace en 2 días?"],
    tools: ["Claude", "DeepSeek", "Gemini"],
    out: "Una idea que sobrevive, o se descarta",
  },
  {
    t: "Validar",
    d: "Con datos reales, no con opiniones.",
    bullets: ["Llamá a la API y guardá la respuesta", "Test de las 4 preguntas", "Repasá los 5 criterios"],
    tools: ["Claude", "Qwen"],
    out: "Go o no-go",
  },
  {
    t: "Desarrollar",
    d: "Recortá a MVP y repartí tareas.",
    bullets: ["Contrato en Fuji temprano", "Relayer con dato real", "Demo y deck en paralelo"],
    tools: ["v0", "Lovable", "Claude"],
    out: "Contrato, demo y pitch",
  },
];

export const PROMPT_BRAINSTORM = `Sos un investigador del NOA argentino (Salta, Jujuy, Tucumán, Catamarca).
Dame 10 problemas reales que sufren productores, comunidades o empresas locales
(incendios, heladas, sequía, agua, litio, vid, caña, minería).
Para cada uno: quién lo sufre, qué le cuesta y qué dato público lo mediría (API, satélite, sensor).
Después elegí los 3 más medibles y explicá por qué.`;

export const PROMPT_REDTEAM = `Sos un jurado técnico escéptico de un hackathon de blockchain.
Esta es la idea: [pegá tu frase].
Atacala sin piedad:
1) ¿Por qué no alcanza una base de datos común?
2) ¿Quién podría mentir o manipular el dato y qué lo impide?
3) ¿Quién paga y quién cobra?
4) ¿El dato existe, es gratis y se actualiza?
5) ¿Se puede construir en 2 días?
6) ¿Qué haría que un jurado la descarte?
Dame las 3 objeciones más fuertes, con nota de 1 a 10, y cómo corregir la idea.`;
