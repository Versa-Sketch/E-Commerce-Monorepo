import { ApiResult, PaginatedResult } from '../../Common/services/http';
import { ApiOrder, ApiDashboardSummary } from '../types/domain';
import { IOrdersService } from './index';
import { fixtureDelay } from '../../Common/services/config';

export const orderFixtures = [
  {
    id: 'ORD-8492',
    customerName: 'Rahul Verma',
    itemsCount: 3,
    items: [
      { id: '1', name: 'Organic Roma Tomatoes', quantity: 2, price: 60 },
      { id: '2', name: 'Fresh Hass Avocado (Pack of 2)', quantity: 1, price: 299 },
      { id: '3', name: 'Amul Salted Butter 500g', quantity: 1, price: 275 },
    ],
    amount: 694,
    paymentMethod: 'Online' as const,
    orderTime: '10 mins ago',
    status: 'New Orders' as const,
    deliveryAddress: 'Apt 402, Block C, Prestige Heights, HSR Layout, Bengaluru',
    customerPhone: '+91 98765 43210',
    timeline: [{ status: 'Order Placed', time: '10 mins ago', completed: true }],
  },
  {
    id: 'ORD-8491',
    customerName: 'Ananya Sen',
    itemsCount: 2,
    items: [
      { id: '4', name: 'Saffola Gold Blended Oil 5L', quantity: 1, price: 950 },
      { id: '5', name: 'Aashirvaad Select Sharbati Atta 5kg', quantity: 1, price: 340 },
    ],
    amount: 1290,
    paymentMethod: 'COD' as const,
    orderTime: '25 mins ago',
    status: 'New Orders' as const,
    deliveryAddress: 'House 78, 12th Main Road, Koramangala 4th Block, Bengaluru',
    customerPhone: '+91 87654 32109',
    timeline: [{ status: 'Order Placed', time: '25 mins ago', completed: true }],
  },
  {
    id: 'ORD-8490',
    customerName: 'Suresh Kumar',
    itemsCount: 1,
    items: [{ id: '6', name: 'Parle-G Gold Biscuits (Packs of 5)', quantity: 2, price: 40 }],
    amount: 80,
    paymentMethod: 'Online' as const,
    orderTime: '45 mins ago',
    status: 'Accepted' as const,
    deliveryPartnerId: 'DP-01',
    deliveryAddress: 'Flat 101, Oakwood Residency, Sector 3, HSR Layout, Bengaluru',
    customerPhone: '+91 76543 21098',
    timeline: [
      { status: 'Order Placed', time: '45 mins ago', completed: true },
      { status: 'Accepted', time: '40 mins ago', completed: true },
      { status: 'Partner Assigned', time: '38 mins ago', completed: true },
    ],
  },
  {
    id: 'ORD-8488',
    customerName: 'Vikram Mehta',
    itemsCount: 4,
    items: [
      { id: '7', name: 'Dettol Liquid Handwash Refill 1L', quantity: 1, price: 199 },
      { id: '8', name: 'Surf Excel Easy Wash Detergent 2kg', quantity: 1, price: 340 },
    ],
    amount: 539,
    paymentMethod: 'Online' as const,
    orderTime: '1 hr ago',
    status: 'Packed' as const,
    deliveryPartnerId: 'DP-02',
    deliveryAddress: 'No. 44, 4th Cross, Green Glen Layout, Outer Ring Road, Bengaluru',
    customerPhone: '+91 65432 10987',
    timeline: [
      { status: 'Order Placed', time: '1 hr ago', completed: true },
      { status: 'Accepted', time: '55 mins ago', completed: true },
      { status: 'Packed', time: '40 mins ago', completed: true },
    ],
  },
  {
    id: 'ORD-8485',
    customerName: 'Meera Nair',
    itemsCount: 2,
    items: [
      { id: '9', name: 'Farm Fresh Brocolli 250g', quantity: 1, price: 80 },
      { id: '10', name: 'Fortune Basmati Rice 1kg', quantity: 2, price: 140 },
    ],
    amount: 360,
    paymentMethod: 'Online' as const,
    orderTime: '2 hrs ago',
    status: 'Out For Delivery' as const,
    deliveryPartnerId: 'DP-03',
    deliveryAddress: 'Villa 12, Sobha Green Meadows, Sarjapur Road, Bengaluru',
    customerPhone: '+91 99887 76655',
    timeline: [
      { status: 'Order Placed', time: '2 hrs ago', completed: true },
      { status: 'Accepted', time: '1 hr 50 mins ago', completed: true },
      { status: 'Packed', time: '1 hr 30 mins ago', completed: true },
      { status: 'Out For Delivery', time: '15 mins ago', completed: true },
    ],
  },
  {
    id: 'ORD-8480',
    customerName: 'Divya Rao',
    itemsCount: 5,
    items: [
      { id: '11', name: 'Lipton Honey Lemon Green Tea Bags 100s', quantity: 1, price: 420 },
    ],
    amount: 420,
    paymentMethod: 'Online' as const,
    orderTime: 'Yesterday',
    status: 'Delivered' as const,
    deliveryPartnerId: 'DP-01',
    deliveryAddress: 'Flat 503, Block B, Suncity Apartments, Sarjapur Road, Bengaluru',
    customerPhone: '+91 88990 01122',
    timeline: [
      { status: 'Order Placed', time: 'Yesterday 4:00 PM', completed: true },
      { status: 'Accepted', time: 'Yesterday 4:05 PM', completed: true },
      { status: 'Packed', time: 'Yesterday 4:20 PM', completed: true },
      { status: 'Out For Delivery', time: 'Yesterday 4:35 PM', completed: true },
      { status: 'Delivered', time: 'Yesterday 4:55 PM', completed: true },
    ],
  },
];

