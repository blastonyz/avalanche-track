"use client";

import { useEffect, useState } from "react";

export default function Checklist({
  id,
  items,
}: {
  id: string;
  items: string[];
}) {
  const key = `avax-track:${id}`;
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === items.length) setDone(parsed);
      }
    } catch {
      /* sin storage: la lista funciona igual, solo no se recuerda */
    }
  }, [key, items.length]);

  function toggle(i: number) {
    setDone((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignorar */
      }
      return next;
    });
  }

  const count = done.filter(Boolean).length;

  return (
    <div>
      <p className="progress" aria-live="polite">
        {count} de {items.length} listas
      </p>
      <ul className="checklist">
        {items.map((it, i) => (
          <li key={it}>
            <label>
              <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
              <span>{it}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
