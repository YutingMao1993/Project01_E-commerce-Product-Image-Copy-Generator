export type CopyStyle = "Simple" | "Professional" | "Playful" | "Promotional";
export type ImageStyle = "Clean white" | "Promo style" | "Lifestyle";

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface FormValues {
  productName: string;
  category: string;
  price: string;
  brand: string;
  sellingPoints: string;
  description: string;
  targetAudience: string;
  copyStyle: CopyStyle;
  imageStyle: ImageStyle;
}

export interface FormErrors {
  productName?: string;
  content?: string;
  images?: string;
}

export interface GeneratedVariation {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  tagline: string;
  description: string;
}

export type GenerationStatus = "empty" | "loading" | "success" | "error";

export interface ToastState {
  id: number;
  message: string;
}
