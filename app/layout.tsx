import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Countdown from "@/components/Countdown";
import Navbar from "@/components/Navbar";
import ChatFab from "@/components/ChatFab";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Track Blockchain Avalanche | Argentina Space Hackathon",
  description:
    "Reglas, categorías, APIs, guía paso a paso y recursos de Avalanche para el track blockchain del hackathon de Argentina Space, Salta, 2026.",
};

export const viewport: Viewport = {
  themeColor: "#1f1f1f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        <div className="gridlines" aria-hidden="true">
          <i />
        </div>
        <header className="site-header">
          <Countdown />
          <Navbar />
        </header>
        <main id="contenido">{children}</main>
        <Footer />
        <ChatFab />
      </body>
    </html>
  );
}
