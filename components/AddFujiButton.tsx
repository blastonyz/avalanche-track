"use client";

import { useState } from "react";
import { FUJI } from "@/lib/links";

type Eth = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type State =
  | { s: "idle" }
  | { s: "working" }
  | { s: "ok" }
  | { s: "no-wallet" }
  | { s: "rejected" }
  | { s: "error"; msg: string };

export default function AddFujiButton() {
  const [st, setSt] = useState<State>({ s: "idle" });

  async function add() {
    const eth = (window as unknown as { ethereum?: Eth }).ethereum;
    if (!eth) {
      setSt({ s: "no-wallet" });
      return;
    }
    setSt({ s: "working" });
    try {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: FUJI.chainIdHex,
            chainName: FUJI.name,
            nativeCurrency: { name: "Avalanche", symbol: FUJI.symbol, decimals: 18 },
            rpcUrls: [FUJI.rpc],
            blockExplorerUrls: [FUJI.explorer],
          },
        ],
      });
      setSt({ s: "ok" });
    } catch (e) {
      const err = e as { code?: number; message?: string };
      if (err.code === 4001) setSt({ s: "rejected" });
      else setSt({ s: "error", msg: err.message ?? "Error desconocido de la wallet." });
    }
  }

  return (
    <div className="wallet-box">
      <h3 className="h-sub">Agregá Fuji a tu wallet</h3>
      <p>
        Te pide confirmar en tu wallet. No firma ninguna transacción ni mueve fondos: solo agrega
        la red {FUJI.name}.
      </p>
      <div>
        <button className="btn" onClick={add} disabled={st.s === "working"}>
          {st.s === "working" ? "Esperando tu wallet…" : "Agregar Fuji"}
        </button>
      </div>
      <div aria-live="polite">
        {st.s === "ok" && (
          <p className="wallet-status ok">Fuji agregada. Ya podés cambiar a esa red desde la wallet.</p>
        )}
        {st.s === "no-wallet" && (
          <p className="wallet-status err">
            No encontramos una wallet en este navegador. Instalá{" "}
            <a href="https://core.app" target="_blank" rel="noopener noreferrer">
              Core
            </a>{" "}
            y recargá la página, o cargá los datos de la tabla a mano.
          </p>
        )}
        {st.s === "rejected" && (
          <p className="wallet-status err">Rechazaste el pedido en la wallet. Podés intentarlo de nuevo.</p>
        )}
        {st.s === "error" && <p className="wallet-status err">La wallet respondió: {st.msg}</p>}
      </div>
    </div>
  );
}
