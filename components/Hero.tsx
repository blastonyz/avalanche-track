import Link from "next/link";
import { REFERRAL_URL } from "@/lib/links";
import HeroLive from "./HeroLive";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell">
        <div className="hero-top">
          <div>
            <div className="hero-kicker">
              <i aria-hidden="true" />
              <span className="eyebrow">Track Blockchain, Avalanche</span>
            </div>
            <h1 className="hero-title" id="hero-title">
              <span>Del espacio</span>
              <span>a la cadena</span>
            </h1>
          </div>
        </div>

        <HeroLive />

        <dl className="hero-facts">
          <div>
            <dt>Evento</dt>
            <dd>11, 12 y 13 de noviembre de 2026</dd>
          </div>
          <div>
            <dt>Sede</dt>
            <dd>Centro de Convenciones de Salta</dd>
          </div>
          <div>
            <dt>Entrega</dt>
            <dd>Viernes 13/11, tercera jornada</dd>
          </div>
          <div className="hero-cta">
            <a className="btn btn--small" href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">
              Crear cuenta en Builder Hub
            </a>
            <Link className="btn btn--ghost btn--small" href="/guia">
              Empezar la guía
            </Link>
          </div>
        </dl>
      </div>
    </section>
  );
}
