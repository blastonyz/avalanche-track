"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "Copiar",
  small = true,
}: {
  text: string;
  label?: string;
  small?: boolean;
}) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      className={`btn btn--ghost${small ? " btn--small" : ""}`}
      onClick={copy}
      aria-live="polite"
    >
      {state === "ok" ? "Copiado" : state === "err" ? "No se pudo copiar" : label}
    </button>
  );
}
