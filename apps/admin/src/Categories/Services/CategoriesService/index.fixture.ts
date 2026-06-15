import type { CategoriesServiceInterface } from './index';
import type { CategoryApi, CreateCategoryRequestApi, UpdateCategoryRequestApi } from '../../types/api';
import { categoriesFixture, subcategoriesFixture } from '../../Fixtures/categoriesFixture';

export class CategoriesFixtureService implements CategoriesServiceInterface {
  private categories: CategoryApi[] = categoriesFixture.map(c => ({ ...c }));
  private subcategories: Record<string, CategoryApi[]> = Object.fromEntries(
    Object.entries(subcategoriesFixture).map(([k, v]) => [k, v.map(s => ({ ...s }))]),
  );

  async getCategories(isActive?: boolean): Promise<CategoryApi[]> {
    await delay(400);
    if (isActive === undefined) return this.categories.map(c => ({ ...c }));
    return this.categories.filter(c => c.is_active === isActive).map(c => ({ ...c }));
  }

  async createCategory(body: CreateCategoryRequestApi): Promise<CategoryApi> {
    await delay(400);
    const item: CategoryApi = { id: `cat-${Date.now()}`, name: body.name, image: body.image ?? '', is_active: true };
    this.categories.push(item);
    return { ...item };
  }

  async updateCategory(id: string, body: UpdateCategoryRequestApi): Promise<void> {
    await delay(300);
    const item = this.categories.find(c => c.id === id);
    if (item) Object.assign(item, { ...body, image: body.image ?? item.image, is_active: body.is_active ?? item.is_active });
  }

  async deleteCategory(id: string): Promise<void> {
    await delay(300);
    const item = this.categories.find(c => c.id === id);
    if (item) item.is_active = false;
  }

  async getSubcategories(categoryId: string): Promise<CategoryApi[]> {
    await delay(400);
    return (this.subcategories[categoryId] ?? []).map(s => ({ ...s }));
  }

  async createSubcategory(categoryId: string, body: CreateCategoryRequestApi): Promise<CategoryApi> {
    await delay(400);
    const item: CategoryApi = { id: `sub-${Date.now()}`, name: body.name, image: body.image ?? '', is_active: true };
    if (!this.subcategories[categoryId]) this.subcategories[categoryId] = [];
    this.subcategories[categoryId].push(item);
    return { ...item };
  }

  async updateSubcategory(categoryId: string, subId: string, body: UpdateCategoryRequestApi): Promise<void> {
    await delay(300);
    const item = (this.subcategories[categoryId] ?? []).find(s => s.id === subId);
    if (item) Object.assign(item, { ...body, image: body.image ?? item.image, is_active: body.is_active ?? item.is_active });
  }

  async deleteSubcategory(categoryId: string, subId: string): Promise<void> {
    await delay(300);
    const item = (this.subcategories[categoryId] ?? []).find(s => s.id === subId);
    if (item) item.is_active = false;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
