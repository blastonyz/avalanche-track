// Contenido salido de CATALOGO_APIS.md y BRAINSTORM_Y_CATEGORIAS.md del track.

export type Access = "sin-registro" | "key-gratis" | "avanzado" | "argentina";

export type Api = {
  id: string;
  name: string;
  provider: string;
  gives: string;
  url: string;
  access: Access;
  topics: string[];
  limit?: string;
  note?: string;
  /** Se puede probar desde el navegador (la API acepta CORS) */
  live?: boolean;
};

export const ACCESS_LABEL: Record<Access, string> = {
  "sin-registro": "Sin registro",
  "key-gratis": "Key gratis",
  avanzado: "Avanzado",
  argentina: "Argentina",
};

export const APIS: Api[] = [
  {
    id: "eonet",
    name: "EONET",
    provider: "NASA",
    gives: "Eventos naturales activos: incendios, tormentas, volcanes, hielo, inundaciones.",
    url: "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open&limit=5",
    access: "sin-registro",
    topics: ["incendios", "eventos"],
    live: true,
  },
  {
    id: "usgs",
    name: "USGS Sismos",
    provider: "USGS",
    gives: "Terremotos en tiempo real en GeoJSON.",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    access: "sin-registro",
    topics: ["sismos"],
    live: true,
  },
  {
    id: "swpc",
    name: "NOAA SWPC",
    provider: "NOAA",
    gives: "Clima espacial: índice Kp, viento solar, alertas y auroras.",
    url: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
    access: "sin-registro",
    topics: ["clima espacial"],
    live: true,
  },
  {
    id: "open-meteo",
    name: "Open-Meteo",
    provider: "Open-Meteo",
    gives: "Pronóstico, histórico desde 1940, calidad del aire y datos marinos.",
    url: "https://api.open-meteo.com/v1/forecast?latitude=-24.78&longitude=-65.41&current_weather=true",
    access: "sin-registro",
    topics: ["clima", "sequía", "heladas"],
    note: "El ejemplo apunta a Salta capital.",
    live: true,
  },
  {
    id: "iss",
    name: "wheretheiss.at",
    provider: "wheretheiss.at",
    gives: "Posición de la ISS (NORAD 25544), TLE y zona horaria por coordenada.",
    url: "https://api.wheretheiss.at/v1/satellites/25544",
    access: "sin-registro",
    topics: ["órbitas"],
    limit: "≈1 req/seg",
    live: true,
  },
  {
    id: "celestrak",
    name: "CelesTrak",
    provider: "CelesTrak",
    gives: "Órbitas (GP/TLE/OMM) de miles de satélites, por grupo o NORAD ID.",
    url: "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json",
    access: "sin-registro",
    topics: ["órbitas"],
  },
  {
    id: "epic",
    name: "NASA EPIC",
    provider: "NASA",
    gives: "Foto de la Tierra completa desde 1,5 millones de km (DSCOVR).",
    url: "https://epic.gsfc.nasa.gov/api/natural",
    access: "sin-registro",
    topics: ["imágenes"],
  },
  {
    id: "gibs",
    name: "NASA GIBS",
    provider: "NASA",
    gives: "Más de 1000 capas satelitales como tiles de mapa (WMTS), actualizadas a diario.",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/",
    access: "sin-registro",
    topics: ["imágenes", "mapa"],
    note: "Capa de ejemplo: MODIS_Terra_CorrectedReflectance_TrueColor.",
  },
  {
    id: "jpl",
    name: "JPL SSD / CNEOS",
    provider: "NASA JPL",
    gives: "Asteroides: aproximaciones, riesgo de impacto (Sentry), bólidos y SBDB.",
    url: "https://ssd-api.jpl.nasa.gov/cad.api?dist-max=0.05",
    access: "sin-registro",
    topics: ["asteroides"],
  },
  {
    id: "power",
    name: "NASA POWER",
    provider: "NASA",
    gives: "Radiación solar y meteo satelital, 1984 a hoy, en cualquier punto del planeta.",
    url: "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,ALLSKY_SFC_SW_DWN&community=RE&longitude=-65.41&latitude=-24.78&start=20240101&end=20240131&format=JSON",
    access: "sin-registro",
    topics: ["clima", "sequía", "agro"],
    note: "Útil para seguros paramétricos por sequía o radiación.",
    live: true,
  },
  {
    id: "exoplanets",
    name: "NASA Exoplanet Archive",
    provider: "NASA / Caltech",
    gives: "Más de 6000 exoplanetas confirmados, con consultas tipo SQL (TAP).",
    url: "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars&format=json",
    access: "sin-registro",
    topics: ["astronomía"],
  },
  {
    id: "spacex",
    name: "SpaceX API (comunidad)",
    provider: "Comunidad",
    gives: "Lanzamientos, cohetes y Starlink.",
    url: "https://api.spacexdata.com/v5/launches/latest",
    access: "sin-registro",
    topics: ["lanzamientos"],
    note: "Solo mantenimiento desde 2024: no trae lanzamientos nuevos.",
  },
  {
    id: "nasa-open",
    name: "NASA Open APIs",
    provider: "NASA",
    gives: "APOD, NeoWs (asteroides), DONKI (tormentas solares) e imágenes.",
    url: "https://api.nasa.gov",
    access: "key-gratis",
    topics: ["clima espacial", "asteroides", "imágenes"],
    limit: "DEMO_KEY ≈30/h por IP · key propia ≈1000/h",
    note: "Sacá tu propia key: el WiFi del evento comparte IP. DONKI: /DONKI/FLR, /CME, /GST.",
  },
  {
    id: "firms",
    name: "NASA FIRMS",
    provider: "NASA",
    gives: "Focos de calor satelitales casi en tiempo real (~3 h de latencia), por bounding box o país (ARG).",
    url: "https://firms.modaps.eosdis.nasa.gov/api/map_key/",
    access: "key-gratis",
    topics: ["incendios"],
    limit: "Generoso (≈5000 req/10 min según un cliente)",
    note: "Devuelve CSV, no JSON. La MAP_KEY llega por email.",
  },
  {
    id: "n2yo",
    name: "N2YO",
    provider: "N2YO",
    gives: "Satélites sobre tu ubicación, pases visibles y posiciones futuras.",
    url: "https://www.n2yo.com/api/",
    access: "key-gratis",
    topics: ["órbitas"],
    limit: "1000 transacciones/hora",
  },
  {
    id: "openaq",
    name: "OpenAQ v3",
    provider: "OpenAQ",
    gives: "Calidad del aire (PM2.5, NO2, O3…) de más de 30.000 estaciones.",
    url: "https://explore.openaq.org/register",
    access: "key-gratis",
    topics: ["aire"],
    limit: "60/min · 2000/hora",
  },
  {
    id: "ll2",
    name: "Launch Library 2",
    provider: "The Space Devs",
    gives: "Calendario de lanzamientos del mundo, agencias, astronautas y pads.",
    url: "https://thespacedevs.com/llapi",
    access: "key-gratis",
    topics: ["lanzamientos"],
    limit: "15 req/hora anónimo · con key sube el cupo",
  },
  {
    id: "copernicus",
    name: "Copernicus Data Space",
    provider: "ESA / Copernicus",
    gives: "Sentinel-1 radar, Sentinel-2 óptico, Sentinel-3 y 5P vía Sentinel Hub API.",
    url: "https://documentation.dataspace.copernicus.eu",
    access: "avanzado",
    topics: ["imágenes", "NDVI", "agro"],
    limit: "≈10.000 requests y 10.000 Processing Units al mes",
    note: "Cuenta gratis + OAuth2. El client secret se ve una sola vez: copialo al crearlo.",
  },
  {
    id: "earth-search",
    name: "Earth Search (Element 84)",
    provider: "Element 84",
    gives: "STAC con Sentinel-2, Sentinel-1, Landsat C2, NAIP y DEM Copernicus. Archivos COG en AWS.",
    url: "https://earth-search.aws.element84.com/v1",
    access: "avanzado",
    topics: ["imágenes", "NDVI"],
    note: "Sin key.",
  },
  {
    id: "pc",
    name: "Microsoft Planetary Computer",
    provider: "Microsoft",
    gives: "STAC sin cuenta; tokens SAS anónimos para bajar datos.",
    url: "https://planetarycomputer.microsoft.com/api/stac/v1",
    access: "avanzado",
    topics: ["imágenes"],
    note: "Los tokens vencen en ~1 h: usá el paquete planetary-computer.",
  },
  {
    id: "smn",
    name: "SMN datasets abiertos",
    provider: "Servicio Meteorológico Nacional",
    gives: "Alertas meteorológicas de 365 días, estaciones y más, en datos.gob.ar.",
    url: "https://datos.gob.ar",
    access: "argentina",
    topics: ["clima", "alertas"],
    note: "Licencia CC BY 2.5 AR: citá al SMN. Los clientes no oficiales de su API fallan a veces; verificá antes de depender de uno.",
  },
  {
    id: "conae",
    name: "CONAE / SAOCOM",
    provider: "CONAE",
    gives: "Catálogo público con miniaturas y productos operativos para agro y emergencias.",
    url: "https://www.argentina.gob.ar/ciencia/conae",
    access: "argentina",
    topics: ["imágenes", "agro"],
    note: "Los datos completos piden convenio y licencia: mostrá el catálogo como fuente, no cuentes con bajar escenas.",
  },
  {
    id: "ign",
    name: "datos.gob.ar / IGN",
    provider: "IGN",
    gives: "Cartografía y datasets públicos (límites provinciales, etc.) para cruzar con lo satelital.",
    url: "https://datos.gob.ar",
    access: "argentina",
    topics: ["mapa"],
  },
];

