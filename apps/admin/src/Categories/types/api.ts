export interface CategoryApi {
  id: string;
  name: string;
  image: string;
  is_active: boolean;
}

export interface CreateCategoryRequestApi {
  name: string;
  image?: string;
}

export interface UpdateCategoryRequestApi {
  name?: string;
  image?: string;
  is_active?: boolean;
}
