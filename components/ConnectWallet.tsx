"use client";

import { useEffect, useState } from "react";
import { FUJI } from "@/lib/links";
import { getEth } from "@/lib/wallet";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M3 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h12v4" />
      <rect x="15" y="12" width="6" height="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ConnectWallet() {
  const [addr, setAddr] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const eth = getEth();
    if (!eth) return;
    eth
      .request({ method: "eth_accounts" })
      .then((r) => {
        const a = (r as string[])[0];
        if (a) setAddr(a);
      })
      .catch(() => {});
    const onAcc = (accs: string[]) => setAddr(accs[0] ?? null);
    eth.on?.("accountsChanged", onAcc as never);
    return () => eth.removeListener?.("accountsChanged", onAcc as never);
  }, []);

  async function connect() {
    setMsg("");
    const eth = getEth();
    if (!eth) {
      window.open("https://core.app/", "_blank", "noopener,noreferrer");
      setMsg("Instalá Core Wallet");
      return;
    }
    try {
      const accs = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      setAddr(accs[0] ?? null);
      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: FUJI.chainIdHex }],
        });
      } catch (e) {
        if ((e as { code?: number }).code === 4902) {
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
        }
      }
    } catch (e) {
      if ((e as { code?: number }).code === 4001) setMsg("Conexión rechazada");
      else setMsg("No se pudo conectar");
    }
  }

  return (
    <button
      type="button"
      className="wallet-btn"
      data-on={addr ? "true" : "false"}
      onClick={() => (addr ? setAddr(null) : connect())}
      title={addr ? "Desconectar (solo en el sitio)" : "Conectar Core Wallet en Fuji"}
    >
      <WalletIcon />
      <span>{addr ? short(addr) : msg || "Conectar"}</span>
    </button>
  );
}
