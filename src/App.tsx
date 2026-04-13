import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FormPanel } from "./components/FormPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { Toast } from "./components/Toast";
import { generateMockResults } from "./data/mockGenerator";
import type {
  FormErrors,
  FormValues,
  GeneratedVariation,
  GenerationStatus,
  ToastState,
  UploadedImage,
} from "./types";

const initialValues: FormValues = {
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

function validateForm(values: FormValues, uploadedImages: UploadedImage[]): FormErrors {
  const errors: FormErrors = {};

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
  const [values, setValues] = useState<FormValues>(initialValues);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<GenerationStatus>("empty");
  const [variations, setVariations] = useState<GeneratedVariation[]>([]);
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("Something went wrong while generating your results.");
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const uploadedImagesRef = useRef<UploadedImage[]>([]);

  useEffect(() => {
    uploadedImagesRef.current = uploadedImages;
  }, [uploadedImages]);

  useEffect(() => {
    return () => {
      uploadedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
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

  const handleFieldChange = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      productName: field === "productName" ? undefined : current.productName,
      content: field === "sellingPoints" || field === "description" ? undefined : current.content,
    }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploadedImages((current) => {
      const remainingSlots = Math.max(0, 3 - current.length);
      const nextImages = files.slice(0, remainingSlots).map((file) => ({
        id: `${file.name}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      return [...current, ...nextImages];
    });

    setErrors((current) => ({ ...current, images: undefined }));
    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((image) => image.id !== id);
    });
  };

  const runGeneration = async () => {
    const nextErrors = validateForm(values, uploadedImages);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("empty");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const generated = await generateMockResults(values, uploadedImages);
      setVariations(generated);
      setActiveVariationId(generated[0]?.id ?? null);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Mock generation failed.");
    }
  };

  const handleReset = () => {
    uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setValues(initialValues);
    setUploadedImages([]);
    setErrors({});
    setVariations([]);
    setActiveVariationId(null);
    setErrorMessage("Something went wrong while generating your results.");
    setStatus("empty");
    setToast(null);
  };

  const handleEditVariation = (
    id: string,
    field: keyof Pick<GeneratedVariation, "title" | "tagline" | "description">,
    value: string,
  ) => {
    setVariations((current) =>
      current.map((variation) => (variation.id === id ? { ...variation, [field]: value } : variation)),
    );
  };

  const handleCopyText = async (variation: GeneratedVariation) => {
    const payload = `${variation.title}\n${variation.tagline}\n\n${variation.description}`;
    try {
      await navigator.clipboard.writeText(payload);
      showToast("Copy saved to clipboard.");
    } catch {
      showToast("Clipboard access unavailable in this browser.");
    }
  };

  const handleDownloadImage = (variation: GeneratedVariation) => {
    const link = document.createElement("a");
    link.href = variation.imageUrl;
    link.download = `${variation.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "generated-image"}.png`;
    link.click();
    showToast("Mock image download started.");
  };

  return (
    <>
      <main className="app-shell">
        <FormPanel
          values={values}
          errors={errors}
          uploadedImages={uploadedImages}
          isLoading={status === "loading"}
          onFieldChange={handleFieldChange}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onGenerate={runGeneration}
          onReset={handleReset}
        />

        <ResultsPanel
          status={status}
          activeVariationId={activeVariationId}
          variations={variations}
          errorMessage={errorMessage}
          onSelectVariation={setActiveVariationId}
          onEditVariation={handleEditVariation}
          onCopyText={handleCopyText}
          onRegenerate={runGeneration}
          onDownloadImage={handleDownloadImage}
          onRetry={runGeneration}
        />
      </main>

      <Toast toast={toast} />
    </>
  );
}
