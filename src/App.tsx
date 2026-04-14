import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { AppShell } from "./app/AppShell";
import { Toast } from "./components/Toast";
import { mockAssets } from "./data/mockAssets";
import { generateMockResults } from "./data/mockGenerator";
import { mockImportedProducts } from "./data/mockImportedProducts";
import { mockTemplates } from "./data/mockTemplates";
import { AssetsPage } from "./pages/AssetsPage";
import { GeneratePage } from "./pages/GeneratePage";
import { ResultsPage } from "./pages/ResultsPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import type {
  AssetLibraryItem,
  AppView,
  ProductDraftRecord,
  DraftVariation,
  GenerationStatus,
  ProductDraftResult,
  ProductFormErrors,
  ProductInput,
  TemplateRecord,
  ToastState,
  UploadedImage,
} from "./types";

const initialValues: ProductInput = {
  productName: "",
  category: "",
  price: "",
  brand: "",
  sellingPoints: "",
  description: "",
  targetAudience: "",
  copyStyle: "Professional",
  imageStyle: "Clean white",
};

function createEmptyProduct(source: ProductDraftRecord["source"] = "manual"): ProductDraftRecord {
  return {
    id: crypto.randomUUID(),
    values: { ...initialValues },
    uploadedImages: [],
    saveToAssetLibrary: false,
    source,
  };
}

