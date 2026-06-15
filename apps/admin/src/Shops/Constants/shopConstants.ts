export const SHOP_ENDPOINTS = {
  SHOP_TYPES: '/shops/admin/shop-types/',
  SHOP_TYPE: (id: string) => `/shops/admin/shop-types/${id}/`,
  CATEGORIES: (shopTypeId: string) =>
    `/shops/admin/shop-types/${shopTypeId}/categories/`,
  CATEGORY_MAPPING: (shopTypeId: string, mappingId: string) =>
    `/shops/admin/shop-types/${shopTypeId}/categories/${mappingId}/`,
} as const;
