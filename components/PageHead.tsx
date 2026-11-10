export default function PageHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="shell page-head">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      <div className="blocks" aria-hidden="true">
        <i style={{ width: "12%", background: "var(--red)" }} />
        <i style={{ width: "8%", background: "var(--gray)" }} />
        <i style={{ width: "5%", background: "var(--red-deep)" }} />
        <i style={{ width: "2%", background: "var(--orange)" }} />
      </div>
    </header>
  );
}
