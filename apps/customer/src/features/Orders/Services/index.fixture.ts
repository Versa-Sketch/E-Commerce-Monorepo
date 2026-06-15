import { IOrderService } from './index';
import { OrderApi } from '../../../types/shared';
const MOCK_ORDERS: OrderApi[] = [
  {
    order_id: 'ord_3F2A19',
    shop_id: 'store_1',
    shop_name: 'Greenfield Groceries',
    status: 'OUT_FOR_DELIVERY',
    subtotal: '388.00',
    delivery_charge: '15.00',
    discount_amount: '14.00',
    total_amount: '389.00',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [
      {
        variant_id: 'var_avocado',
        variant_name: 'Pack of 2',
        product_id: 'prod_1',
        product_name: 'Organic Avocados',
        product_image: '',
        quantity: 2,
        unit_price: '149.00',
        total_price: '298.00',
      },
      {
        variant_id: 'var_milk',
        variant_name: '1L',
        product_id: 'prod_2',
        product_name: 'A2 Cow Milk',
        product_image: '',
        quantity: 1,
        unit_price: '90.00',
        total_price: '90.00',
      },
    ],
    payment: {
      payment_id: 'pay_ord_3F2A19',
      payment_method: 'COD',
      amount: '389.00',
      status: 'COD',
    },
  },
  {
    order_id: 'ord_91CDA0',
    shop_id: 'store_2',
    shop_name: 'Wellness Pharmacy',
    status: 'DELIVERED',
    subtotal: '299.00',
    delivery_charge: '10.00',
    discount_amount: '0.00',
    total_amount: '309.00',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    items: [
      {
        variant_id: 'var_vitamin',
        variant_name: '60 tabs',
        product_id: 'prod_3',
        product_name: 'Multi-Vitamin Capsules',
        product_image: '',
        quantity: 1,
        unit_price: '299.00',
        total_price: '299.00',
      },
    ],
    payment: {
      payment_id: 'pay_ord_91CDA0',
      payment_method: 'RAZORPAY',
      amount: '309.00',
      status: 'SUCCESS',
    },
  },
];
export class OrderFixtureService implements IOrderService {
  async getOrders(): Promise<OrderApi[]> {
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_ORDERS;
  }
  async getOrderById(orderId: string): Promise<OrderApi> {
    await new Promise((res) => setTimeout(res, 300));
    const order = MOCK_ORDERS.find((o) => o.order_id === orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    return order;
  }
  async cancelOrder(): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
  }
}
export const orderService: IOrderService = new OrderFixtureService();
