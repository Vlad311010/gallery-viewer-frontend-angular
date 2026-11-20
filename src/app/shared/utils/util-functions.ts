import { TagCategory, TagCategoryType } from "@shared/models/tag-category";

export function modulo(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function getTagCategory(value: string): TagCategoryType | undefined {
  return Object.values(TagCategory).find(category => category === value);
}

export function tagCategoryToCssClass(value: string): string {
  const category = getTagCategory(value);
  switch (category) {
    case TagCategory.author:
      return 'author-tag';

    case TagCategory.character:
      return 'character-tag';

    case TagCategory.source:
      return 'source-tag';

    case TagCategory.general:
      return 'general-tag';

    default:
      throw new Error("Unknown tag category");
  }
}