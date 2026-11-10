import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getUser, roleOf } from "@/lib/auth";

export const metadata: Metadata = { title: "Panel | Track Blockchain Avalanche" };
export const dynamic = "force-dynamic";

/**
 * Rutas paralelas: cada rol ve su propio slot en la misma URL (/panel).
 * @builder = equipo + entrega · @admin = listas con paginación.
 * Cada slot además vuelve a chequear el rol: el layout no es la única barrera.
 */
export default async function PanelLayout({
  builder,
  admin,
}: {
  builder: ReactNode;
  admin: ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/?auth=login");
  const role = roleOf(user);
  if (!role) redirect("/?auth=login");
  return <>{role === "admin" ? admin : builder}</>;
}