function validateForm(values: ProductInput, uploadedImages: UploadedImage[]): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.productName.trim()) {
    errors.productName = "Product name is required.";
  }

  if (!values.sellingPoints.trim() && !values.description.trim()) {
    errors.content = "Add at least one selling point or a description.";
  }

  if (uploadedImages.length === 0) {
    errors.images = "Upload at least one image.";
  }

  return errors;
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("generate");
  const [products, setProducts] = useState<ProductDraftRecord[]>(() => [createEmptyProduct()]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [status, setStatus] = useState<GenerationStatus>("empty");
  const [draftResults, setDraftResults] = useState<Record<string, ProductDraftResult>>({});
  const [selectedResultProductId, setSelectedResultProductId] = useState<string>("");
  const [templates, setTemplates] = useState<TemplateRecord[]>(mockTemplates);
  const [assetLibrary, setAssetLibrary] = useState(mockAssets);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("Something went wrong while generating your results.");
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const productsRef = useRef<ProductDraftRecord[]>([]);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const selectedValues = selectedProduct?.values ?? initialValues;
  const selectedUploadedImages = selectedProduct?.uploadedImages ?? [];
  const selectedSaveToAssetLibrary = selectedProduct?.saveToAssetLibrary ?? false;
  const resultProductId = selectedResultProductId || selectedProductId;
  const selectedDraftResult = resultProductId ? draftResults[resultProductId] : undefined;
  const selectedTemplate = selectedTemplateId ? templates.find((template) => template.id === selectedTemplateId) ?? null : null;
  const selectedAsset = selectedAssetId ? assetLibrary.find((asset) => asset.id === selectedAssetId) ?? null : null;

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    if (!selectedProduct && products[0]) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!selectedResultProductId && selectedProductId) {
      setSelectedResultProductId(selectedProductId);
    }
  }, [selectedProductId, selectedResultProductId]);

  useEffect(() => {
    return () => {
      productsRef.current.forEach((product) => {
        product.uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      });
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ id: Date.now(), message });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2400);
  };

  const handleFieldChange = <K extends keyof ProductInput>(field: K, value: ProductInput[K]) => {
    if (!selectedProduct) return;

    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, values: { ...product.values, [field]: value } }
          : product,
      ),
    );
    setErrors((current) => ({
      ...current,
      productName: field === "productName" ? undefined : current.productName,
      content: field === "sellingPoints" || field === "description" ? undefined : current.content,
    }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;

    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== selectedProduct.id) return product;

        const remainingSlots = Math.max(0, 3 - product.uploadedImages.length);
        const nextImages = files.slice(0, remainingSlots).map((file) => ({
          id: `${file.name}-${crypto.randomUUID()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        return {
          ...product,
          uploadedImages: [...product.uploadedImages, ...nextImages],
        };
      }),
    );

    setErrors((current) => ({ ...current, images: undefined }));
    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    if (!selectedProduct) return;

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== selectedProduct.id) return product;
        const target = product.uploadedImages.find((image) => image.id === id);
        if (target) {
          URL.revokeObjectURL(target.previewUrl);
        }
        return {
          ...product,
          uploadedImages: product.uploadedImages.filter((image) => image.id !== id),
        };
      }),
    );
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setSelectedResultProductId(id);
    setErrors({});
  };

  const handleAddProduct = () => {
    const nextProduct = createEmptyProduct("manual");
    setProducts((current) => [...current, nextProduct]);
    setSelectedProductId(nextProduct.id);
    setSelectedResultProductId(nextProduct.id);
    setErrors({});
  };

  const handleMockImport = () => {
    productsRef.current.forEach((product) => {
      product.uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    });

    const importedBatch = mockImportedProducts.map((product) => ({
      ...product,
      id: `${product.id}-${crypto.randomUUID()}`,
      values: { ...product.values },
      uploadedImages: [],
    }));
    setProducts(importedBatch);
    setSelectedProductId(importedBatch[0]?.id ?? "");
    setSelectedResultProductId(importedBatch[0]?.id ?? "");
    setErrors({});
    showToast("Mock Excel batch loaded.");
  };

  const handleRemoveProduct = (id: string) => {
    setDraftResults((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    setProducts((current) => {
      const nextProducts = current.filter((product) => product.id !== id);
      const removedProduct = current.find((product) => product.id === id);
      removedProduct?.uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      if (selectedProductId === id && nextProducts[0]) {
        setSelectedProductId(nextProducts[0].id);
        setSelectedResultProductId(nextProducts[0].id);
      }
      if (nextProducts.length > 0) {
        return nextProducts;
      }
      const replacement = createEmptyProduct("manual");
      setSelectedProductId(replacement.id);
      setSelectedResultProductId(replacement.id);
      return [replacement];
    });
    setErrors({});
  };

  const handleToggleSaveToAssetLibrary = (nextValue: boolean) => {
    if (!selectedProduct) return;
    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id ? { ...product, saveToAssetLibrary: nextValue } : product,
      ),
    );
  };

  const handleUseTemplate = (template: TemplateRecord) => {
    setSelectedTemplateId(template.id);
    setCurrentView("generate");
    showToast(`Using template: ${template.name}`);
  };

  const handleUseAsset = (asset: AssetLibraryItem) => {
    if (!selectedProduct) return;

    setSelectedAssetId(asset.id);
    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              values: {
                ...product.values,
                productName: asset.productName,
                category: asset.category,
                brand: asset.brand,
              },
            }
          : product,
      ),
    );
    setCurrentView("generate");
    showToast(`Using asset: ${asset.productName}`);
  };

  const runGeneration = async () => {
    if (!selectedProduct) return;

    const nextErrors = validateForm(selectedValues, selectedUploadedImages);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("empty");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const generatedWithContext = await generateMockResults(selectedValues, selectedUploadedImages, {
        template: selectedTemplate,
        asset: selectedAsset,
      });
      const nextResult: ProductDraftResult = {
        productId: selectedProduct.id,
        productName: selectedValues.productName || "Untitled Product",
        status: "success",
        errorMessage: "",
        variations: generatedWithContext,
        activeVariationId: generatedWithContext[0]?.id ?? null,
        updatedAt: new Date().toISOString(),
      };
      setDraftResults((current) => ({ ...current, [selectedProduct.id]: nextResult }));

      if (selectedSaveToAssetLibrary) {
        const fallbackImageUrl =
          generatedWithContext[0]?.imageUrl ||
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80";

        setAssetLibrary((current) => {
          const nextAsset = {
            id: crypto.randomUUID(),
            productName: selectedValues.productName || "Untitled Product",
            category: selectedValues.category || "General",
            brand: selectedValues.brand || "Unbranded",
            store: selectedProduct.source === "excel" ? "Imported Batch" : "Manual Draft Flow",
            imageUrl: fallbackImageUrl,
            savedAt: new Date().toISOString().slice(0, 10),
            references: [
              ...(selectedValues.material ? [selectedValues.material] : []),
              ...(selectedValues.color ? [selectedValues.color] : []),
              ...(selectedTemplate ? [selectedTemplate.name] : []),
              ...(selectedValues.sellingPoints
                .split(/\n|,/)
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 2)),
            ],
          };

          const deduped = current.filter(
            (asset) =>
              !(
                asset.productName === nextAsset.productName &&
                asset.brand === nextAsset.brand &&
                asset.category === nextAsset.category
              ),
          );

          return [nextAsset, ...deduped];
        });
      }

      setSelectedResultProductId(selectedProduct.id);
      setStatus("success");
      setCurrentView("results");
    } catch (error) {
      const nextResult: ProductDraftResult = {
        productId: selectedProduct.id,
        productName: selectedValues.productName || "Untitled Product",
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Mock generation failed.",
        variations: [],
        activeVariationId: null,
        updatedAt: new Date().toISOString(),
      };
      setDraftResults((current) => ({ ...current, [selectedProduct.id]: nextResult }));
      setSelectedResultProductId(selectedProduct.id);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Mock generation failed.");
    }
  };

  const handleReset = () => {
    if (!selectedProduct) return;

    selectedUploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, values: { ...initialValues }, uploadedImages: [], saveToAssetLibrary: false }
          : product,
      ),
    );
    setDraftResults((current) => {
      const next = { ...current };
      delete next[selectedProduct.id];
      return next;
    });
    setErrors({});
    setErrorMessage("Something went wrong while generating your results.");
    setStatus("empty");
    setToast(null);
  };

  const handleSelectResultProduct = (productId: string) => {
    setSelectedResultProductId(productId);
  };

  const handleSelectVariation = (
    productId: string,
    variationId: string,
  ) => {
    setDraftResults((current) => {
      const result = current[productId];
      if (!result) return current;
      return {
        ...current,
        [productId]: {
          ...result,
          activeVariationId: variationId,
        },
      };
    });
  };

  const handleEditVariation = (
    productId: string,
    id: string,
    field: keyof Pick<DraftVariation, "title" | "tagline" | "description">,
    value: string,
  ) => {
    setDraftResults((current) => {
      const result = current[productId];
      if (!result) return current;
      return {
        ...current,
        [productId]: {
          ...result,
          variations: result.variations.map((variation) =>
            variation.id === id ? { ...variation, [field]: value } : variation,
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const handleCopyText = async (variation: DraftVariation) => {
    const payload = `${variation.title}\n${variation.tagline}\n\n${variation.description}`;
    try {
      await navigator.clipboard.writeText(payload);
      showToast("Copy saved to clipboard.");
    } catch {
      showToast("Clipboard access unavailable in this browser.");
    }
  };

  const handleSaveTemplate = (variation: DraftVariation) => {
    if (!selectedProduct) return;

    const nextTemplate: TemplateRecord = {
      id: crypto.randomUUID(),
      name: `${selectedValues.productName || "Untitled Product"} Template`,
      type: "full",
      store: selectedSaveToAssetLibrary ? "Saved Asset Flow" : "Manual Draft Flow",
      category: selectedValues.category || "General",
      tags: [
        selectedValues.category || "general",
        selectedValues.copyStyle.toLowerCase(),
        selectedValues.imageStyle.toLowerCase(),
      ],
      titleTemplate: variation.title,
      copyTemplate: `${variation.tagline} ${variation.description}`.trim(),
      imageStyleLabel: selectedValues.imageStyle,
      lastUsed: new Date().toISOString().slice(0, 10),
    };

    setTemplates((current) => [nextTemplate, ...current]);
    setCurrentView("templates");
    showToast("Template saved to library.");
  };

  const handleDownloadImage = (variation: DraftVariation) => {
    const link = document.createElement("a");
    link.href = variation.imageUrl;
    link.download = `${variation.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "generated-image"}.png`;
    link.click();
    showToast("Mock image download started.");
  };

  return (
    <>
      <AppShell currentView={currentView} onNavigate={setCurrentView}>
        {currentView === "generate" ? (
          <GeneratePage
            products={products}
            selectedProductId={selectedProductId}
            values={selectedValues}
            errors={errors}
            uploadedImageCount={selectedUploadedImages.length}
            saveToAssetLibrary={selectedSaveToAssetLibrary}
            selectedTemplate={selectedTemplate}
            selectedAsset={selectedAsset}
            isLoading={status === "loading"}
            onFieldChange={handleFieldChange}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            onSelectProduct={handleSelectProduct}
            onAddProduct={handleAddProduct}
            onMockImport={handleMockImport}
            onRemoveProduct={handleRemoveProduct}
            onToggleSaveToAssetLibrary={handleToggleSaveToAssetLibrary}
            onClearSelectedTemplate={() => setSelectedTemplateId(null)}
            onClearSelectedAsset={() => setSelectedAssetId(null)}
            onGenerate={runGeneration}
            onReset={handleReset}
          />
        ) : null}

        {currentView === "results" ? (
          <ResultsPage
            status={status}
            products={products}
            draftResults={draftResults}
            selectedProductId={resultProductId}
            errorMessage={selectedDraftResult?.errorMessage ?? errorMessage}
            onSelectProduct={handleSelectResultProduct}
            onSelectVariation={handleSelectVariation}
            onEditVariation={handleEditVariation}
            onSaveTemplate={handleSaveTemplate}
            onCopyText={handleCopyText}
            onRegenerate={runGeneration}
            onDownloadImage={handleDownloadImage}
            onRetry={runGeneration}
          />
        ) : null}

        {currentView === "templates" ? <TemplatesPage templates={templates} onUseTemplate={handleUseTemplate} /> : null}

        {currentView === "assets" ? <AssetsPage assets={assetLibrary} onUseAsset={handleUseAsset} /> : null}
      </AppShell>

      <Toast toast={toast} />
    </>
  );
}
