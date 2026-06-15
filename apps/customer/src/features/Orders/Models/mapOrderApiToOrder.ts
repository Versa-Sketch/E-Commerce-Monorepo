import { AddressApi, OrderApi } from '../../../types/shared';
import { Order, OrderStatus } from '../types/domain';

export const mapOrderApiToOrder = (api: OrderApi, address?: AddressApi): Order => ({
  id: api.order_id,
  storeId: api.shop_id,
  storeName: api.shop_name,
  items: (api.items ?? []).map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    imageUrl: item.product_image,
    quantity: item.quantity,
    price: parseFloat(item.unit_price),
  })),
  status: (api.status as OrderStatus) ?? 'PLACED',
  totalAmount: parseFloat(api.total_amount),
  deliveryAddress: address,
  deliveryFee: parseFloat(api.delivery_charge),
  platformFee: 0,
  gstAmount: 0,
  discount: parseFloat(api.discount_amount),
  createdAt: api.created_at,
  updatedAt: api.created_at,
});
