"use client";

import { useEffect, useRef, useState } from "react";

type Item = { title: string; body: string };

/** Entregables como barra de progreso: al entrar en pantalla se tildan de a uno. */
export default function DeliverProgress({ items }: { items: Item[] }) {
  const [done, setDone] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setInterval> | undefined;
    const run = () => {
      if (reduce) return setDone(items.length);
      let n = 0;
      timer = setInterval(() => {
        n += 1;
        setDone(n);
        if (n >= items.length) clearInterval(timer);
      }, 650);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [items.length]);

  const pct = (done / items.length) * 100;

  return (
    <div className="dp" ref={ref}>
      <div
        className="dp-head"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={done}
        aria-label="Entregables completos"
      >
        <span className="mono">
          {done} de {items.length} entregables
        </span>
        <div className="dp-track">
          <div className="dp-fill" style={{ width: `${pct}%` }} />
          {items.map((_, i) => (
            <i key={i} style={{ left: `${((i + 1) / items.length) * 100}%` }} />
          ))}
        </div>
        <span className="mono dp-state" data-done={done === items.length}>
          {done === items.length ? "Listo para entregar" : "En camino"}
        </span>
      </div>
      <div className="dp-grid">
        {items.map((d, i) => (
          <div key={d.title} className="dp-item" data-on={i < done}>
            <span className="dp-box" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h3>{d.title}</h3>
            <p>{d.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
