import type { AppClient } from '../../../stores/services/AppClient';
import type { CategoriesServiceInterface } from './index';
import type { CategoryApi, CreateCategoryRequestApi, UpdateCategoryRequestApi } from '../../types/api';
import { CATEGORY_ENDPOINTS } from '../../Constants/categoriesConstants';

export class CategoriesApiService implements CategoriesServiceInterface {
  private readonly client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getCategories(isActive?: boolean): Promise<CategoryApi[]> {
    const url =
      isActive === undefined
        ? CATEGORY_ENDPOINTS.LIST
        : `${CATEGORY_ENDPOINTS.LIST}?is_active=${isActive}`;
    return this.client
      .get<{ status: number; data: CategoryApi[] }>(url)
      .then(res => res.data);
  }

  createCategory(body: CreateCategoryRequestApi): Promise<CategoryApi> {
    return this.client
      .post<{ status: number; data: CategoryApi }>(CATEGORY_ENDPOINTS.LIST, body)
      .then(res => res.data);
  }

  async updateCategory(id: string, body: UpdateCategoryRequestApi): Promise<void> {
    await this.client.patch(CATEGORY_ENDPOINTS.DETAIL(id), body);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.client.delete(CATEGORY_ENDPOINTS.DETAIL(id));
  }

  getSubcategories(categoryId: string): Promise<CategoryApi[]> {
    return this.client
      .get<{ status: number; data: CategoryApi[] }>(CATEGORY_ENDPOINTS.SUBCATEGORIES(categoryId))
      .then(res => res.data);
  }

  createSubcategory(categoryId: string, body: CreateCategoryRequestApi): Promise<CategoryApi> {
    return this.client
      .post<{ status: number; data: CategoryApi }>(CATEGORY_ENDPOINTS.SUBCATEGORIES(categoryId), body)
      .then(res => res.data);
  }

  async updateSubcategory(categoryId: string, subId: string, body: UpdateCategoryRequestApi): Promise<void> {
    await this.client.patch(CATEGORY_ENDPOINTS.SUBCATEGORY(categoryId, subId), body);
  }

  async deleteSubcategory(categoryId: string, subId: string): Promise<void> {
    await this.client.delete(CATEGORY_ENDPOINTS.SUBCATEGORY(categoryId, subId));
  }
}
