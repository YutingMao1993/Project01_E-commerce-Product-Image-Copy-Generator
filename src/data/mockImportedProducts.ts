import type { ProductDraftRecord } from "../types";

function createImportedProduct(
  id: string,
  values: ProductDraftRecord["values"],
  saveToAssetLibrary = false,
): ProductDraftRecord {
  return {
    id,
    values,
    uploadedImages: [],
    saveToAssetLibrary,
    source: "excel",
  };
}

export const mockImportedProducts: ProductDraftRecord[] = [
  createImportedProduct("import-1", {
    productName: "Commuter Sling Bag",
    category: "Accessories",
    price: "59",
    brand: "Northline",
    material: "Water-resistant nylon",
    size: "28cm x 18cm",
    color: "Black",
    targetAudience: "Urban commuters",
    sellingPoints: "Lightweight, anti-theft pocket, adjustable strap",
    description: "Compact everyday sling bag for commuting, travel, and daily carry.",
    copyStyle: "Professional",
    imageStyle: "Clean white",
  }),
  createImportedProduct("import-2", {
    productName: "Portable Blender Pro",
    category: "Kitchen Appliances",
    price: "79",
    brand: "Northline",
    material: "BPA-free cup",
    size: "20oz",
    color: "White",
    targetAudience: "Busy professionals",
    sellingPoints: "USB-C charging, quick clean, gym-friendly",
    description: "Portable blender designed for smoothies at home, work, or after workouts.",
    copyStyle: "Promotional",
    imageStyle: "Promo style",
  }, true),
  createImportedProduct("import-3", {
    productName: "FlexCore Yoga Mat",
    category: "Fitness",
    price: "42",
    brand: "FlexCore",
    material: "Non-slip TPE",
    size: "183cm x 61cm",
    color: "Sage Green",
    targetAudience: "Home fitness users",
    sellingPoints: "Cushioned support, easy roll-up, sweat-resistant texture",
    description: "A home workout and yoga mat built for stability, storage, and daily movement.",
    copyStyle: "Simple",
    imageStyle: "Lifestyle",
  }),
];
