import { useEffect, useState } from "react";
import type { TemplateRecord } from "../types";

interface TemplatesPageProps {
  templates: TemplateRecord[];
  onUseTemplate: (template: TemplateRecord) => void;
}

export function TemplatesPage({ templates, onUseTemplate }: TemplatesPageProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id ?? "");
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0] ?? null;

  useEffect(() => {
    if (!templates.length) {
      setSelectedTemplateId("");
      return;
    }

    if (!templates.some((template) => template.id === selectedTemplateId)) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [selectedTemplateId, templates]);

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
        <div className="library-layout">
          <article className="panel library-list-panel">
            <div className="library-list-header">
              <div>
                <p className="eyebrow">Template Library</p>
                <h3>{templates.length} saved templates</h3>
              </div>
              <p className="library-meta">Select a template to inspect its structure and reuse it in Generate.</p>
            </div>

            <div className="library-list">
              {templates.map((template) => {
                const isActive = template.id === selectedTemplate?.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    className={`library-list-item ${isActive ? "library-list-item-active" : ""}`}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <div className="library-list-item-top">
                      <strong>{template.name}</strong>
                      <span className={`template-chip template-chip-${template.type}`}>{template.type}</span>
                    </div>
                    <small>{template.store} · {template.category}</small>
                    <span className="library-meta">Last used {template.lastUsed}</span>
                  </button>
                );
              })}
            </div>
          </article>

          {selectedTemplate ? (
            <article className="panel library-detail-panel">
              <div className="library-card-header">
                <span className={`template-chip template-chip-${selectedTemplate.type}`}>{selectedTemplate.type}</span>
                <span className="library-meta">Last used {selectedTemplate.lastUsed}</span>
              </div>
              <h3>{selectedTemplate.name}</h3>
              <p className="library-meta">{selectedTemplate.store} · {selectedTemplate.category}</p>

              <div className="library-detail-section">
                <strong>Title structure</strong>
                <p>{selectedTemplate.titleTemplate}</p>
              </div>

              <div className="library-detail-section">
                <strong>Copy pattern</strong>
                <p className="library-copy">{selectedTemplate.copyTemplate}</p>
              </div>

              <div className="tag-row">
                {selectedTemplate.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>

              <div className="button-row">
                <button type="button" className="button button-primary" onClick={() => onUseTemplate(selectedTemplate)}>
                  Use Template
                </button>
              </div>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
