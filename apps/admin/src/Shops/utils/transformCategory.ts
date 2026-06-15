import type { ShopTypeCategoryApi } from '../types/api';
import type { ShopTypeCategoryDomain } from '../types/domain';

export function transformCategory(api: ShopTypeCategoryApi): ShopTypeCategoryDomain {
  return {
    mappingId: api.mapping_id,
    id: api.id,
    name: api.name,
    image: api.image,
    isActive: api.is_active,
    isPrimary: api.is_primary,
  };
}
