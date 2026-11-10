import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import BuilderPanel from "@/components/panel/BuilderPanel";
import { getUser, roleOf } from "@/lib/auth";
import { ProjectModel } from "@/lib/models/Project";
import { serializeProject, serializeTeam } from "@/lib/serialize";
import { myTeam } from "@/lib/team";

export default async function BuilderSlot() {
  const user = await getUser();
  if (!user || roleOf(user) !== "user") notFound();

  const team = await myTeam(user);
  const project = team ? await ProjectModel.findOne({ team: team._id }) : null;

  return (
    <>
      <PageHead eyebrow="Panel" title="Tu equipo y tu entrega" lead="Un equipo por persona. Los links se guardan acá." />
      <div className="shell section--tight">
        <BuilderPanel
          team={team ? serializeTeam(team, true) : null}
          project={serializeProject(project)}
          meId={String(user._id)}
        />
      </div>
    </>
  );
}
