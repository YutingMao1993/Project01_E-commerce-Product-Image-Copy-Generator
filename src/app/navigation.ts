import type { LucideIcon } from "lucide-react";
import { FolderKanban, History, Images, LayoutTemplate, Sparkles } from "lucide-react";
import type { AppView } from "../types";

export interface NavigationItem {
  id: AppView;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    label: "Workflow",
    items: [
      {
        id: "generate",
        label: "Generate",
        description: "Import products, prepare assets, and build a working batch.",
        icon: Sparkles,
      },
      {
        id: "results",
        label: "Review",
        description: "Review generated drafts, edit copy, and keep the best version.",
        icon: FolderKanban,
      },
    ],
  },
  {
    label: "Library",
    items: [
      {
        id: "templates",
        label: "Templates",
        description: "Browse reusable title, copy, and creative structures.",
        icon: LayoutTemplate,
      },
      {
        id: "assets",
        label: "Assets",
        description: "Manage saved product materials and references for future batches.",
        icon: Images,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        id: "tasks",
        label: "History",
        description: "Review previous generation tasks and stored outputs.",
        icon: History,
      },
    ],
  },
];

export const navigationItems: NavigationItem[] = navigationSections.flatMap((section) => section.items);
