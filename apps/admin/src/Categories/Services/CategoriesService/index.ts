import type { CategoryApi, CreateCategoryRequestApi, UpdateCategoryRequestApi } from '../../types/api';

export interface CategoriesServiceInterface {
  getCategories(isActive?: boolean): Promise<CategoryApi[]>;
  createCategory(body: CreateCategoryRequestApi): Promise<CategoryApi>;
  updateCategory(id: string, body: UpdateCategoryRequestApi): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  getSubcategories(categoryId: string): Promise<CategoryApi[]>;
  createSubcategory(categoryId: string, body: CreateCategoryRequestApi): Promise<CategoryApi>;
  updateSubcategory(categoryId: string, subId: string, body: UpdateCategoryRequestApi): Promise<void>;
  deleteSubcategory(categoryId: string, subId: string): Promise<void>;
}
