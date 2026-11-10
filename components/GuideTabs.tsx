"use client";

import { useEffect, useState, type ReactNode } from "react";

const TABS = [
  { id: "general", label: "General" },
  { id: "pasos", label: "Paso a paso" },
] as const;

export default function GuideTabs({ general, steps }: { general: ReactNode; steps: ReactNode }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("general");

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "pasos") setTab("pasos");
      else if (h === "general") setTab("general");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const pick = (id: (typeof TABS)[number]["id"]) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Secciones de la guía">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => pick(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="panel-general" aria-labelledby="tab-general" hidden={tab !== "general"}>
        {general}
      </div>
      <div role="tabpanel" id="panel-pasos" aria-labelledby="tab-pasos" hidden={tab !== "pasos"}>
        {steps}
      </div>
    </>
  );
}
