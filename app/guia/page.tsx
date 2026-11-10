import type { Metadata } from "next";
import Link from "next/link";
import Checklist from "@/components/Checklist";
import CopyButton from "@/components/CopyButton";
import PageHead from "@/components/PageHead";
import {
  AI_PROMPT,
  BLOCKCHAIN_TEST,
  CANVAS,
  CHAIN_ROLES,
  DELIVERY_CHECKLIST,
  GUIDE_STEPS,
  LOCAL_PROBLEMS,
  ORACLE_OPTIONS,
} from "@/lib/data";
import GuideTabs from "@/components/GuideTabs";
import ToolGrid from "@/components/ToolGrid";
import SolutionBuilder from "@/components/SolutionBuilder";
import {
  CONTRACT_EXAMPLE,
  DEMO_SCRIPT,
  DEMO_TIPS,
  FLOW,
  MVP_NO,
  MVP_YES,
  PROBLEM_QUESTIONS,
  PROMPT_BRAINSTORM,
  PROMPT_REDTEAM,
  ROLES,
  SPLITS,
  TIPS,
} from "@/lib/guide";

export const metadata: Metadata = {
  title: "Guía paso a paso | Track Blockchain Avalanche",
};

const SLIDES = [
  { t: "Problema", d: "A quién le pasa qué, en el NOA." },
  { t: "Solución", d: "Qué hace tu proyecto en una frase." },
  { t: "Cómo funciona", d: "Dato real → relayer → contrato." },
  { t: "Por qué blockchain", d: "Las 4 respuestas del test.", hl: true },
  { t: "Demo", d: "Captura de la acción on-chain." },
  { t: "Modelo", d: "Quién paga y quién cobra." },
  { t: "Próximos pasos y fuentes", d: "Qué falta y atribución de datos." },
];

function Extra({ id }: { id: string }) {
  switch (id) {
    case "problema":
      return (
        <div className="chips-row" aria-label="Problemas locales de ejemplo">
          {LOCAL_PROBLEMS.map((p) => (
            <span className="chip chip--gray" key={p}>
              {p}
            </span>
          ))}
        </div>
      );
    case "dato":
      return (
        <div>
          <Link className="btn btn--ghost btn--small" href="/dashboard">
            Ir al dashboard de APIs
          </Link>
        </div>
      );
    case "test":
      return (
        <>
          <ol className="qlist">
            {BLOCKCHAIN_TEST.map((q) => (
              <li key={q.q}>
                <strong>{q.q}</strong>
                <span>{q.hint}</span>
              </li>
            ))}
          </ol>
          <div className="mini-grid" aria-label="Roles de la cadena">
            {CHAIN_ROLES.map((r) => (
              <div key={r.name}>
                <strong>{r.name}</strong>
                <span>{r.body}</span>
              </div>
            ))}
          </div>
        </>
      );
    case "confianza":
      return (
        <div className="mini-grid" aria-label="Opciones de confianza">
          {ORACLE_OPTIONS.map((o) => (
            <div key={o.name}>
              <strong>{o.name}</strong>
              <span>{o.body}</span>
            </div>
          ))}
        </div>
      );
    case "build":
      return (
        <div>
          <Link className="btn btn--ghost btn--small" href="/blockchain">
            Core Wallet, faucet y red Fuji
          </Link>
        </div>
      );
    case "pitch":
      return (
        <div className="slides" aria-label="Estructura sugerida del deck">
          {SLIDES.map((s, i) => (
            <div key={s.t} className={s.hl ? "hl" : undefined}>
              <span className="sn">Slide {i + 1}</span>
              <strong>{s.t}</strong>
              <span>{s.d}</span>
            </div>
          ))}
        </div>
      );
    case "entrega":
      return <Checklist id="entrega" items={DELIVERY_CHECKLIST} />;
    default:
      return null;
  }
}

const HUB = [
  { href: "/blockchain", title: "Blockchain y Avalanche", body: "Core Wallet, faucet, Fuji y tu L1." },
  { href: "/dashboard", title: "Dashboard de APIs", body: "Todas las fuentes de datos, con etiquetas." },
  { href: "/geoespacial", title: "Herramientas geoespaciales", body: "Visores y librerías para datos del espacio." },
];

