import type { AssetLibraryItem } from "../types";

export const mockAssets: AssetLibraryItem[] = [
  {
    id: "asset-1",
    productName: "Northline Travel Sling",
    category: "Accessories",
    brand: "Northline",
    store: "US Main Store",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    savedAt: "2026-04-11",
    references: ["Water-resistant shell", "Commuter scenario"],
  },
  {
    id: "asset-2",
    productName: "Portable Blender Pro",
    category: "Kitchen Appliances",
    brand: "Northline",
    store: "Kitchen Launches",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80",
    savedAt: "2026-04-09",
    references: ["Gym use case", "USB-C charging"],
  },
  {
    id: "asset-3",
    productName: "FlexCore Training Mat",
    category: "Fitness",
    brand: "FlexCore",
    store: "Wellness Store",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    savedAt: "2026-04-03",
    references: ["Home workout setup", "Foldable storage angle"],
  },
];
