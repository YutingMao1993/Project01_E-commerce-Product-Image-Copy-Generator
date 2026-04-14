import type { TemplateRecord } from "../types";

interface TemplatesPageProps {
  templates: TemplateRecord[];
  onUseTemplate: (template: TemplateRecord) => void;
}

export function TemplatesPage({ templates, onUseTemplate }: TemplatesPageProps) {
  return (
    <section className="page-stack">
      <div className="page-intro">
        <p className="eyebrow">Library</p>
        <h3>Reusable Template Patterns</h3>
        <p className="panel-intro">Saved templates from reviewed outputs plus seeded examples that operators can reuse for future product batches.</p>
      </div>

      {templates.length === 0 ? (
        <article className="panel state-card">
          <div className="state-graphic state-graphic-empty" />
          <h3>No templates saved yet</h3>
          <p>Review a generated result and save it as a template to start building your reusable operator library.</p>
        </article>
      ) : (
        <div className="card-grid">
          {templates.map((template) => (
            <article key={template.id} className="panel library-card">
              <div className="library-card-header">
                <span className={`template-chip template-chip-${template.type}`}>{template.type}</span>
                <span className="library-meta">{template.lastUsed}</span>
              </div>
              <h4>{template.name}</h4>
              <p className="library-meta">{template.store} · {template.category}</p>
              <p>{template.titleTemplate}</p>
              <p className="library-copy">{template.copyTemplate}</p>
              <div className="tag-row">
                {template.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
              <div className="button-row">
                <button type="button" className="button button-secondary" onClick={() => onUseTemplate(template)}>
                  Use Template
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
