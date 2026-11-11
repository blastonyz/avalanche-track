"use client";

import { useEffect, useState } from "react";
import { DEADLINE_ISO, ENTREGA_URL } from "@/lib/links";

type Left = { d: number; h: number; m: number; s: number; done: boolean };

function calc(): Left {
  const diff = new Date(DEADLINE_ISO).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  done: false,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    setLeft(calc());
    const id = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="countdown-bar">
      <div className="shell">
        <div className="countdown-label">
          <i className="sq" aria-hidden="true" />
          <span className="wordmark wordmark--bar">
            <b>argentinaspace</b> Hackathon
          </span>
          <span className="sr-only">
            {left?.done
              ? "Llegó el viernes 13/11/2026, 09:00"
              : "Cuenta regresiva hasta el viernes 13/11/2026, 09:00, hora de Argentina"}
          </span>
        </div>
        <a className="countdown-cta" href={ENTREGA_URL} target="_blank" rel="noopener noreferrer">
          Entrega <span aria-hidden="true">↗</span>
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <div className="countdown-units" role="timer" aria-label="Tiempo restante">
          {[
            ["días", left ? pad(left.d) : "--"],
            ["h", left ? pad(left.h) : "--"],
            ["min", left ? pad(left.m) : "--"],
            ["seg", left ? pad(left.s) : "--"],
          ].map(([label, val]) => (
            <div className="countdown-unit" key={label}>
              <b>{val}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
