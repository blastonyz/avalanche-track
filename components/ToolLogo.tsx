import type { AiTool } from "@/lib/links";

/** Logo monocromo (máscara CSS) o, si no hay archivo, la inicial de la herramienta. */
export default function ToolLogo({ tool }: { tool: AiTool }) {
  if (tool.icon) {
    return (
      <span
        className="tool-logo"
        aria-hidden="true"
        style={{ ["--logo" as string]: `url(/tools/${tool.icon})` }}
      />
    );
  }
  return (
    <span className="tool-logo tool-logo--letter" aria-hidden="true">
      {tool.name[0]}
    </span>
  );
}
