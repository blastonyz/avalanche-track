import Link from "next/link";
import DeliverProgress from "@/components/DeliverProgress";
import Hero from "@/components/Hero";
import {
  CATEGORIES,
  CRITERIA,
  DELIVERABLES,
  PRIZES,
} from "@/lib/data";
import {
  ACADEMY_URL,
  DOCS_URL,
  L1_COURSE_URL,
  REFERRAL_URL,
  REGLAMENTO_URL,
} from "@/lib/links";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section" id="reglas">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Entrega</span>
            <h2 className="h-section">Requisitos de entrega</h2>
            <p className="lead">
              Un MVP que funciona le gana a algo ambicioso que no corre. Un equipo, un solo track.
            </p>
          </div>
          <DeliverProgress items={DELIVERABLES} />
          <div className="note-block">
            <strong>Reglamento oficial</strong>
            <p>
              Borrador interino: las bases definitivas prevalecen. Pide trabajo original, hecho durante
              el hackathon.{" "}
              <a href={REGLAMENTO_URL} target="_blank" rel="noopener noreferrer">
                Leer el reglamento
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="categorias">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Categorías</span>
            <h2 className="h-section">Tres categorías y una libre</h2>
            <p className="lead">
              Elegís una principal y podés cruzarla con otra.
            </p>
          </div>

          <div className="cats">
            {CATEGORIES.map((c) => (
              <article key={c.id} className={`cat cat--${c.accent}`} id={c.id}>
                <span className="cat-tag">{c.tag}</span>
                <h3>{c.name}</h3>
                <p>{c.summary}</p>
                <p className="cat-rule">{c.rule}</p>
                <div className="chips">
                  {c.data.map((d) => (
                    <span className="chip" key={d}>
                      {d}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="section" id="premios">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Premios del track</span>
            <h2 className="h-section">Avalanche y Oracle</h2>
            <p className="lead">
              Cada puesto: premio en AVAX más créditos de Oracle (montos en USD).
            </p>
          </div>
          <div className="prizes">
            {PRIZES.map((p) => (
              <div key={p.place}>
                <span className="prize-place">{p.place}</span>
                <b>USD {p.usd}</b>
                <span>en AVAX</span>
                <b className="prize-plus">+ USD {p.credits}</b>
                <span>en créditos de Oracle</span>
              </div>
            ))}
          </div>
          <p className="fineprint">Confirmá con la organización si el pago es en AVAX.</p>
        </div>
      </section>

      <section className="section" id="criterios">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Cómo se evalúa</span>
            <h2 className="h-section">Cinco criterios, el mismo peso</h2>
            <p className="lead">
              Del documento del track. Lo nuevo: justificá por qué necesitás una cadena.
            </p>
          </div>
          <div className="criteria">
            {CRITERIA.map((c) => (
              <div key={c.name}>
                <h3>{c.name}</h3>
                <p>{c.q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="avalanche">
        <div className="shell avax">
          <div>
            <span className="eyebrow">Construí sobre Avalanche</span>
            <h2 className="h-section" style={{ marginTop: 20 }}>
              Empezá por la documentación
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              Desplegás en Fuji o en una L1 propia.
            </p>
            <ul className="doc-links">
              <li>
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                  <strong>Documentación de Avalanche</strong>
                  <em>docs.avax.network</em>
                  <span>Referencia técnica de la red, contratos y herramientas.</span>
                </a>
              </li>
              <li>
                <a href={ACADEMY_URL} target="_blank" rel="noopener noreferrer">
                  <strong>Avalanche Academy</strong>
                  <em>docs.avax.network/academy</em>
                  <span>Cursos guiados: desarrollo de L1, interoperabilidad y más.</span>
                </a>
              </li>
              <li>
                <a href={L1_COURSE_URL} target="_blank" rel="noopener noreferrer">
                  <strong>Curso: crear una L1</strong>
                  <em>docs.avax.network</em>
                  <span>El paso a paso oficial, de la cuenta al despliegue.</span>
                </a>
              </li>
            </ul>
          </div>

          <aside className="referral" aria-label="Builder Hub">
            <h3>Creá tu cuenta en Builder Hub</h3>
            <p>Faucet de prueba y consola para tu L1.</p>
            <a className="btn" href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">
              Ir a Builder Hub
            </a>
          </aside>
        </div>
      </section>

      <section className="section" id="rutas">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Seguí por acá</span>
            <h2 className="h-section">Elegí por dónde empezar</h2>
          </div>
          <div className="routes">
            <Link href="/guia">
              <div>
                <h3>Guía paso a paso</h3>
                <p>Del problema a la entrega: dato, test de blockchain, contrato, pitch y video.</p>
              </div>
              <span className="go">Abrir la guía</span>
            </Link>
            <Link href="/dashboard">
              <div>
                <h3>Dashboard de APIs</h3>
                <p>
                  Todas las fuentes de datos con etiquetas por acceso y tema. Probalas desde el
                  navegador.
                </p>
              </div>
              <span className="go">Abrir el dashboard</span>
            </Link>
            <Link href="/blockchain">
              <div>
                <h3>Blockchain</h3>
                <p>Core Wallet, faucet, red Fuji, cómo llevar un dato a un contrato y crear una L1.</p>
              </div>
              <span className="go">Abrir blockchain</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
