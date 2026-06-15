import type { CategoryApi } from '../types/api';

export const categoriesFixture: CategoryApi[] = [
  { id: 'cat-001', name: 'Dairy', image: '', is_active: true },
  { id: 'cat-002', name: 'Beverages', image: '', is_active: true },
  { id: 'cat-003', name: 'Snacks', image: '', is_active: true },
  { id: 'cat-004', name: 'Bakery', image: '', is_active: false },
];

export const subcategoriesFixture: Record<string, CategoryApi[]> = {
  'cat-001': [
    { id: 'sub-001', name: 'Milk', image: '', is_active: true },
    { id: 'sub-002', name: 'Curd', image: '', is_active: true },
    { id: 'sub-003', name: 'Cheese', image: '', is_active: false },
  ],
  'cat-002': [
    { id: 'sub-004', name: 'Juices', image: '', is_active: true },
    { id: 'sub-005', name: 'Soft Drinks', image: '', is_active: true },
  ],
};
