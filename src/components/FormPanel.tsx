import type { ChangeEvent } from "react";
import { ResizableTextarea } from "./ResizableTextarea";
import type { CopyStyle, ImageStyle, ProductFormErrors, ProductInput, UploadedImage } from "../types";

interface FormPanelProps {
  productLabel: string;
  productSourceLabel: string;
  values: ProductInput;
  errors: ProductFormErrors;
  uploadedImages: UploadedImage[];
  saveToAssetLibrary: boolean;
  isLoading: boolean;
  onFieldChange: <K extends keyof ProductInput>(field: K, value: ProductInput[K]) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onToggleSaveToAssetLibrary: (nextValue: boolean) => void;
  onGenerate: () => void;
  onReset: () => void;
}

const copyStyles: CopyStyle[] = ["Simple", "Professional", "Playful", "Promotional"];
const imageStyles: ImageStyle[] = ["Clean white", "Promo style", "Lifestyle"];

export function FormPanel({
  productLabel,
  productSourceLabel,
  values,
  errors,
  uploadedImages,
  saveToAssetLibrary,
  isLoading,
  onFieldChange,
  onImageUpload,
  onRemoveImage,
  onToggleSaveToAssetLibrary,
  onGenerate,
  onReset,
}: FormPanelProps) {
  return (
    <section className="panel panel-form">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Input</p>
          <h1>{productLabel}</h1>
        </div>
        <p className="panel-intro">
          Edit the selected product from your batch, upload product assets, and generate draft marketing outputs for review.
        </p>
        <div className="inline-meta-row">
          <span className="tag-pill">{productSourceLabel}</span>
          <span className="tag-pill">{uploadedImages.length} image{uploadedImages.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      <div className="form-grid">
        <label className="field field-full">
          <span>Product Name</span>
          <input
            value={values.productName}
            onChange={(event) => onFieldChange("productName", event.target.value)}
            placeholder="Portable Blender Pro"
          />
          {errors.productName ? <em className="field-error">{errors.productName}</em> : null}
        </label>

        <label className="field">
          <span>Category</span>
          <input value={values.category} onChange={(event) => onFieldChange("category", event.target.value)} placeholder="Kitchen Appliances" />
        </label>

        <label className="field">
          <span>Price</span>
          <input value={values.price} onChange={(event) => onFieldChange("price", event.target.value)} placeholder="79" />
        </label>

        <label className="field">
          <span>Brand</span>
          <input value={values.brand} onChange={(event) => onFieldChange("brand", event.target.value)} placeholder="Northline" />
        </label>

        <label className="field">
          <span>Material</span>
          <input value={values.material ?? ""} onChange={(event) => onFieldChange("material", event.target.value)} placeholder="Water-resistant nylon" />
        </label>

        <label className="field">
          <span>Size</span>
          <input value={values.size ?? ""} onChange={(event) => onFieldChange("size", event.target.value)} placeholder="28cm x 18cm" />
        </label>

        <label className="field">
          <span>Color</span>
          <input value={values.color ?? ""} onChange={(event) => onFieldChange("color", event.target.value)} placeholder="Black" />
        </label>

        <label className="field">
          <span>Target Audience</span>
          <input
            value={values.targetAudience}
            onChange={(event) => onFieldChange("targetAudience", event.target.value)}
            placeholder="Busy professionals"
          />
        </label>

        <label className="field">
          <span>Copy Style</span>
          <select value={values.copyStyle} onChange={(event) => onFieldChange("copyStyle", event.target.value as CopyStyle)}>
            {copyStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Image Style</span>
          <select value={values.imageStyle} onChange={(event) => onFieldChange("imageStyle", event.target.value as ImageStyle)}>
            {imageStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-full">
          <span>Selling Points</span>
          <ResizableTextarea
            rows={4}
            value={values.sellingPoints}
            onChange={(event) => onFieldChange("sellingPoints", event.target.value)}
            placeholder="USB-C charging, 20oz capacity, easy to clean"
          />
        </label>

        <label className="field field-full">
          <span>Description</span>
          <ResizableTextarea
            rows={5}
            value={values.description}
            onChange={(event) => onFieldChange("description", event.target.value)}
            placeholder="A compact blender built for quick smoothies at home, work, or after the gym."
          />
          {errors.content ? <em className="field-error">{errors.content}</em> : null}
        </label>

        <div className="field field-full">
          <span>Image Upload</span>
          <label className="upload-box">
            <input className="upload-input" type="file" accept="image/*" multiple onChange={onImageUpload} />
            <div className="upload-content">
              <span className="upload-button">Choose Files</span>
              <div className="upload-copy">
                <strong>Upload 1-3 images</strong>
                <small>PNG, JPG, or WEBP. Uploaded previews are reused in generated variations.</small>
              </div>
            </div>
          </label>
          {errors.images ? <em className="field-error">{errors.images}</em> : null}

          {uploadedImages.length > 0 ? (
            <div className="thumbnail-row">
              {uploadedImages.map((image) => (
                <div key={image.id} className="thumbnail-card">
                  <img src={image.previewUrl} alt={image.file.name} />
                  <button type="button" onClick={() => onRemoveImage(image.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <label className="field field-full checkbox-field">
          <input
            type="checkbox"
            checked={saveToAssetLibrary}
            onChange={(event) => onToggleSaveToAssetLibrary(event.target.checked)}
          />
          <div>
            <span>Save product assets to library</span>
            <small>Keep this product’s images and metadata available for future generation batches.</small>
          </div>
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="button button-primary" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate"}
        </button>
        <button type="button" className="button button-secondary" onClick={onReset}>
          Reset Product
        </button>
      </div>
    </section>
  );
}
