import type { ProductTaskRecord } from "../types";

export const mockProductTasks: ProductTaskRecord[] = [
  {
    id: "task_001",
    name: "Summer French Vintage Floral Dress",
    status: "completed",
    input: {
      category: "Women's Fashion",
      features: ["Waist-defining", "Slimming", "Elegant"],
      originalImage: "https://picsum.photos/seed/dress_input/300/400",
    },
    output: {
      generatedTitle: "✨ The flattering French floral dress everyone asks about 🔥",
      generatedCopy:
        "This dress shapes the waist beautifully and gives an instant slimmer silhouette. The fabric feels light and breathable, making it perfect for warm-weather outings, dates, and everyday styling.",
      generatedPosterImage: "https://picsum.photos/seed/dress_output/300/400",
    },
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "task_002",
    name: "Pro Noise-Cancelling Bluetooth Earbuds",
    status: "completed",
    input: {
      category: "Consumer Electronics",
      features: ["Noise cancelling", "Long battery life", "Low latency"],
      originalImage: "https://picsum.photos/seed/tech_input/300/400",
    },
    output: {
      generatedTitle: "🎧 Strong noise cancelling and all-day battery in one pair 🔇",
      generatedCopy:
        "Put them on and the outside world fades away. The sound feels immersive, the latency stays low for daily video use, and the battery life holds up through long study or work sessions.",
      generatedPosterImage: "https://picsum.photos/seed/tech_output/300/400",
    },
    createdAt: "2026-01-21T14:30:00Z",
  },
  {
    id: "task_003",
    name: "Minimalist Insulated Water Bottle",
    status: "processing",
    input: {
      category: "Home & Living",
      features: ["Insulated", "Leakproof", "Portable"],
      originalImage: "https://picsum.photos/seed/bottle_input/300/400",
    },
    output: {
      generatedTitle: "Stay cold longer with this clean everyday bottle",
      generatedCopy:
        "A compact insulated bottle designed for commuting, workouts, and daily carry. The leakproof lid and easy-grip shape make it practical for all-day use.",
      generatedPosterImage: "https://picsum.photos/seed/bottle_output/300/400",
    },
    createdAt: "2026-01-22T09:15:00Z",
  },
];
