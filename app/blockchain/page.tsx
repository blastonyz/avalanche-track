import type { Metadata } from "next";
import AddFujiButton from "@/components/AddFujiButton";
import Checklist from "@/components/Checklist";
import CopyButton from "@/components/CopyButton";
import PageHead from "@/components/PageHead";
import { L1_COMPARE, L1_PREFLIGHT } from "@/lib/data";
import {
  ACADEMY_URL,
  DOCS_URL,
  FUJI,
  L1_COURSE_URL,
  REFERRAL_URL,
} from "@/lib/links";

export const metadata: Metadata = {
  title: "Blockchain y Avalanche | Track Blockchain Avalanche",
};

const FUJI_ROWS: [string, string][] = [
  ["Red", FUJI.name],
  ["Chain ID", `${FUJI.chainId} (${FUJI.chainIdHex})`],
  ["RPC", FUJI.rpc],
  ["Moneda", FUJI.symbol],
  ["Explorer", FUJI.explorer],
];

const CHAINLINK_ROUTER = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";
const CHAINLINK_DON = "fun-avalanche-fuji-1";

export default function Blockchain() {
  return (
    <>
      <PageHead
        eyebrow="Blockchain"
        title="Todo Avalanche en una página"
        lead="De cero a un contrato desplegado en Fuji: wallet, AVAX de prueba, red, cómo llevar un dato a la cadena y cuándo conviene una L1 propia."
      />

      <section className="section" id="empezar">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Empezando</span>
            <h2 className="h-section">Cinco pasos hasta tu primera tx</h2>
          </div>
          <div className="steps">
            <section className="step" aria-labelledby="b1">
              <div className="step-n" aria-hidden="true">1</div>
              <div className="step-body">
                <h2 id="b1">Instalá Core Wallet</h2>
                <p>
                  Core es la wallet de Avalanche. Instalala como extensión del navegador y creá una
                  cuenta nueva solo para el hackatón. Anotá la frase de recuperación en papel y no la
                  compartas ni la subas a ningún repo.
                </p>
                <div>
                  <a className="btn" href="https://core.app" target="_blank" rel="noopener noreferrer">
                    Descargar Core
                  </a>
                </div>
              </div>
            </section>

            <section className="step" aria-labelledby="b2">
              <div className="step-n" aria-hidden="true">2</div>
              <div className="step-body">
                <h2 id="b2">Cambiá a testnet y sumá Fuji</h2>
                <p>
                  Activá el modo testnet de Core. Si no ves Fuji, agregala con el botón de abajo o
                  cargá los datos de la tabla a mano.
                </p>
                <AddFujiButton />
                <dl className="kv" aria-label="Datos de la red Fuji">
                  {FUJI_ROWS.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                      <CopyButton text={v} />
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section className="step" aria-labelledby="b3">
              <div className="step-n" aria-hidden="true">3</div>
              <div className="step-body">
                <h2 id="b3">Creá tu cuenta de Builder Hub</h2>
                <p>
                  Con la cuenta y Core conectada, la consola te manda AVAX de prueba para C-Chain y
                  P-Chain cuando hace falta, y desbloquea la creación de L1.
                </p>
                <div>
                  <a className="btn" href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">
                    Crear cuenta en Builder Hub
                  </a>
                </div>
              </div>
            </section>

            <section className="step" aria-labelledby="b4">
              <div className="step-n" aria-hidden="true">4</div>
              <div className="step-body">
                <h2 id="b4">Pedí AVAX de prueba (faucet)</h2>
                <p>
                  La testnet no usa plata real. Tenés dos caminos para conseguir AVAX en Fuji:
                </p>
                <div className="mini-grid">
                  <div>
                    <strong>Faucet de Builder Hub</strong>
                    <span>
                      Pide la cuenta de Builder Hub y Core conectada. Dentro de la consola, buscá
                      Primary Network y después Faucet.
                    </span>
                    <a
                      className="btn btn--ghost btn--small"
                      style={{ justifySelf: "start", marginTop: 8 }}
                      href={REFERRAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir Builder Hub
                    </a>
                  </div>
                  <div>
                    <strong>Faucet de Core</strong>
                    <span>
                      No pide cuenta de Builder Hub, pero sí un cupón. El Academy de Avalanche usa
                      avalanche-academy o avalanche-academy25 y entrega 2 AVAX en C-Chain.
                    </span>
                    <a
                      className="btn btn--ghost btn--small"
                      style={{ justifySelf: "start", marginTop: 8 }}
                      href="https://core.app/tools/testnet-faucet/?subnet=c&token=c"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir faucet de Core
                    </a>
                  </div>
                </div>
                <p className="callout callout--orange">
                  <strong>Si el cupón ya no funciona:</strong>
                  los cupones pueden vencer. Usá el faucet de Builder Hub o pedile uno a tu
                  mentor.
                </p>
              </div>
            </section>

            <section className="step" aria-labelledby="b5">
              <div className="step-n" aria-hidden="true">5</div>
              <div className="step-body">
                <h2 id="b5">Desplegá y verificá</h2>
                <p>
                  Desplegá tu contrato en Fuji con la herramienta que prefieras (Remix, Foundry o
                  Hardhat apuntando al RPC de arriba) y abrí la dirección en el explorer. Ese link es
                  lo que hay que entregar.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a
                    className="btn btn--ghost btn--small"
                    href="https://remix.ethereum.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Remix
                  </a>
                  <a
                    className="btn btn--ghost btn--small"
                    href={FUJI.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explorer de Fuji
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section" id="oraculo">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Del dato a la cadena</span>
            <h2 className="h-section">Los contratos no llaman APIs</h2>
            <p className="lead">
              Alguien tiene que llevar el dato. Hay tres patrones, del más simple al más complejo.
            </p>
          </div>
          <div className="mini-grid">
            <div>
              <strong>1. Relayer propio</strong>
              <span>
                Un script Node o Python lee la API (FIRMS, DONKI, Open-Meteo), decide y firma una tx
                que escribe en tu contrato en Fuji. El más rápido para la demo; confiás en tu script,
                que es centralizado.
              </span>
            </div>
            <div>
              <strong>2. Chainlink Functions</strong>
              <span>
                El contrato pide a la red Chainlink que ejecute JS que consulta una API. Requiere una
                subscription fondeada con LINK de testnet: probalo antes.
              </span>
              <span className="mono">Router en Fuji: {CHAINLINK_ROUTER}</span>
              <span className="mono">DON ID: {CHAINLINK_DON}</span>
            </div>
            <div>
              <strong>3. Commit de hash</strong>
              <span>
                Guardás solo el hash de la imagen o dataset, más fecha y fuente. Es la prueba de que
                el dato existía y no cambió. Barato y muy demostrable.
              </span>
            </div>
            <div>
              <strong>Datos de mercado</strong>
              <span>
                Chainlink Data Feeds, Chronicle y DIA tienen feeds o demos en Fuji, por si querés
                combinar precios con datos espaciales.
              </span>
            </div>
          </div>
          <div className="callout" style={{ marginTop: 28 }}>
            <strong>Qué pasa si el dato miente</strong>
            <p>
              Para el evento alcanza con un relayer. Para ir más lejos: varios relayers que comparan
              (mediana o quórum) o una L1 donde los validadores son los proveedores de datos.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="l1">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">L1 propia</span>
            <h2 className="h-section">Tu propia L1</h2>
            <p className="lead">
              En este track una L1 dedicada tiene sentido: validadores, gas y reglas a medida de tu
              caso. Y desplegarla desde la consola de Builder Hub es simple.
            </p>
          </div>

          <div className="table-wrap">
            <table className="table compare">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Contrato en C-Chain</th>
                  <th scope="col">L1 dedicada</th>
                </tr>
              </thead>
              <tbody>
                {L1_COMPARE.map((r) => (
                  <tr key={r.row}>
                    <th scope="row">{r.row}</th>
                    <td>{r.c}</td>
                    <td>{r.l1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="preflight">
            <div>
              <span className="eyebrow">Tu L1 en pocos pasos</span>
              <h3 className="h-sub" style={{ margin: "14px 0 12px" }}>
                Creala y desplegala desde la consola
              </h3>
              <p>
                Los nodos de prueba que hostea Builder Hub son gratis y se apagan a los 3 días:
                alcanzan para el hackatón. Para seguir después, la red local de Avalanche CLI es la
                opción más estable. Recorré el flujo completo una vez antes de empezar a construir.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                <a className="btn" href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">
                  Abrir Builder Hub
                </a>
                <a className="btn btn--ghost" href={L1_COURSE_URL} target="_blank" rel="noopener noreferrer">
                  Curso: crear una L1
                </a>
              </div>
            </div>
            <Checklist id="l1-preflight" items={L1_PREFLIGHT} />
          </div>
        </div>
      </section>

      <section className="section" id="docs">
        <div className="shell avax">
          <div>
            <span className="eyebrow">Documentación</span>
            <h2 className="h-section" style={{ margin: "20px 0 0" }}>
              Seguí leyendo
            </h2>
            <ul className="doc-links">
              <li>
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                  <strong>Documentación de Avalanche</strong>
                  <em>docs.avax.network</em>
                  <span>Referencia de la red, contratos y herramientas.</span>
                </a>
              </li>
              <li>
                <a href={ACADEMY_URL} target="_blank" rel="noopener noreferrer">
                  <strong>Avalanche Academy</strong>
                  <em>docs.avax.network/academy</em>
                  <span>Cursos guiados, desde Core Wallet hasta tu L1.</span>
                </a>
              </li>
              <li>
                <a href="https://docs.avax.network/dapps/chain-settings" target="_blank" rel="noopener noreferrer">
                  <strong>Parámetros de red</strong>
                  <em>docs.avax.network</em>
                  <span>Chain ID, RPC y explorer de Mainnet y Fuji.</span>
                </a>
              </li>
            </ul>
          </div>
          <aside className="referral" aria-label="Builder Hub">
            <h3>Builder Hub</h3>
            <p>Tu cuenta para el faucet y la consola de L1.</p>
            <a className="btn" href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">
              Ir a Builder Hub
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
