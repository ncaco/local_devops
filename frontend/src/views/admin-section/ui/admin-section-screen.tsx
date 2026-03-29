export function AdminSectionScreen({
  label,
  title,
  description,
  items,
}: {
  label: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="stack">
      <section className="page-panel">
        <p className="section-label">{label}</p>
        <h3>{title}</h3>
        <p className="body-copy">{description}</p>
      </section>

      <section className="page-panel">
        <ul className="settings-list plain-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
