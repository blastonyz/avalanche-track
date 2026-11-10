import { AI_TOOLS } from "@/lib/links";
import ToolLogo from "./ToolLogo";

export default function ToolGrid() {
  return (
    <div className="ai-grid">
      {AI_TOOLS.map((t) => (
        <a key={t.name} className="ai-tile" href={t.url} target="_blank" rel="noopener noreferrer">
          <ToolLogo tool={t} />
          <strong>{t.name}</strong>
          <span>{t.note}</span>
        </a>
      ))}
    </div>
  );
}
