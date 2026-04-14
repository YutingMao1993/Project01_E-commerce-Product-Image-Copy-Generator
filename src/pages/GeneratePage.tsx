import type { ChangeEvent } from "react";
import { FormPanel } from "../components/FormPanel";
import type { AssetLibraryItem, ProductDraftRecord, ProductFormErrors, ProductInput, TemplateRecord } from "../types";

interface GeneratePageProps {
  products: ProductDraftRecord[];
  selectedProductId: string;
  values: ProductInput;
  errors: ProductFormErrors;
  uploadedImageCount: number;
  saveToAssetLibrary: boolean;
  selectedTemplate: TemplateRecord | null;
  selectedAsset: AssetLibraryItem | null;
  isLoading: boolean;
  onFieldChange: <K extends keyof ProductInput>(field: K, value: ProductInput[K]) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onSelectProduct: (id: string) => void;
  onAddProduct: () => void;
  onMockImport: () => void;
  onRemoveProduct: (id: string) => void;
  onToggleSaveToAssetLibrary: (nextValue: boolean) => void;
  onClearSelectedTemplate: () => void;
  onClearSelectedAsset: () => void;
  onGenerate: () => void;
  onReset: () => void;
}

export function GeneratePage({
  products,
  selectedProductId,
  values,
  errors,
  uploadedImageCount,
  saveToAssetLibrary,
  selectedTemplate,
  selectedAsset,
  isLoading,
  onFieldChange,
  onImageUpload,
  onRemoveImage,
  onSelectProduct,
  onAddProduct,
  onMockImport,
  onRemoveProduct,
  onToggleSaveToAssetLibrary,
  onClearSelectedTemplate,
  onClearSelectedAsset,
  onGenerate,
  onReset,
}: GeneratePageProps) {
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];

  return (
    <div className="page-grid page-grid-generate">
      <section className="page-side-column">
        <article className="panel info-panel">
          <div className="batch-toolbar">
            <div>
              <p className="eyebrow">Batch</p>
              <h3>Products</h3>
            </div>
            <div className="button-row button-row-compact">
              <button type="button" className="button button-secondary" onClick={onMockImport}>
                Mock Excel Import
              </button>
              <button type="button" className="button button-primary" onClick={onAddProduct}>
                Add Product
              </button>
            </div>
          </div>

          <div className="batch-summary">
            <span>{products.length} product{products.length === 1 ? "" : "s"} in batch</span>
            <span>{products.filter((product) => product.uploadedImages.length > 0).length} with images</span>
          </div>

          <div className="batch-list">
            {products.map((product, index) => {
              const isActive = product.id === selectedProductId;
              return (
                <article
                  key={product.id}
                  className={`batch-card ${isActive ? "batch-card-active" : ""}`}
                >
                  <button type="button" className="batch-card-main" onClick={() => onSelectProduct(product.id)}>
                    <span className="batch-card-index">#{index + 1}</span>
                    <strong>{product.values.productName || `Untitled Product ${index + 1}`}</strong>
                    <small>
                      {product.values.category || "No category"} · {product.uploadedImages.length} image{product.uploadedImages.length === 1 ? "" : "s"}
                    </small>
                  </button>
                  <div className="batch-card-actions">
                    <span className="batch-card-source">{product.source === "excel" ? "Excel" : "Manual"}</span>
                    {products.length > 1 ? (
                      <button type="button" className="text-button" onClick={() => onRemoveProduct(product.id)}>
                        Remove
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </section>

      <FormPanel
        productLabel={selectedProduct?.values.productName || "Selected Product"}
        productSourceLabel={selectedProduct?.source === "excel" ? "Imported from Excel" : "Manual entry"}
        values={values}
        errors={errors}
        uploadedImages={selectedProduct?.uploadedImages ?? []}
        saveToAssetLibrary={saveToAssetLibrary}
        isLoading={isLoading}
        onFieldChange={onFieldChange}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        onToggleSaveToAssetLibrary={onToggleSaveToAssetLibrary}
        onGenerate={onGenerate}
        onReset={onReset}
      />

      <section className="page-side-column">
        {selectedTemplate ? (
          <article className="panel info-panel">
            <p className="eyebrow">Active Template</p>
            <h3>{selectedTemplate.name}</h3>
            <p className="library-meta">{selectedTemplate.store} · {selectedTemplate.category}</p>
            <p>{selectedTemplate.copyTemplate}</p>
            <div className="button-row">
              <button type="button" className="button button-secondary" onClick={onClearSelectedTemplate}>
                Clear Template
              </button>
            </div>
          </article>
        ) : null}

        {selectedAsset ? (
          <article className="panel info-panel">
            <p className="eyebrow">Active Asset</p>
            <h3>{selectedAsset.productName}</h3>
            <p className="library-meta">{selectedAsset.brand} · {selectedAsset.category}</p>
            <div className="tag-row">
              {selectedAsset.references.map((reference) => (
                <span key={reference} className="tag-pill">{reference}</span>
              ))}
            </div>
            <div className="button-row">
              <button type="button" className="button button-secondary" onClick={onClearSelectedAsset}>
                Clear Asset
              </button>
            </div>
          </article>
        ) : null}

        <article className="panel info-panel">
          <p className="eyebrow">MVP Flow</p>
          <h3>Batch-Oriented Generate Step</h3>
          <ul className="info-list">
            <li>Switch between products in the same batch</li>
            <li>Use mocked Excel import to preload rows</li>
            <li>Edit one selected product at a time</li>
            <li>Generate results from the currently selected product</li>
          </ul>
        </article>

        <article className="panel info-panel">
          <p className="eyebrow">Selected Product</p>
          <h3>Editor Status</h3>
          <ul className="info-list">
            <li>{values.productName ? `Name: ${values.productName}` : "No product name yet"}</li>
            <li>{values.category ? `Category: ${values.category}` : "Category not set"}</li>
            <li>{uploadedImageCount > 0 ? `${uploadedImageCount} uploaded image(s)` : "No uploaded images yet"}</li>
            <li>{saveToAssetLibrary ? "Will save to asset library" : "Not saving to asset library"}</li>
            <li>{selectedTemplate ? `Template applied: ${selectedTemplate.name}` : "Using default generation logic"}</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