export type Category = {
  id: string;
  name: string;
  tag: string;
  summary: string;
  rule: string;
  ideas: string[];
  data: string[];
  accent: "red" | "gray" | "avant" | "white";
};

export const CATEGORIES: Category[] = [
  {
    id: "geoespacial",
    name: "Geoespacial",
    tag: "Dato real del espacio",
    summary:
      "Un dato del espacio decide algo on-chain: un pago, un registro o una alerta.",
    rule: "Usa al menos un dato real del catálogo.",
    ideas: [
      "Mapa de eventos verificados: cada reporte ciudadano guarda su hash on-chain con coordenadas y hora.",
      "Alerta de incendio pagada: quien reporta un foco confirmado por FIRMS cobra una recompensa de un fondo.",
      "Oráculo de clima espacial (Kp, flares) que publica en Fuji y pausa o ajusta un protocolo.",
      "Prueba de procedencia de imágenes Sentinel: hash + metadatos STAC, verificable públicamente.",
    ],
    data: ["FIRMS", "EONET", "USGS", "NOAA SWPC", "Sentinel"],
    accent: "red",
  },
  {
    id: "rwa",
    name: "RWA",
    tag: "Activos del mundo real",
    summary:
      "Agro, minería y otros activos físicos representados on-chain.",
    rule: "No se tokeniza nada real: activos simulados, datos reales.",
    ideas: [
      "Certificado de cosecha tokenizado cuyo estado (NDVI por lote) se atesta on-chain cada tanto.",
      "Préstamo contra cosecha con hitos: el contrato libera tramos según la evolución satelital del cultivo.",
      "Prueba de actividad minera con cambios de superficie en Sentinel-1/2. Prueba actividad, no reservas.",
      "Trazabilidad de exportación (vino, cereal): hitos del lote, clima y origen on-chain.",
    ],
    data: ["Sentinel-2 NDVI", "POWER", "Open-Meteo", "Earth Search"],
    accent: "gray",
  },
  {
    id: "agentes",
    name: "Agentes",
    tag: "Identidad, reputación y pagos",
    summary:
      "Agentes o dispositivos con identidad, reputación y pagos.",
    rule: "Identidad, reputación o pagos on-chain.",
    ideas: [
      "Agente observador por zona que lee FIRMS y Open-Meteo y publica alertas con reputación acumulada (patrón ERC-8004; verificá el estado actual del estándar).",
      "Mercado de datos derivados con pago por llamada (x402; verificá el soporte en Fuji).",
      "Robot o ESP32 con identidad on-chain que firma su telemetría, con tope de gasto por dispositivo.",
      "Agente validador que recomputa el índice de otro y lo atesta.",
    ],
    data: ["FIRMS", "Open-Meteo", "ERC-8004", "x402"],
    accent: "white",
  },
  {
    id: "libre",
    name: "Libre",
    tag: "Experimental",
    summary:
      "Cualquier cosa con blockchain. Premia la originalidad.",
    rule: "Pasa el test de las 4 preguntas.",
    ideas: [
      "DAO de pedidos de observación: la comunidad vota qué zona observar o qué dato publicar.",
      "Juego de predicción sobre eventos reales (¿cuántos sismos M4+ esta semana?), sin dinero real.",
      "Arte generativo on-chain a partir de datos espaciales del día.",
      "Identidad de dispositivo para una red de sensores caseros con reputación.",
    ],
    data: ["Lo que se te ocurra"],
    accent: "avant",
  },
];

