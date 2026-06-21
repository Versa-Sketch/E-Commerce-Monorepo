import { makeAutoObservable } from 'mobx';
import type { ApiOrder, ApiOrderItem } from '../types/domain';

export class OrderDetailItem {
  variantId: string;
  variantName: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  constructor(data: ApiOrderItem) {
    this.variantId = data.variant_id;
    this.variantName = data.variant_name;
    this.productId = data.product_id;
    this.productName = data.product_name;
    this.productImage = data.product_image;
    this.quantity = data.quantity;
    this.unitPrice = Number(data.unit_price);
    this.totalPrice = Number(data.total_price);
    makeAutoObservable(this);
  }
}

/** Full order detail from GET .../orders/{order_id}/ — the canonical source for the Order
 * Details sheet; the list endpoint's `Order` view-model below only carries a flattened subset. */
export class OrderDetail {
  orderId: string;
  shopName: string;
  status: ApiOrder['status'];
  createdAt: string;
  customerName: string;
  customerPhone: string;
  items: OrderDetailItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  address: {
    addressLine1: string;
    addressLine2: string;
    state: string;
    pincode: string;
    addressType: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  payment: {
    paymentId: string;
    method: string;
    amount: number;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
  } | null;

  constructor(data: ApiOrder) {
    this.orderId = data.order_id;
    this.shopName = data.shop_name;
    this.status = data.status;
    this.createdAt = data.created_at;
    this.customerName = data.customer_name;
    this.customerPhone = data.customer_phone;
    this.items = (data.items ?? []).map((item) => new OrderDetailItem(item));
    this.subtotal = Number(data.subtotal);
    this.deliveryCharge = Number(data.delivery_charge);
    this.discountAmount = Number(data.discount_amount);
    this.totalAmount = Number(data.total_amount);
    this.address = data.address
      ? {
          addressLine1: data.address.address_line1,
          addressLine2: data.address.address_line2,
          state: data.address.state,
          pincode: data.address.pincode,
          addressType: data.address.address_type,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        }
      : null;
    this.payment = data.payment
      ? {
          paymentId: data.payment.payment_id,
          method: data.payment.payment_method,
          amount: Number(data.payment.amount),
          status: data.payment.status,
          razorpayOrderId: data.payment.razorpay_order_id,
          razorpayPaymentId: data.payment.razorpay_payment_id,
        }
      : null;
    makeAutoObservable(this);
  }
}

export class OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;

  constructor(data: { id: string; name: string; quantity: number; price: number }) {
    this.id = data.id;
    this.name = data.name;
    this.quantity = data.quantity;
    this.price = data.price;
    makeAutoObservable(this);
  }
}

export class OrderTimelineEvent {
  status: string;
  time: string;
  completed: boolean;

  constructor(data: { status: string; time: string; completed: boolean }) {
    this.status = data.status;
    this.time = data.time;
    this.completed = data.completed;
    makeAutoObservable(this);
  }
}

export class Order {
  id: string;
  customerName: string;
  itemsCount: number;
  items: OrderItem[] = [];
  amount: number;
  paymentMethod: 'COD' | 'Online';
  orderTime: string;
  status:
    | 'New Orders'
    | 'Accepted'
    | 'Packed'
    | 'Out For Delivery'
    | 'Delivered'
    | 'Cancelled'
    | 'Rejected';
  deliveryPartnerId?: string;
  deliveryAddress: string;
  customerPhone: string;
  timeline: OrderTimelineEvent[] = [];

  constructor(data: {
    id: string;
    customerName: string;
    itemsCount: number;
    items: any[];
    amount: number;
    paymentMethod: 'COD' | 'Online';
    orderTime: string;
    status:
      | 'New Orders'
      | 'Accepted'
      | 'Packed'
      | 'Out For Delivery'
      | 'Delivered'
      | 'Cancelled'
      | 'Rejected';
    deliveryPartnerId?: string;
    deliveryAddress: string;
    customerPhone: string;
    timeline: any[];
  }) {
    this.id = data.id;
    this.customerName = data.customerName;
    this.itemsCount = data.itemsCount;
    this.items = data.items.map((item) => new OrderItem(item));
    this.amount = data.amount;
    this.paymentMethod = data.paymentMethod;
    this.orderTime = data.orderTime;
    this.status = data.status;
    this.deliveryPartnerId = data.deliveryPartnerId;
    this.deliveryAddress = data.deliveryAddress;
    this.customerPhone = data.customerPhone;
    this.timeline = data.timeline.map((event) => new OrderTimelineEvent(event));
    makeAutoObservable(this);
  }

  updateStatus(newStatus: typeof this.status) {
    this.status = newStatus;
    this.timeline.push(
      new OrderTimelineEvent({
        status: newStatus,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      })
    );
  }

  assignDeliveryPartner(partnerId: string) {
    this.deliveryPartnerId = partnerId;
    this.timeline.push(
      new OrderTimelineEvent({
        status: 'Partner Assigned',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      })
    );
  }
}
