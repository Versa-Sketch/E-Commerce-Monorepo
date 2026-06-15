export const STORE_ENDPOINTS = {
  LIST: '/stores',
  DETAIL: '/stores/:id',
  PRODUCTS: '/stores/:id/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/stores/categories',
  GLOBAL_CATEGORIES: '/shops/user/categories/',
  SHOPS: '/shops/user/shops/',
  FEATURED_SHOPS: '/shops/user/shops/featured/',
  SEARCH_SHOPS: '/shops/search/shops/',
  SHOP_CATEGORIES: '/shops/user/shops/:id/categories/',
  SHOP_PRODUCTS: '/shops/user/shops/:id/products/',
} as const;