export class OrdersFixtureService implements IOrdersService {
  async fetchOrders(shopId: string, status?: string, page = 1): Promise<ApiResult<PaginatedResult<ApiOrder>>> {
    const apiOrders: ApiOrder[] = orderFixtures.map(f => ({
      order_id: f.id,
      shop_id: shopId,
      shop_name: 'Fixture Shop',
      status: f.status === 'New Orders' ? 'PLACED' :
              f.status === 'Accepted' ? 'ACCEPTED' :
              f.status === 'Packed' ? 'PACKING' :
              f.status === 'Out For Delivery' ? 'OUT_FOR_DELIVERY' :
              f.status === 'Delivered' ? 'DELIVERED' : 'CANCELLED',
      subtotal: f.amount.toString(),
      delivery_charge: '10.00',
      discount_amount: '0.00',
      total_amount: f.amount.toString(),
      created_at: new Date().toISOString(),
      items: f.items.map(i => ({
        variant_id: i.id,
        variant_name: 'Standard',
        product_id: i.id,
        product_name: i.name,
        product_image: '',
        quantity: i.quantity,
        unit_price: i.price.toString(),
        total_price: (i.price * i.quantity).toString(),
      })),
      payment: {
        payment_id: 'pay-001',
        payment_method: f.paymentMethod === 'Online' ? 'RAZORPAY' : 'COD',
        amount: f.amount.toString(),
        status: 'PAID',
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_123',
      },
      customer_name: f.customerName,
      customer_phone: f.customerPhone,
      address: {
        id: 'addr-001',
        address_line1: f.deliveryAddress,
        address_line2: '',
        state: 'Karnataka',
        pincode: '560001',
        address_type: 'HOME',
        latitude: 12.9715,
        longitude: 77.5945,
      },
    }));

    const filtered = status ? apiOrders.filter(o => o.status === status) : apiOrders;

    return fixtureDelay({
      ok: true,
      status: 200,
      message: null,
      data: {
        count: filtered.length,
        next: null,
        previous: null,
        results: filtered,
      },
    });
  }

  async fetchOrderDetail(shopId: string, orderId: string): Promise<ApiResult<ApiOrder>> {
    const ordersRes = await this.fetchOrders(shopId);
    if (!ordersRes.ok) {
      return ordersRes;
    }
    const found = ordersRes.data.results.find(o => o.order_id === orderId);
    if (!found) {
      return fixtureDelay({ ok: false, status: 404, message: 'Order not found' });
    }
    return fixtureDelay({ ok: true, status: 200, message: null, data: found });
  }

  async updateOrderStatus(shopId: string, orderId: string, status: string): Promise<ApiResult<ApiOrder>> {
    const details = await this.fetchOrderDetail(shopId, orderId);
    if (!details.ok) return details;
    const updated = { ...details.data, status: status as any };
    return fixtureDelay({ ok: true, status: 200, message: 'Updated', data: updated });
  }

  async fetchDashboardSummary(shopId: string): Promise<ApiResult<ApiDashboardSummary>> {
    return fixtureDelay({
      ok: true,
      status: 200,
      message: null,
      data: {
        orders_today_count: 5,
        pending_orders_count: 2,
        revenue_today: '12840.00',
        revenue_total: '124500.00',
      },
    });
  }
}