export const DELIVERABLES = [
  {
    title: "Contrato desplegado",
    body: "En Fuji o en tu L1, con link al explorer. Sin contrato no hay entrega.",
  },
  {
    title: "Video demo",
    body: "1 a 3 minutos, con una acción on-chain.",
  },
  {
    title: "Pitch deck corto",
    body: "5 a 7 slides, una con el «por qué blockchain».",
  },
  {
    title: "Repo o link del proyecto",
    body: "O el link de v0, Lovable o Stitch. Sin repo no descalifica.",
  },
];

export const PRIZES = [
  { place: "1.º", usd: 400, credits: 500 },
  { place: "2.º", usd: 200, credits: 500 },
  { place: "3.º", usd: 100, credits: 500 },
];

export const CRITERIA = [
  { name: "Impacto", q: "¿A quién le resuelve qué y quién paga? Un problema local real del NOA suma." },
  { name: "Creatividad", q: "¿El cruce de dato y blockchain es original, aunque el MVP sea simple?" },
  { name: "Validez", q: "¿Funciona? Contrato desplegado, una acción demostrable on-chain y datos reales." },
  { name: "Justificación de blockchain", q: "¿Pasa el test de las 4 preguntas y responde qué pasa si el dato miente?" },
  { name: "Presentación", q: "Video demo y pitch claros, con atribución de las fuentes de datos." },
];

