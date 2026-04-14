export interface DraftVariation {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  tagline: string;
  description: string;
}

export type GenerationStatus = "empty" | "loading" | "success" | "error";

export interface BatchGenerationTask {
  id: string;
  productCount: number;
  status: GenerationStatus;
  startedAt: string;
}

export interface ProductDraftResult {
  productId: string;
  productName: string;
  status: GenerationStatus;
  errorMessage: string;
  variations: DraftVariation[];
  activeVariationId: string | null;
  updatedAt: string;
}
