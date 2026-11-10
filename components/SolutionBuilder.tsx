"use client";

import { useState } from "react";
import { SOLUTION_EXAMPLES } from "@/lib/guide";
import CopyButton from "./CopyButton";

type F = { dato: string; condicion: string; accion: string; persona: string };
const EMPTY: F = { dato: "", condicion: "", accion: "", persona: "" };

export default function SolutionBuilder() {
  const [f, setF] = useState<F>(EMPTY);
  const set = (k: keyof F, v: string) => setF((x) => ({ ...x, [k]: v }));
  const filled = Object.values(f).every((v) => v.trim());
  const ph = (v: string, fallback: string) => (v.trim() ? v.trim() : `[${fallback}]`);
  const sentence = `Cuando ${ph(f.dato, "dato")} ${ph(f.condicion, "condición")}, el contrato ${ph(f.accion, "acción")} para ${ph(f.persona, "quién")}.`;

  return (
    <div className="builder">
      <div className="builder-ex" role="group" aria-label="Ejemplos para completar">
        <span className="mono">Probá con un ejemplo</span>
        {SOLUTION_EXAMPLES.map((e) => (
          <button key={e.name} type="button" className="chip chip--toggle" onClick={() => setF(e)}>
            {e.name}
          </button>
        ))}
      </div>
      <div className="builder-grid">
        <label>
          Dato real
          <input value={f.dato} onChange={(e) => set("dato", e.target.value)} placeholder="API y campo que usás" />
        </label>
        <label>
          Condición
          <input value={f.condicion} onChange={(e) => set("condicion", e.target.value)} placeholder="umbral o evento" />
        </label>
        <label>
          Acción del contrato
          <input value={f.accion} onChange={(e) => set("accion", e.target.value)} placeholder="paga, registra, alerta…" />
        </label>
        <label>
          Para quién
          <input value={f.persona} onChange={(e) => set("persona", e.target.value)} placeholder="persona o grupo del NOA" />
        </label>
      </div>
      <p className="builder-out" data-ready={filled}>
        {sentence}
      </p>
      <div>
        <CopyButton text={sentence} label="Copiar frase" />
      </div>
    </div>
  );
}