export const BLOCKCHAIN_TEST = [
  { q: "¿Quién desconfía de quién?", hint: "Si hay una sola parte, no hace falta cadena." },
  { q: "¿Qué evento dispara algo on-chain?", hint: "Un pago, una liberación, un registro o un voto." },
  { q: "¿Qué pasa si el dato miente?", hint: "Hay que tener una respuesta para el oráculo." },
  { q: "¿Quién paga o cobra, y cuánto?", hint: "Si no se puede responder, replantear antes de escribir código." },
];

export const CHAIN_ROLES = [
  { name: "Disparador", body: "Libera algo cuando se cumple una condición." },
  { name: "Procedencia", body: "Prueba que un dato existía y no cambió." },
  { name: "Pago", body: "Cobro entre personas, empresas o máquinas." },
  { name: "Propiedad y acceso", body: "Licencias y reparto de ingresos." },
];

export const LOCAL_PROBLEMS = [
  "Incendios",
  "Heladas",
  "Sequía",
  "Lluvias intensas",
  "Litio",
  "Vid",
  "Caña de azúcar",
  "Minería",
  "Agua",
];

export const ORACLE_OPTIONS = [
  { name: "Relayer propio", body: "Un script lee la API y firma una tx en Fuji. El más rápido para la demo; confiás en tu script." },
  { name: "Varios relayers", body: "Varios publican su lectura y el contrato compara (mediana o quórum)." },
  { name: "Chainlink Functions", body: "La red Chainlink ejecuta JS que consulta la API. Pide una subscription con LINK de testnet: probalo antes." },
  { name: "Commit de hash", body: "Guardás solo el hash del dato más fecha y fuente. Barato y muy demostrable." },
  { name: "L1 con validadores", body: "Los validadores son los proveedores de datos. Una red con reglas y gas propios, hecha para tu caso." },
];

export type Step = {
  id: string;
  title: string;
  time: string;
  body: string;
  output: string;
};

