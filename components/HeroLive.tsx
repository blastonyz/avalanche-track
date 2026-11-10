"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LAND_PATH } from "@/lib/worldPath";
import { SALTA } from "@/lib/links";
import CopyButton from "./CopyButton";

type Fix = { lat: number; lon: number; alt: number; vel: number; ts: number };
type Status = "loading" | "ok" | "error";

const W = 1000;
const H = 500;
const X = (lon: number) => ((lon + 180) / 360) * W;
const Y = (lat: number) => ((90 - lat) / 180) * H;
const API = "https://api.wheretheiss.at/v1/satellites/25544";
const POLL_MS = 5000;

function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toFix(j: Record<string, number>): Fix {
  return {
    lat: j.latitude,
    lon: j.longitude,
    alt: j.altitude,
    vel: j.velocity,
    ts: j.timestamp,
  };
}

/** Parte la traza donde la ISS cruza el borde del mapa (±180°) */
function trailPaths(fixes: Fix[]) {
  const out: string[] = [];
  let cur = "";
  let prev: Fix | null = null;
  for (const f of fixes) {
    const pt = `${X(f.lon).toFixed(1)} ${Y(f.lat).toFixed(1)}`;
    if (!prev || Math.abs(f.lon - prev.lon) > 180) {
      if (cur) out.push(cur);
      cur = `M${pt}`;
    } else {
      cur += `L${pt}`;
    }
    prev = f;
  }
  if (cur) out.push(cur);
  return out;
}

