import { ResizableTextarea } from "./ResizableTextarea";
import type { DraftVariation, GenerationStatus } from "../types";

interface ResultsPanelProps {
  status: GenerationStatus;
  productId: string;
  activeVariationId: string | null;
  variations: DraftVariation[];
  errorMessage: string;
  onSelectVariation: (productId: string, variationId: string) => void;
  onEditVariation: (
    productId: string,
    variationId: string,
    field: keyof Pick<DraftVariation, "title" | "tagline" | "description">,
    value: string,
  ) => void;
  onSaveTemplate: (variation: DraftVariation) => void;
  onCopyText: (variation: DraftVariation) => void;
  onRegenerate: () => void;
  onDownloadImage: (variation: DraftVariation) => void;
  onRetry: () => void;
}

export function ResultsPanel({
  status,
  productId,
  activeVariationId,
  variations,
  errorMessage,
  onSelectVariation,
  onEditVariation,
  onSaveTemplate,
  onCopyText,
  onRegenerate,
  onDownloadImage,
  onRetry,
}: ResultsPanelProps) {
  const activeVariation = variations.find((variation) => variation.id === activeVariationId) ?? variations[0];

  return (
    <section className="panel panel-results">
      <div className="panel-header panel-header-results">
        <div>
          <p className="eyebrow">Output</p>
          <h2>Generated Variations</h2>
        </div>
        <p className="panel-intro">Review draft combinations, switch between variations, and refine the copy directly in place.</p>
      </div>

      {status === "empty" ? (
        <div className="state-card">
          <div className="state-graphic state-graphic-empty" />
          <h3>No results yet</h3>
          <p>Complete the product input form, upload at least one image, and click generate to see draft assets here.</p>
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="state-card">
          <div className="spinner" />
          <h3>Generating draft assets</h3>
          <p>Creating product image and copy variations based on your latest inputs.</p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="state-card state-card-error">
          <div className="state-graphic state-graphic-error" />
          <h3>Generation failed</h3>
          <p>{errorMessage}</p>
          <button type="button" className="button button-primary" onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : null}

      {status === "success" && activeVariation ? (
        <div className="results-shell">
          <div className="tabs-row" role="tablist" aria-label="Variation tabs">
            {variations.map((variation, index) => {
              const isActive = variation.id === activeVariation.id;
              return (
                <button
                  key={variation.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tab-button ${isActive ? "tab-button-active" : ""}`}
                  onClick={() => onSelectVariation(productId, variation.id)}
                >
                  Variation {index + 1}
                </button>
              );
            })}
          </div>

          <article className="result-card">
            <div className="result-media">
              <img src={activeVariation.imageUrl} alt={activeVariation.imageAlt} />
            </div>

            <div className="result-content">
              <label className="field">
                <span>Title</span>
                <input
                  value={activeVariation.title}
                  onChange={(event) => onEditVariation(productId, activeVariation.id, "title", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Short Marketing Line</span>
                <input
                  value={activeVariation.tagline}
                  onChange={(event) => onEditVariation(productId, activeVariation.id, "tagline", event.target.value)}
                />
              </label>

              <label className="field">
                <span>Description</span>
                <ResizableTextarea
                  rows={6}
                  value={activeVariation.description}
                  onChange={(event) => onEditVariation(productId, activeVariation.id, "description", event.target.value)}
                />
              </label>

              <div className="button-row result-actions">
                <button type="button" className="button button-primary" onClick={() => onCopyText(activeVariation)}>
                  Copy Text
                </button>
                <button type="button" className="button button-secondary" onClick={() => onSaveTemplate(activeVariation)}>
                  Save as Template
                </button>
                <button type="button" className="button button-secondary" onClick={onRegenerate}>
                  Regenerate
                </button>
                <button type="button" className="button button-secondary" onClick={() => onDownloadImage(activeVariation)}>
                  Download Image
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