export const GUIDE_STEPS: Step[] = [
  {
    id: "categoria",
    title: "Elegí la categoría",
    time: "5 min",
    body: "Geoespacial, RWA, Agentes o Libre. Elegís una principal y podés cruzarla con otra.",
    output: "Una palabra: tu categoría.",
  },
  {
    id: "problema",
    title: "Buscá un problema local real",
    time: "10 min",
    body: "Pensá en Salta y el NOA: incendios, heladas, sequía, lluvias intensas, litio, vid, caña, minería, agua. Escribí a quién le pasa qué.",
    output: "Una frase: «X le pasa a Y».",
  },
  {
    id: "dato",
    title: "Elegí el dato y probá la API",
    time: "10 min",
    body: "Buscá en el dashboard una API que mida tu problema. Hacé una llamada real y guardá la respuesta en sample-data/ para la demo.",
    output: "Un JSON real guardado.",
  },
  {
    id: "test",
    title: "Pasá el test de blockchain",
    time: "10 min",
    body: "Respondé las 4 preguntas de abajo. Si alguna queda sin respuesta, replanteá antes de escribir código.",
    output: "Las 4 respuestas.",
  },
  {
    id: "evento",
    title: "Definí el evento on-chain",
    time: "15 min",
    body: "Pensá el contrato mínimo: una sola función que importe. «Cuando [condición], el contrato [acción]».",
    output: "Una oración y una función.",
  },
  {
    id: "confianza",
    title: "Resolvé qué pasa si el dato miente",
    time: "10 min",
    body: "Elegí cómo evitar que el dato falle o te lo manipulen. Dibujá 3 cajas: fuente, quien lo publica, contrato.",
    output: "Un diagrama de 3 cajas.",
  },
  {
    id: "mvp",
    title: "Recortá a MVP",
    time: "10 min",
    body: "Un MVP simple que funciona le gana a algo ambicioso que no corre. Anotá 3 cosas que sí y 3 que no.",
    output: "Lista de 3 sí y 3 no.",
  },
  {
    id: "build",
    title: "Desarrollá",
    time: "la mayor parte del tiempo",
    body: "Conectá Core Wallet a Fuji, pedí AVAX de prueba, desplegá el contrato y escribí un script (relayer) que lleve el dato. Pegale a tu IA una respuesta real de la API, no solo el nombre. El reglamento permite herramientas, librerías y servicios públicos, pero pide que la solución sea trabajo original del equipo, producido durante el hackathon.",
    output: "Contrato en Fuji y una acción on-chain que funcione.",
  },
  {
    id: "pitch",
    title: "Armá el pitch deck",
    time: "5 a 7 slides",
    body: "Problema, solución, cómo funciona (dato → contrato), por qué blockchain, demo, modelo (quién paga y cobra), próximos pasos y fuentes.",
    output: "Deck corto con la slide de «por qué blockchain».",
  },
  {
    id: "video",
    title: "Grabá el video demo",
    time: "1 a 3 min",
    body: "Tres pasos: el problema, el dato entrando, la acción on-chain en el explorer. Mostrá una transacción real.",
    output: "Un video que muestre una acción on-chain.",
  },
  {
    id: "entrega",
    title: "Entregá",
    time: "antes del 13/11 a las 09:00",
    body: "Revisá la checklist de entrega: contrato en el explorer, video, deck, repo o link, y la línea de atribución a las fuentes.",
    output: "Todo subido a tiempo.",
  },
];

export const DELIVERY_CHECKLIST = [
  "Dirección del contrato en el explorer de Fuji (o de la L1)",
  "Video demo (1 a 3 min) con una acción on-chain",
  "Pitch deck corto, con la slide «por qué blockchain»",
  "Repo o link del proyecto (v0 u otra herramienta) si se puede",
  "Una línea de atribución a las fuentes de datos",
  "Opcional: sample-data/ con una respuesta real de cada API usada (plan B si cae internet)",
];

export const PARTICIPANT_CHECKLIST = [
  "Key de NASA en api.nasa.gov",
  "MAP_KEY de FIRMS (si vas a hacer incendios)",
  "Cuenta de Copernicus Data Space (si vas a usar imágenes): guardá el OAuth secret",
  "Cuenta de Builder Hub, Core Wallet en modo testnet y AVAX del faucet",
  "Una respuesta real de cada API que uses guardada en sample-data/",
  "Un archivo .env con las keys; nunca lo subas a GitHub",
];

export const CANVAS = `Categoría:
Problema local (quién sufre qué):
Dato real que usamos (API + campo):
Evento on-chain (cuando X, el contrato hace Y):
Quién paga / quién cobra:
Qué pasa si el dato miente:
Contrato mínimo (1 función clave):
Video demo (3 pasos):
Fuera de alcance (3 cosas):`;

export const AI_PROMPT = `Contexto: te paso CATALOGO_APIS.md y BRAINSTORM_Y_CATEGORIAS.md.
Soy [programador / no programador] y elijo la categoría [X].
Proponeme 5 ideas distintas para el problema [describí el problema local],
usando solo datos reales del catálogo. Para cada una: dato, evento on-chain,
quién paga, qué pasa si el dato miente, y qué haría falta para un MVP
desplegado en Avalanche Fuji. Marcá cuáles NO justifican blockchain y por qué.
Después ayudame a elegir una y a recortarla a un MVP de 24 horas.`;

export const INSURANCE = [
  { risk: "Sequía (agro)", data: "NASA POWER, Open-Meteo", trigger: "Lluvia acumulada bajo X mm en N días" },
  { risk: "Helada (vid, hortalizas)", data: "Open-Meteo", trigger: "Mínima bajo 0 °C" },
  { risk: "Incendio cerca de una parcela", data: "NASA FIRMS", trigger: "Focos dentro de X km en 24 h" },
  { risk: "Sismo", data: "USGS", trigger: "Magnitud ≥ X dentro de un radio" },
  { risk: "Tormenta solar (infraestructura)", data: "NOAA SWPC / DONKI", trigger: "Kp ≥ X" },
];

