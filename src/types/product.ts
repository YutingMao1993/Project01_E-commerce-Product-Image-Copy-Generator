export type CopyStyle = "Simple" | "Professional" | "Playful" | "Promotional";
export type ImageStyle = "Clean white" | "Promo style" | "Lifestyle";

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ProductInput {
  productName: string;
  category: string;
  price: string;
  brand: string;
  material?: string;
  size?: string;
  color?: string;
  targetAudience: string;
  sellingPoints: string;
  description: string;
  copyStyle: CopyStyle;
  imageStyle: ImageStyle;
}

export type ProductSource = "manual" | "excel";

export interface ProductDraftRecord {
  id: string;
  values: ProductInput;
  uploadedImages: UploadedImage[];
  saveToAssetLibrary: boolean;
  source: ProductSource;
}

export interface ProductFormErrors {
  productName?: string;
  content?: string;
  images?: string;
}
