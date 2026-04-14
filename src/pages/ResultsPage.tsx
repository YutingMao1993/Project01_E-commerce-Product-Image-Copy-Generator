import { ResultsPanel } from "../components/ResultsPanel";
import type { DraftVariation, GenerationStatus, ProductDraftRecord, ProductDraftResult } from "../types";

interface ResultsPageProps {
  status: GenerationStatus;
  products: ProductDraftRecord[];
  draftResults: Record<string, ProductDraftResult>;
  selectedProductId: string;
  errorMessage: string;
  onSelectProduct: (productId: string) => void;
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

export function ResultsPage({
  status,
  products,
  draftResults,
  selectedProductId,
  errorMessage,
  onSelectProduct,
  onSelectVariation,
  onEditVariation,
  onSaveTemplate,
  onCopyText,
  onRegenerate,
  onDownloadImage,
  onRetry,
}: ResultsPageProps) {
  const selectedResult = selectedProductId ? draftResults[selectedProductId] : undefined;

  return (
    <div className="page-grid page-grid-results">
      <section className="page-side-column">
        <article className="panel info-panel">
          <p className="eyebrow">Review Queue</p>
          <h3>Generated Products</h3>
          <div className="batch-list">
            {products.map((product, index) => {
              const result = draftResults[product.id];
              const isActive = product.id === selectedProductId;
              const resultStatus = result?.status ?? "empty";

              return (
                <article key={product.id} className={`batch-card ${isActive ? "batch-card-active" : ""}`}>
                  <button type="button" className="batch-card-main" onClick={() => onSelectProduct(product.id)}>
                    <span className="batch-card-index">#{index + 1}</span>
                    <strong>{product.values.productName || `Untitled Product ${index + 1}`}</strong>
                    <small>{product.values.category || "No category"} · {resultStatus}</small>
                  </button>
                  <div className="batch-card-actions">
                    <span className={`result-status-badge result-status-${resultStatus}`}>{resultStatus}</span>
                    <span className="batch-card-source">{result?.variations.length ?? 0} variations</span>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <article className="panel info-panel">
          <p className="eyebrow">Selected Product</p>
          <h3>Review Summary</h3>
          <ul className="info-list">
            <li>{selectedResult ? `Status: ${selectedResult.status}` : "Status: not generated"}</li>
            <li>{selectedResult ? `${selectedResult.variations.length} variation(s)` : "No variations yet"}</li>
            <li>{selectedResult?.updatedAt ? `Updated: ${selectedResult.updatedAt.slice(0, 10)}` : "No generated output yet"}</li>
          </ul>
        </article>
      </section>

      <ResultsPanel
        status={selectedResult?.status ?? status}
        productId={selectedProductId}
        activeVariationId={selectedResult?.activeVariationId ?? null}
        variations={selectedResult?.variations ?? []}
        errorMessage={errorMessage}
        onSelectVariation={onSelectVariation}
        onEditVariation={onEditVariation}
        onSaveTemplate={onSaveTemplate}
        onCopyText={onCopyText}
        onRegenerate={onRegenerate}
        onDownloadImage={onDownloadImage}
        onRetry={onRetry}
      />
    </div>
  );
}
