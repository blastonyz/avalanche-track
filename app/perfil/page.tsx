import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHead from "@/components/PageHead";
import ProfileForm from "@/components/ProfileForm";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Perfil | Track Blockchain Avalanche",
};
export const dynamic = "force-dynamic";

export default async function Perfil() {
  // Los admin solo usan el panel de administración, no el perfil de builder.
  if ((await getUser())?.access === "admin") redirect("/panel");
  return (
    <>
      <PageHead
        eyebrow="Perfil"
        title="Tu perfil"
        lead="Rol, habilidades, GitHub y wallet. Sirve para repartir tareas y armar la entrega."
      />
      <div className="shell section--tight">
        <ProfileForm />
      </div>
    </>
  );
}
