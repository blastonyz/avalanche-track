"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AI_TOOLS, REFERRAL_URL } from "@/lib/links";
import AuthButton from "./AuthButton";
import ConnectWallet from "./ConnectWallet";
import ToolLogo from "./ToolLogo";

const LINKS = [{ href: "/guia", label: "Guía" }];

export default function Navbar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [tools, setTools] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenu(false);
    setTools(false);
  }, [pathname]);

  useEffect(() => {
    if (!tools) return;
    const onDown = (e: MouseEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setTools(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTools(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [tools]);

  return (
    <nav className="nav" aria-label="Principal">
      <div className="shell">
        <Link href="/" className="brand" aria-label="argentinaspace Hackathon, inicio">
          <span className="brand-logos" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/avalanche-ko.png" alt="" width={104} height={15} />
            <i />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/team1-white.png" alt="" width={90} height={12} />
          </span>
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={menu}
          aria-controls="nav-links"
          onClick={() => setMenu((v) => !v)}
        >
          {menu ? "Cerrar" : "Menú"}
        </button>

        <div className="nav-links" id="nav-links" data-open={menu}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <div className="nav-tools" ref={toolsRef}>
            <button
              className="nav-btn"
              aria-expanded={tools}
              aria-haspopup="true"
              onClick={() => setTools((v) => !v)}
            >
              Herramientas IA ▾
            </button>
            {tools && (
              <div className="tools-panel">
                {AI_TOOLS.map((t) => (
                  <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer">
                    <ToolLogo tool={t} />
                    <strong>{t.name}</strong>
                    <span>{t.note}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a
            className="nav-cta"
            href={REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Builder Hub ↗
          </a>
          <ConnectWallet />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
