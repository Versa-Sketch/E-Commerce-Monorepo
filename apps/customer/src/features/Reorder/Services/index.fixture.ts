import { FrequentItem, ReorderResult } from '../types';
import { IReorderService } from './index';

const MOCK_FREQUENT_ITEMS: FrequentItem[] = [
  {
    variant_id: 'var_milk_1l',
    variant_name: '1L',
    product_id: 'prod_milk',
    product_name: 'A2 Cow Milk',
    product_image: '',
    shop_id: 'store_1',
    shop_name: 'Greenfield Groceries',
    mrp: '90.00',
    selling_price: '85.00',
    order_count: 12,
    last_ordered_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    available_stock: 50,
    is_in_stock: true,
  },
  {
    variant_id: 'var_bread_ww',
    variant_name: 'Whole Wheat',
    product_id: 'prod_bread',
    product_name: 'Brown Bread',
    product_image: '',
    shop_id: 'store_1',
    shop_name: 'Greenfield Groceries',
    mrp: '45.00',
    selling_price: '42.00',
    order_count: 8,
    last_ordered_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    available_stock: 20,
    is_in_stock: true,
  },
  {
    variant_id: 'var_eggs_12',
    variant_name: 'Pack of 12',
    product_id: 'prod_eggs',
    product_name: 'Farm Eggs',
    product_image: '',
    shop_id: 'store_1',
    shop_name: 'Greenfield Groceries',
    mrp: '80.00',
    selling_price: '75.00',
    order_count: 6,
    last_ordered_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    available_stock: 0,
    is_in_stock: false,
  },
];

class ReorderFixtureService implements IReorderService {
  async getFrequentlyOrdered(): Promise<FrequentItem[]> {
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_FREQUENT_ITEMS;
  }

  async reorder(orderId: string): Promise<ReorderResult> {
    await new Promise((res) => setTimeout(res, 800));
    return {
      shop_id: 'store_1',
      cart_id: `cart_${orderId}`,
      added: [
        { variant_id: 'var_milk_1l', product_name: 'A2 Cow Milk', variant_name: '1L', qty_added: 1 },
        { variant_id: 'var_bread_ww', product_name: 'Brown Bread', variant_name: 'Whole Wheat', qty_added: 1 },
      ],
      skipped: [
        { variant_id: 'var_eggs_12', product_name: 'Farm Eggs', variant_name: 'Pack of 12', reason: 'out_of_stock' },
      ],
    };
  }
}

export const reorderService: IReorderService = new ReorderFixtureService();
