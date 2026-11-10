import Link from "next/link";
import { ATTRIBUTIONS } from "@/lib/data";
import { COMPETENCIA_URL, DOCS_URL, REFERRAL_URL, REGLAMENTO_URL } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <p className="wordmark wordmark--big">
              <b>argentinaspace</b> Hackathon
            </p>
            <p>
              Track Blockchain de Avalanche, Salta, del 11 al 13 de noviembre de 2026.
            </p>
            <div className="brand-logos brand-logos--footer" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/avalanche-ko.png" alt="" width={140} height={21} />
              <i />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/team1-white.png" alt="" width={120} height={16} />
            </div>
          </div>
          <div>
            <h4>En este sitio</h4>
            <ul>
              <li><Link href="/dashboard">Dashboard de APIs</Link></li>
              <li><Link href="/guia">Guía paso a paso</Link></li>
              <li><Link href="/geoespacial">Herramientas geoespaciales</Link></li>
              <li><Link href="/blockchain">Blockchain y Avalanche</Link></li>
            </ul>
          </div>
          <div>
            <h4>Enlaces</h4>
            <ul>
              <li><a href={COMPETENCIA_URL} target="_blank" rel="noopener noreferrer">Sitio del hackathon</a></li>
              <li><a href={REGLAMENTO_URL} target="_blank" rel="noopener noreferrer">Reglamento oficial</a></li>
              <li><a href={DOCS_URL} target="_blank" rel="noopener noreferrer">Documentación de Avalanche</a></li>
              <li><a href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">Builder Hub</a></li>
            </ul>
          </div>
        </div>
        <small>
          Atribución de datos: {ATTRIBUTIONS.join(" ")} Posición de la ISS: wheretheiss.at. Mapa:
          Natural Earth (dominio público). Sitio de ayuda del track, no oficial; Avalanche es marca
          de Ava Labs y Team1 LATAM de sus titulares. El reglamento oficial prevalece sobre este
          sitio.
        </small>
      </div>
    </footer>
  );
}
