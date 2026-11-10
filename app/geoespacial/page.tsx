import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { ATTRIBUTIONS, GEO_TOOLS, INSURANCE, type GeoTool } from "@/lib/data";

export const metadata: Metadata = {
  title: "Herramientas geoespaciales | Track Blockchain Avalanche",
};

const GROUPS: { kind: GeoTool["kind"]; title: string; lead: string }[] = [
  {
    kind: "ver",
    title: "Para mirar, sin código",
    lead: "Explorá, sacá una captura y listo. Sirven para el pitch y para entender el dato antes de usarlo.",
  },
  {
    kind: "datos",
    title: "Fuentes de imágenes y focos",
    lead: "De acá sale el dato que llega al contrato.",
  },
  {
    kind: "mapa",
    title: "Para mostrarlo en pantalla",
    lead: "Librerías de mapa, globo y gráficos para el frontend.",
  },
  {
    kind: "local",
    title: "Argentina",
    lead: "El diferencial local: citá la fuente y verificá la licencia.",
  },
];

function host(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function Geoespacial() {
  return (
    <>
      <PageHead
        eyebrow="Geoespacial"
        title="Herramientas para ver la Tierra"
        lead="Mapas, imágenes y librerías para mostrar datos del espacio. Usar FIRMS, Open-Meteo y SMN sobre Salta y el NOA (incendios, lluvias intensas, zonda, sequía) pesa más que un caso genérico."
      />

      <section className="shell section--tight">
        {GROUPS.map((g) => (
          <div className="tool-group" key={g.kind}>
            <div>
              <h2 className="h-sub">{g.title}</h2>
              <p style={{ marginTop: 8, maxWidth: "60ch" }}>{g.lead}</p>
            </div>
            <div className="tool-grid">
              {GEO_TOOLS.filter((t) => t.kind === g.kind).map((t) => (
                <a
                  className="tool"
                  key={t.name}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="host">{host(t.url)}</span>
                  <strong>{t.name}</strong>
                  <span>{t.body}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section" id="seguros">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Patrón</span>
            <h2 className="h-section">Cuando el dato cruza un umbral</h2>
            <p className="lead">
              El usuario paga una prima, un dato verificable cruza un umbral y el contrato paga
              solo. Entra en Geoespacial o en RWA. Lo difícil es la disputa y el dato manipulado:
              para el evento alcanza con un relayer y un token de testnet.
            </p>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Riesgo</th>
                  <th>Dato</th>
                  <th>Umbral de ejemplo</th>
                </tr>
              </thead>
              <tbody>
                {INSURANCE.map((r) => (
                  <tr key={r.risk}>
                    <td>{r.risk}</td>
                    <td>{r.data}</td>
                    <td>{r.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="callout callout--orange">
            <strong>Atribución</strong>
            <p>
              Varias fuentes piden que cites si publicás. Una línea en el footer alcanza.{" "}
              {ATTRIBUTIONS.join(" ")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
