import type { LucideIcon } from "lucide-react";
import { FolderKanban, Images, LayoutTemplate, Sparkles } from "lucide-react";
import type { AppView } from "../types";

export interface NavigationItem {
  id: AppView;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    id: "generate",
    label: "Generate",
    description: "Import products, upload assets, and start draft generation.",
    icon: Sparkles,
  },
  {
    id: "results",
    label: "Results",
    description: "Review generated variations, edit copy, and keep the best options.",
    icon: FolderKanban,
  },
  {
    id: "templates",
    label: "Templates",
    description: "Browse reusable title, copy, and full creative structures.",
    icon: LayoutTemplate,
  },
  {
    id: "assets",
    label: "Assets",
    description: "Manage saved product materials and references for future batches.",
    icon: Images,
  },
];
