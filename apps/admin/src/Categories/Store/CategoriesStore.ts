import { makeAutoObservable, runInAction } from 'mobx';
import { API_STATUS, type ApiStatus } from '../../stores/constants/apiStatus';
import type { CategoriesServiceInterface } from '../Services/CategoriesService';
import type { CategoryDomain } from '../types/domain';
import type { CreateCategoryRequestApi, UpdateCategoryRequestApi } from '../types/api';
import { transformCategory } from '../utils/transformCategory';

export type ActiveFilter = 'all' | 'active' | 'inactive';

export class CategoriesStore {
  status: ApiStatus = API_STATUS.IDLE;
  subcategoriesStatus: ApiStatus = API_STATUS.IDLE;
  error: string | null = null;
  categories: CategoryDomain[] = [];
  subcategories: CategoryDomain[] = [];
  activeFilter: ActiveFilter = 'all';

  private readonly service: CategoriesServiceInterface;

  constructor(service: CategoriesServiceInterface) {
    this.service = service;
    makeAutoObservable<this, 'service'>(this, { service: false });
  }

  get filteredCategories(): CategoryDomain[] {
    if (this.activeFilter === 'active') return this.categories.filter(c => c.isActive);
    if (this.activeFilter === 'inactive') return this.categories.filter(c => !c.isActive);
    return this.categories;
  }

  get activeCount(): number {
    return this.categories.filter(c => c.isActive).length;
  }

  get inactiveCount(): number {
    return this.categories.filter(c => !c.isActive).length;
  }

  setActiveFilter(value: ActiveFilter): void {
    this.activeFilter = value;
  }

  async fetchCategories(): Promise<void> {
    this.status = API_STATUS.FETCHING;
    this.error = null;
    try {
      const data = await this.service.getCategories();
      runInAction(() => {
        this.categories = data.map(transformCategory);
        this.status = API_STATUS.SUCCESS;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load categories.';
        this.status = API_STATUS.ERROR;
      });
    }
  }

  async createCategory(body: CreateCategoryRequestApi): Promise<void> {
    await this.service.createCategory(body);
    await this.fetchCategories();
  }

  async updateCategory(id: string, body: UpdateCategoryRequestApi): Promise<void> {
    await this.service.updateCategory(id, body);
    await this.fetchCategories();
  }

  async deleteCategory(id: string): Promise<void> {
    await this.service.deleteCategory(id);
    await this.fetchCategories();
  }

  async fetchSubcategories(categoryId: string): Promise<void> {
    this.subcategoriesStatus = API_STATUS.FETCHING;
    try {
      const data = await this.service.getSubcategories(categoryId);
      runInAction(() => {
        this.subcategories = data.map(transformCategory);
        this.subcategoriesStatus = API_STATUS.SUCCESS;
      });
    } catch {
      runInAction(() => {
        this.subcategoriesStatus = API_STATUS.ERROR;
      });
    }
  }

  async createSubcategory(categoryId: string, body: CreateCategoryRequestApi): Promise<void> {
    await this.service.createSubcategory(categoryId, body);
    await this.fetchSubcategories(categoryId);
  }

  async updateSubcategory(categoryId: string, subId: string, body: UpdateCategoryRequestApi): Promise<void> {
    await this.service.updateSubcategory(categoryId, subId, body);
    await this.fetchSubcategories(categoryId);
  }

  async deleteSubcategory(categoryId: string, subId: string): Promise<void> {
    await this.service.deleteSubcategory(categoryId, subId);
    await this.fetchSubcategories(categoryId);
  }
}