export default function HeroLive() {
  const [status, setStatus] = useState<Status>("loading");
  const [fix, setFix] = useState<Fix | null>(null);
  const [trail, setTrail] = useState<Fix[]>([]);
  const [past, setPast] = useState<Fix[]>([]);
  const [hash, setHash] = useState("");
  const [now, setNow] = useState<number>(0);
  const [visible, setVisible] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  // Pausa cuando el mapa no se ve o la pestaña está en segundo plano
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const load = useCallback(async () => {
    try {
      const r = await fetch(API, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const f = toFix(await r.json());
      setFix(f);
      setStatus("ok");
      setTrail((t) => {
        const merged = [...t.filter((x) => x.ts !== f.ts), f].sort((a, b) => a.ts - b.ts);
        return merged.slice(-300);
      });
      const canonical = `iss25544|${f.ts}|${f.lat.toFixed(4)}|${f.lon.toFixed(4)}`;
      setHash(await sha256Hex(canonical));
    } catch {
      setStatus((s) => (s === "ok" ? "ok" : "error"));
    }
  }, []);

  // Siembra la traza con los últimos 10 min (un punto por minuto). Si falla, se arma sola.
  const seed = useCallback(async () => {
    if (seeded.current) return;
    seeded.current = true;
    try {
      const base = Math.floor(Date.now() / 1000);
      const ts = Array.from({ length: 10 }, (_, i) => base - (i + 1) * 60).join(",");
      const r = await fetch(`${API}/positions?timestamps=${ts}&units=kilometers`);
      if (!r.ok) return;
      const arr = (await r.json()) as Record<string, number>[];
      const fixes = arr.map(toFix).sort((a, b) => b.ts - a.ts);
      setPast(fixes.slice(0, 2)); // hace 1 min y hace 2 min
      setTrail((t) => [...fixes, ...t].sort((a, b) => a.ts - b.ts));
    } catch {
      /* sin historial: la traza crece con las lecturas nuevas */
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    let stop = false;
    const tick = () => {
      if (stop || document.visibilityState !== "visible") return;
      load();
    };
    seed();
    tick();
    const id = setInterval(tick, POLL_MS);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      stop = true;
      clearInterval(id);
      clearInterval(clock);
    };
  }, [visible, load, seed]);

  const paths = useMemo(() => trailPaths(trail), [trail]);
  const dist = fix ? Math.round(km(fix, SALTA)) : null;
  const age = fix && now ? Math.max(0, Math.round(now / 1000 - fix.ts)) : null;
  const short = hash ? `0x${hash.slice(0, 10)}…${hash.slice(-8)}` : "calculando…";
  const fmt = (n: number, d = 2) =>
    n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="live" ref={boxRef}>
      <div className="live-bar">
        <span>
          <i className={`live-dot live-dot--${status}`} aria-hidden="true" />
          {status === "ok" && "Dato real en vivo: ISS, fuente wheretheiss.at"}
          {status === "loading" && "Buscando la ISS…"}
          {status === "error" && "No pudimos traer la posición de la ISS"}
        </span>
        <span>{age !== null && status === "ok" ? `lectura de hace ${age} s` : " "}</span>
      </div>

      <svg
        className="live-map"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={
          fix
            ? `Mapa del mundo con la ISS sobre latitud ${fmt(fix.lat)} y longitud ${fmt(fix.lon)}, a ${dist} kilómetros de Salta`
            : "Mapa del mundo; esperando la posición de la ISS"
        }
      >
        <defs>
          <pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.25" fill="#a2afb2" />
          </pattern>
          <clipPath id="land">
            <path d={LAND_PATH} />
          </clipPath>
        </defs>

        {/* Retícula: líneas de medición cada 30° */}
        <g stroke="#3b484b" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lo) => (
            <line key={lo} x1={X(lo)} y1="0" x2={X(lo)} y2={H} opacity={lo === 0 ? 0.9 : 0.45} />
          ))}
          {[-60, -30, 0, 30, 60].map((la) => (
            <line key={la} x1="0" y1={Y(la)} x2={W} y2={Y(la)} opacity={la === 0 ? 0.9 : 0.45} />
          ))}
        </g>

        <g clipPath="url(#land)">
          <rect width={W} height={H} fill="url(#dots)" opacity="0.75" />
        </g>

        <g className="hide-sm" fill="#a2afb2" fontFamily="var(--font-mono)" fontSize="11">
          {[-120, -60, 0, 60, 120].map((lo) => (
            <text key={lo} x={X(lo) + 5} y="14">
              {lo}°
            </text>
          ))}
          {[60, 30, 0, -30, -60].map((la) => (
            <text key={la} x="6" y={Y(la) - 5}>
              {la}°
            </text>
          ))}
        </g>

        {/* Salta */}
        <g>
          <rect
            x={X(SALTA.lon) - 6}
            y={Y(SALTA.lat) - 6}
            width="12"
            height="12"
            fill="#e6212f"
          />
          <text
            className="hide-sm"
            x={X(SALTA.lon) + 12}
            y={Y(SALTA.lat) + 5}
            fill="#ebf0fa"
            fontFamily="var(--font-mono)"
            fontSize="14"
            fontWeight="600"
          >
            Salta
          </text>
        </g>

        {/* Traza y posición */}
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#f7b031"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {past.map((f, i) => (
          <g key={f.ts}>
            <circle cx={X(f.lon)} cy={Y(f.lat)} r="4.5" fill="#121212" stroke="#f7b031" strokeWidth="1.5" />
            <text
              className="hide-sm"
              x={X(f.lon) - 8}
              y={Y(f.lat) + 18}
              textAnchor="end"
              fill="#f7b031"
              fontFamily="var(--font-mono)"
              fontSize="12"
            >
              {`-${i + 1} min`}
            </text>
          </g>
        ))}

        {fix && (
          <g>
            <line
              x1={X(fix.lon)}
              y1={Y(fix.lat)}
              x2={X(SALTA.lon)}
              y2={Y(SALTA.lat)}
              stroke="#e6212f"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={X(fix.lon)}
              cy={Y(fix.lat)}
              r="15"
              fill="none"
              stroke="#f7b031"
              strokeWidth="1.5"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={X(fix.lon)} cy={Y(fix.lat)} r="6.5" fill="#f7b031" />
            <text
              className="hide-sm"
              x={X(fix.lon) + 20}
              y={Y(fix.lat) - 12}
              fill="#f7b031"
              fontFamily="var(--font-mono)"
              fontSize="14"
              fontWeight="600"
            >
              ISS
            </text>
          </g>
        )}
      </svg>

      {status === "error" && !fix && (
        <p className="live-error">
          La red está caída o la API alcanzó su límite de pedidos. Reintentamos solos cada pocos
          segundos; el resto del sitio funciona igual.
        </p>
      )}

      <div className="readout">
        <div>
          <b>{fix ? `${fmt(fix.lat)}°` : "—"}</b>
          <span>latitud</span>
        </div>
        <div>
          <b>{fix ? `${fmt(fix.lon)}°` : "—"}</b>
          <span>longitud</span>
        </div>
        <div>
          <b>{fix ? `${fmt(fix.alt, 0)} km` : "—"}</b>
          <span>altitud</span>
        </div>
        <div>
          <b>{fix ? `${fmt(fix.vel, 0)} km/h` : "—"}</b>
          <span>velocidad</span>
        </div>
        <div>
          <b>{dist !== null ? `${fmt(dist, 0)} km` : "—"}</b>
          <span>distancia a Salta</span>
        </div>
      </div>

      <div className="pipe">
        <div>
          <span className="pipe-n">Paso 1</span>
          <h3>El dato</h3>
          <p>Una lectura real del espacio, con fecha y fuente.</p>
          <code>
            {fix
              ? `iss25544|${fix.ts}|${fix.lat.toFixed(4)}|${fix.lon.toFixed(4)}`
              : "esperando lectura…"}
          </code>
        </div>
        <div>
          <span className="pipe-n">Paso 2</span>
          <h3>La huella</h3>
          <p>SHA-256 del dato, calculado en tu navegador.</p>
          <code>{short}</code>
          {hash && <CopyButton text={`0x${hash}`} label="Copiar huella completa" />}
        </div>
        <div>
          <span className="pipe-n">Paso 3</span>
          <h3>El contrato</h3>
          <p>
            Un contrato en Fuji guardaría solo la huella, la hora y la fuente. Acá no se envía nada
            a la cadena: es la demostración del patrón.
          </p>
          <Link className="btn btn--ghost btn--small" href="/blockchain#oraculo">
            Cómo se lleva un dato a la cadena
          </Link>
        </div>
      </div>
    </div>
  );
}
