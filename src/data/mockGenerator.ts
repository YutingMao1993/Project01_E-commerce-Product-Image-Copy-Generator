import type { FormValues, GeneratedVariation, UploadedImage } from "../types";

const styleOpeners = {
  Simple: ["Easy upgrade for everyday use.", "Clear value, ready to launch.", "Built to sell without the noise."],
  Professional: ["A polished product story for high-intent shoppers.", "Confident positioning for serious buyers.", "Refined messaging that supports conversion."],
  Playful: ["A brighter way to make your catalog pop.", "Big shelf energy in one click.", "Give your listing a little charisma."],
  Promotional: ["Campaign-ready creative built to drive action.", "Launch with a stronger offer-led angle.", "Turn attention into add-to-cart momentum."],
} as const;

const styleClosers = {
  "Clean white": "Presented on a clean background for marketplace-ready clarity.",
  "Promo style": "Styled like a campaign asset with bolder retail energy.",
  Lifestyle: "Placed in a real-world setting to make the product feel lived-in.",
} as const;

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const splitLines = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const formatPrice = (price: string) => {
  if (!price.trim()) return null;
  const numericValue = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) && numericValue > 0 ? `$${numericValue.toFixed(2)}` : price;
};

export async function generateMockResults(
  values: FormValues,
  uploadedImages: UploadedImage[],
): Promise<GeneratedVariation[]> {
  await delay(1400);

  if (values.productName.toLowerCase().includes("error")) {
    throw new Error("Mock generation failed. Update the product name and try again.");
  }

  const sellingPoints = splitLines(values.sellingPoints);
  const descriptionBits = splitLines(values.description);
  const audience = values.targetAudience.trim() || "modern online shoppers";
  const formattedPrice = formatPrice(values.price);
  const brandPrefix = values.brand.trim() ? `${values.brand.trim()} ` : "";
  const categoryLabel = values.category.trim() || "product";
  const openers = styleOpeners[values.copyStyle];
  const closer = styleClosers[values.imageStyle];

  return uploadedImages.slice(0, 3).map((image, index) => {
    const benefit = sellingPoints[index] || sellingPoints[0] || descriptionBits[index] || "designed for conversion";
    const supportingDetail =
      descriptionBits[index] ||
      descriptionBits[0] ||
      `Made for ${audience} looking for a reliable ${categoryLabel}.`;

    return {
      id: `${image.id}-${index}`,
      imageUrl: image.previewUrl,
      imageAlt: `${values.productName} variation ${index + 1}`,
      title: `${brandPrefix}${values.productName}`.trim(),
      tagline: `${openers[index % openers.length]} ${formattedPrice ? `From ${formattedPrice}.` : ""}`.trim(),
      description: `${benefit}. ${supportingDetail} ${closer}`.replace(/\s+/g, " ").trim(),
    };
  });
}
