export const TagCategory = {
  author: 'author',
  character: 'character',
  source: 'source',
  general: 'general'
} as const;

export type TagCategoryType = typeof TagCategory[keyof typeof TagCategory];
 