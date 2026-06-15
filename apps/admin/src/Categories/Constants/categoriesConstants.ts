export const CATEGORY_ENDPOINTS = {
  LIST:          '/shops/admin/categories/',
  DETAIL:        (id: string) => `/shops/admin/categories/${id}/`,
  SUBCATEGORIES: (id: string) => `/shops/admin/categories/${id}/subcategories/`,
  SUBCATEGORY:   (id: string, subId: string) => `/shops/admin/categories/${id}/subcategories/${subId}/`,
} as const;
