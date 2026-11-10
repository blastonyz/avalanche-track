import type { Metadata } from "next";
import ApiExplorer from "@/components/ApiExplorer";
import Checklist from "@/components/Checklist";
import PageHead from "@/components/PageHead";
import { APIS, PARTICIPANT_CHECKLIST } from "@/lib/data";
import { SKILLS_REPO } from "@/lib/links";

export const metadata: Metadata = {
  title: "Dashboard de APIs | Track Blockchain Avalanche",
};

export default function Dashboard() {
  const count = (a: string) => APIS.filter((x) => x.access === a).length;
  return (
    <>
      <PageHead
        eyebrow="Dashboard"
        title="Datos reales para tu contrato"
        lead="Todas las fuentes del catálogo del track, etiquetadas por cuánto cuesta empezar. Arrancá por las que no piden registro y subí de nivel cuando lo necesites."
      />

      <section className="shell section--tight">
        <div className="stat-row">
          <div className="stat">
            <b>{APIS.length}</b>
            <span>fuentes en total</span>
          </div>
          <div className="stat">
            <b>{count("sin-registro")}</b>
            <span>sin registro</span>
          </div>
          <div className="stat">
            <b>{count("key-gratis")}</b>
            <span>con key gratis</span>
          </div>
          <div className="stat">
            <b>{count("avanzado") + count("argentina")}</b>
            <span>avanzadas y de Argentina</span>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="section-head">
            <h2 className="h-section">Tres Concejos para el hackatón</h2>
          </div>
          <div className="traps">
            <div>
              <span className="warn">Misma IP para todos</span>
              <h3>Sacá tu propia key de NASA</h3>
              <p>
                Todos comparten el WiFi del evento. DEMO_KEY de NASA (≈30 req/hora por IP) y Launch
                Library 2 (≈15 req/hora anónimo) se agotan al toque. Con tu key en api.nasa.gov
                tenés ≈1000 req/hora.
              </p>
            </div>
            <div>
              <span className="warn">Pedidos repetidos</span>
              <h3>Cacheá todo</h3>
              <p>
                Guardá la respuesta en un .json local y trabajá sobre eso. Pedir la misma URL 50
                veces mientras iterás es la forma más rápida de quedarte bloqueado.
              </p>
            </div>
            <div>
              <span className="warn">Si alcanzas el limite</span>
              <h3>Tené un plan B offline</h3>
              <p>
                Guardá una respuesta real de cada API que uses en una carpeta sample-data/ para la
                demo, por si cae el WiFi o la API.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="apis">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Catálogo</span>
            <h2 className="h-section">APIs y datos espaciales</h2>
            <p className="lead">
              Los límites salen de la documentación oficial y de fuentes de terceros, y pueden
              cambiar. Si una API da 429, esperá o usá lo que cacheaste.
            </p>
          </div>
          <ApiExplorer />
        </div>
      </section>

      <section className="section">
        <div className="shell two-col">
          <div>
            <span className="eyebrow">Antes del evento</span>
            <h2 className="h-section" style={{ margin: "20px 0 24px" }}>
              Checklist del participante
            </h2>
            <p className="prose-narrow" style={{ marginBottom: 24 }}>
              Tus tildes se guardan en este navegador.
            </p>
            <Checklist id="participante" items={PARTICIPANT_CHECKLIST} />
          </div>
          <div>
            <span className="eyebrow">Material del track</span>
            <h2 className="h-section" style={{ margin: "20px 0 24px" }}>
              Repo de skills y APIs
            </h2>
            <div className="repo-card">
              <p>
                Skills para tu IA y material de las APIs, listos para pegar como contexto junto con
                el catálogo y las reglas del track.
              </p>
              {SKILLS_REPO ? (
                <div>
                  <a className="btn" href={SKILLS_REPO} target="_blank" rel="noopener noreferrer">
                    Abrir el repo
                  </a>
                </div>
              ) : (
                <p className="mono" style={{ color: "var(--orange)" }}>
                  Falta cargar el link: definí NEXT_PUBLIC_SKILLS_REPO en .env.local.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
