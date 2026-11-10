import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import ProfileForm from "@/components/ProfileForm";

export const metadata: Metadata = {
  title: "Perfil | Track Blockchain Avalanche",
};

export default function Perfil() {
  return (
    <>
      <PageHead
        eyebrow="Perfil"
        title="Tu perfil"
        lead="Equipo, rol y categoría en un solo lugar. Sirve para repartir tareas y armar la entrega."
      />
      <div className="shell section--tight">
        <ProfileForm />
      </div>
    </>
  );
}
