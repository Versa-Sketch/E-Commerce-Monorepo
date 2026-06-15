// ── Shop Types ──────────────────────────────────────────────────────────────

export interface ShopTypeDomain {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

// ── Shop Type Categories ─────────────────────────────────────────────────────

export interface ShopTypeCategoryDomain {
  mappingId: string;
  id: string;
  name: string;
  image: string;
  isActive: boolean;
  isPrimary: boolean;
}