function General() {
  return (
    <div className="general">
      <section className="gsec" id="flujo">
        <span className="eyebrow">Flujo</span>
        <h2>De la idea al código en 5 etapas</h2>
        <ol className="flow">
          {FLOW.map((f, i) => (
            <li key={f.t}>
              <span className="flow-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
              <ul>
                {f.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="chips">
                {f.tools.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <b className="flow-out">{f.out}</b>
            </li>
          ))}
        </ol>
        <details className="collapse">
          <summary>Prompt para buscar problemas (etapa 1)</summary>
          <div className="codeblock">
            <pre>{PROMPT_BRAINSTORM}</pre>
            <CopyButton text={PROMPT_BRAINSTORM} label="Copiar prompt" />
          </div>
        </details>
        <details className="collapse">
          <summary>Prompt para atacar tu idea (etapa 3)</summary>
          <div className="codeblock">
            <pre>{PROMPT_REDTEAM}</pre>
            <CopyButton text={PROMPT_REDTEAM} label="Copiar prompt" />
          </div>
        </details>
      </section>

      <section className="gsec" id="consejos">
        <span className="eyebrow">Consejos</span>
        <h2>Lo que más se pierde en un hackathon</h2>
        <div className="tips">
          {TIPS.map((t, i) => (
            <div key={t.t}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <strong>{t.t}</strong>
              <p>{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gsec" id="g-problema">
        <span className="eyebrow">Problema</span>
        <h2>Un problema que un dato pueda medir</h2>
        <ol className="qlist">
          {PROBLEM_QUESTIONS.map((q) => (
            <li key={q}>
              <strong>{q}</strong>
            </li>
          ))}
        </ol>
        <div className="chips-row" aria-label="Problemas locales de ejemplo">
          {LOCAL_PROBLEMS.map((p) => (
            <span className="chip chip--gray" key={p}>
              {p}
            </span>
          ))}
        </div>
        <div>
          <Link className="btn btn--ghost btn--small" href="/dashboard">
            Buscar el dato en el dashboard
          </Link>
        </div>
      </section>

      <section className="gsec" id="g-solucion">
        <span className="eyebrow">Solución</span>
        <h2>Armá tu frase</h2>
        <SolutionBuilder />
        <details className="collapse">
          <summary>Contrato de ejemplo (sin auditar)</summary>
          <div className="codeblock">
            <pre>{CONTRACT_EXAMPLE}</pre>
            <CopyButton text={CONTRACT_EXAMPLE} label="Copiar contrato" />
          </div>
        </details>
        <div>
          <Link className="btn btn--ghost btn--small" href="/blockchain#oraculo">
            Cómo llevar el dato a la cadena
          </Link>
        </div>
      </section>

      <section className="gsec" id="g-mvp">
        <span className="eyebrow">MVP</span>
        <h2>Lo que entra y lo que no</h2>
        <div className="yesno">
          <div>
            <b>Sí</b>
            <ul>
              {MVP_YES.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <b>No, por ahora</b>
            <ul>
              {MVP_NO.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="gsec" id="g-demo">
        <span className="eyebrow">Demo</span>
        <h2>Video de 100 segundos</h2>
        <div className="demo">
          {DEMO_SCRIPT.map((d) => (
            <div key={d.h}>
              <span className="mono">{d.t}</span>
              <strong>{d.h}</strong>
              <p>{d.d}</p>
            </div>
          ))}
        </div>
        <ul className="tiplist">
          {DEMO_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="gsec" id="tareas">
        <span className="eyebrow">División de tareas</span>
        <h2>Quién hace qué</h2>
        <p>Sugerencia. Con menos gente, combinen roles.</p>
        <div className="splits">
          {SPLITS.map((s) => (
            <div key={s.size}>
              <b>{s.size}</b>
              <ul>
                {s.plan.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="roles">
          {ROLES.map((r) => (
            <article key={r.id} className="role" id={`rol-${r.id}`}>
              <h3>{r.name}</h3>
              <p>{r.what}</p>
              <ul>
                {r.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="out">
                <b>Entrega: </b>
                {r.output}
              </p>
              <div className="chips">
                {r.tools.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Guia() {
  return (
    <>
      <PageHead
        eyebrow="Guía"
        title="Del problema a la entrega"
        lead="Consejos, reparto de tareas y paso a paso."
      />

      <div className="shell">
        <div className="hub" aria-label="Más secciones">
          {HUB.map((h, i) => (
            <Link key={h.href} href={h.href} className="hub-tile">
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <strong>{h.title}</strong>
              <span>{h.body}</span>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </div>
      </div>

      <div className="shell section--tight">
        <GuideTabs
          general={<General />}
          steps={
        <div className="guide">
          <nav className="guide-index" aria-label="Pasos de la guía">
            {GUIDE_STEPS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`}>
                <span>{i + 1}</span>
                {s.title}
              </a>
            ))}
            <a href="#canvas">
              <span>+</span>Canvas y prompt
            </a>
          </nav>

          <div className="steps">
            {GUIDE_STEPS.map((s, i) => (
              <section className="step" id={s.id} key={s.id} aria-labelledby={`${s.id}-t`}>
                <div className="step-n" aria-hidden="true">
                  {i + 1}
                </div>
                <div className="step-body">
                  <span className="time">{s.time}</span>
                  <h2 id={`${s.id}-t`}>{s.title}</h2>
                  <p>{s.body}</p>
                  <Extra id={s.id} />
                  <p className="out">
                    <b>Resultado: </b>
                    {s.output}
                  </p>
                </div>
              </section>
            ))}

            <section className="step" id="canvas" aria-labelledby="canvas-t">
              <div className="step-n" aria-hidden="true">
                +
              </div>
              <div className="step-body">
                <span className="time">Para pegar en tu IA</span>
                <h2 id="canvas-t">Canvas y prompt</h2>
                <p>
                  Completá el canvas con una línea por campo y pegalo en tu IA junto con el catálogo
                  de APIs y las reglas del track.
                </p>
                <div className="codeblock">
                  <pre>{CANVAS}</pre>
                  <CopyButton text={CANVAS} label="Copiar canvas" />
                </div>
                <p>
                  Con este prompt le pedís 5 ideas distintas y que marque cuáles no justifican
                  blockchain:
                </p>
                <div className="codeblock">
                  <pre>{AI_PROMPT}</pre>
                  <CopyButton text={AI_PROMPT} label="Copiar prompt" />
                </div>
                <ToolGrid />
                <p className="out">
                  <b>Tip: </b>
                  para que la IA genere bien el cliente, pegale una respuesta real de la API, no
                  solo el nombre.
                </p>
              </div>
            </section>
          </div>
        </div>
                }
        />
      </div>
    </>
  );
}
