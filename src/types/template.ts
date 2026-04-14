export type TemplateType = "full" | "title" | "copy";

export interface TemplateRecord {
  id: string;
  name: string;
  type: TemplateType;
  store: string;
  category: string;
  tags: string[];
  titleTemplate: string;
  copyTemplate: string;
  imageStyleLabel: string;
  lastUsed: string;
}
