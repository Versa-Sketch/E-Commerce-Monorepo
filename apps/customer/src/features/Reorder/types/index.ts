export interface FrequentItem {
  variant_id: string;
  variant_name: string;
  product_id: string;
  product_name: string;
  product_image: string;
  shop_id: string;
  shop_name: string;
  mrp: string;
  selling_price: string;
  order_count: number;
  last_ordered_at: string;
  available_stock: number;
  is_in_stock: boolean;
}

export interface ReorderAddedItem {
  variant_id: string;
  product_name: string;
  variant_name: string;
  qty_added: number;
}

export interface ReorderSkippedItem {
  variant_id: string;
  product_name: string;
  variant_name: string;
  reason: 'out_of_stock' | 'no_headroom' | 'locked' | 'inactive';
}

export interface ReorderResult {
  shop_id: string;
  cart_id: string;
  added: ReorderAddedItem[];
  skipped: ReorderSkippedItem[];
}
