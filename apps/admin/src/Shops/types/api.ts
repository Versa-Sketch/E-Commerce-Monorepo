// ── Shop Types ──────────────────────────────────────────────────────────────

export interface ShopTypeApi {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface CreateShopTypeRequestApi {
  name: string;
  description?: string;
}

export interface UpdateShopTypeRequestApi {
  name?: string;
  description?: string;
  is_active?: boolean;
}


// ── Shop Type Categories ─────────────────────────────────────────────────────

export interface ShopTypeCategoryApi {
  mapping_id: string;
  id: string;
  name: string;
  image: string;
  is_active: boolean;
  is_primary: boolean;
}

export interface MapCategoriesRequestApi {
  category_id: string;
  is_primary: boolean;
}

export interface MapCategoriesResponseApi {
  status: number;
  message: string;
}

export interface UpdateMappingRequestApi {
  is_primary: boolean;
}
