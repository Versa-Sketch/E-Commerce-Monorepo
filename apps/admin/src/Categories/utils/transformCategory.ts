import type { CategoryApi } from '../types/api';
import type { CategoryDomain } from '../types/domain';

export const transformCategory = (api: CategoryApi): CategoryDomain => ({
  id: api.id,
  name: api.name,
  image: api.image,
  isActive: api.is_active,
});
