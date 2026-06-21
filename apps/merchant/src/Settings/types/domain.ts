export type StoreType = 'Grocery' | 'Pharmacy' | 'Fashion' | 'Electronics' | 'Restaurants' | 'Local Shops';

export interface OperatingHourItem {
  day_of_week: number;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
}

export interface ShopProfile {
  shop_id: string;
  name: string;
  description: string;
  phone_number: string;
  logo: string | null;
  banner: string | null;
  store_front_photo: string | null;
  store_interior_photo: string | null;
  delivery_radius_km: number;
  operating_hours: OperatingHourItem[];
}

export interface ShopProfileUpdateRequest {
  name?: string;
  description?: string;
  phone_number?: string;
  logo?: string | null;
  banner?: string | null;
  store_front_photo?: string | null;
  store_interior_photo?: string | null;
  delivery_radius_km?: number;
  operating_hours?: OperatingHourItem[];
}
