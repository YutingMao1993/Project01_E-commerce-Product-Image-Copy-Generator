import type { ChangeEvent } from "react";
import { ResizableTextarea } from "./ResizableTextarea";
import type { CopyStyle, FormErrors, FormValues, ImageStyle, UploadedImage } from "../types";

interface FormPanelProps {
  values: FormValues;
  errors: FormErrors;
  uploadedImages: UploadedImage[];
  isLoading: boolean;
  onFieldChange: <K extends keyof FormValues>(field: K, value: FormValues[K]) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onGenerate: () => void;
  onReset: () => void;
}

const copyStyles: CopyStyle[] = ["Simple", "Professional", "Playful", "Promotional"];
const imageStyles: ImageStyle[] = ["Clean white", "Promo style", "Lifestyle"];

export function FormPanel({
  values,
  errors,
  uploadedImages,
  isLoading,
  onFieldChange,
  onImageUpload,
  onRemoveImage,
  onGenerate,
  onReset,
}: FormPanelProps) {
  return (
    <section className="panel panel-form">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Input</p>
          <h1>E-commerce Product Image & Copy Generator</h1>
        </div>
        <p className="panel-intro">
          Add product context, upload reference images, and generate draft marketing assets for your team to refine.
        </p>
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
      </div>

      <div className="button-row">
        <button type="button" className="button button-primary" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate"}
        </button>
        <button type="button" className="button button-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