export type GeoTool = {
  name: string;
  url: string;
  body: string;
  kind: "ver" | "datos" | "mapa" | "local";
  code?: boolean;
};

export const GEO_TOOLS: GeoTool[] = [
  { name: "NASA Worldview", url: "https://worldview.earthdata.nasa.gov", body: "Explorá capas satelitales en el navegador, sacá una captura y listo. No pide código.", kind: "ver" },
  { name: "Copernicus Browser", url: "https://browser.dataspace.copernicus.eu", body: "Buscá y mirá imágenes Sentinel sin escribir código.", kind: "ver" },
  { name: "NASA GIBS", url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/", body: "La mejor opción para mostrar imágenes en un mapa sin procesar nada.", kind: "datos", code: true },
  { name: "Earth Search (STAC)", url: "https://earth-search.aws.element84.com/v1", body: "Sentinel-2, Sentinel-1, Landsat y DEM, sin key.", kind: "datos", code: true },
  { name: "Planetary Computer", url: "https://planetarycomputer.microsoft.com/api/stac/v1", body: "STAC sin cuenta, con tokens SAS anónimos que vencen en ~1 h.", kind: "datos", code: true },
  { name: "NASA FIRMS", url: "https://firms.modaps.eosdis.nasa.gov", body: "Focos de calor casi en tiempo real. Pedí una MAP_KEY y filtrá por país (ARG).", kind: "datos", code: true },
  { name: "satellite.js", url: "https://github.com/shashwatak/satellite-js", body: "Calcula la posición de un satélite desde TLE/OMM (SGP4) en el navegador.", kind: "mapa", code: true },
  { name: "CesiumJS", url: "https://cesium.com/platform/cesiumjs/", body: "Globo 3D con órbitas reales. Patrón típico: CelesTrak → satellite.js → Cesium.", kind: "mapa", code: true },
  { name: "globe.gl", url: "https://globe.gl", body: "Puntos sobre un globo. Ideal con GeoJSON de USGS o EONET.", kind: "mapa", code: true },
  { name: "Leaflet", url: "https://leafletjs.com", body: "Mapa 2D simple para marcadores y capas.", kind: "mapa", code: true },
  { name: "MapLibre", url: "https://maplibre.org", body: "Mapas vectoriales con más control de estilo.", kind: "mapa", code: true },
  { name: "Chart.js", url: "https://www.chartjs.org", body: "Series de tiempo: Kp, temperatura, radiación.", kind: "mapa", code: true },
  { name: "SMN en datos.gob.ar", url: "https://datos.gob.ar", body: "Alertas, estaciones y más. Licencia CC BY 2.5 AR: citá al SMN.", kind: "local" },
  { name: "CONAE / SAOCOM", url: "https://www.argentina.gob.ar/ciencia/conae", body: "Catálogo público con miniaturas. Los datos completos requieren convenio.", kind: "local" },
  { name: "IGN", url: "https://datos.gob.ar", body: "Límites provinciales y cartografía pública para cruzar con lo satelital.", kind: "local" },
];

export const ATTRIBUTIONS = [
  "NASA GIBS: reconocé el servicio de imágenes (ver earthdata.nasa.gov/gibs).",
  "Copernicus: «Contains modified Copernicus Sentinel data [año]».",
  "SMN: licencia CC BY 2.5 Argentina; citá al Servicio Meteorológico Nacional.",
];

export const L1_COMPARE = [
  { row: "Quién publica datos", c: "Cualquiera con una wallet", l1: "Solo una lista permitida (allowlist)" },
  { row: "Validadores", c: "Los de la red principal", l1: "Los tuyos, por ejemplo los proveedores de datos" },
  { row: "Gas", c: "AVAX", l1: "Token propio, si lo necesitás" },
  { row: "Reglas", c: "Las de la C-Chain", l1: "Personalizadas" },
  { row: "Despliegue", c: "Desplegás y listo", l1: "Unos pasos guiados en la consola de Builder Hub" },
  { row: "Ejemplo", c: "Promediar datos de varias fuentes", l1: "Red de sensores con allowlist y gas propio" },
];

export const L1_PREFLIGHT = [
  "Crear la L1 en Builder Hub",
  "Desplegarla con nodos de prueba",
  "Conectar la wallet a la L1",
  "Desplegar un contrato de prueba en la L1",
];
