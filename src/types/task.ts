export type ProductTaskStatus = "pending" | "processing" | "completed" | "failed";

export interface ProductTaskInput {
  category: string;
  features: string[];
  originalImage: string;
}

export interface ProductTaskOutput {
  generatedTitle: string;
  generatedCopy: string;
  generatedPosterImage: string;
}

export interface ProductTaskRecord {
  id: string;
  name: string;
  status: ProductTaskStatus;
  input: ProductTaskInput;
  output: ProductTaskOutput;
  createdAt: string;
}
