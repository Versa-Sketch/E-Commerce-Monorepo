import { makeAutoObservable, runInAction } from "mobx";
import { Order, OrderDetail } from "../Models/Order";
import type { SessionStore } from "../../Auth/Store";
import { USE_FIXTURES } from "../../Common/services/config";
import { resolveShopId } from "../../Common/services/shopId";
import type { IOrdersService } from "../Services";
import { OrdersApiService } from "../Services/index.api";
import { OrdersFixtureService } from "../Services/index.fixture";
import type { ApiOrder } from "../types/domain";

export type LoadState = "idle" | "loading" | "error";

export class OrdersStore {
  orders: Order[] = [];
  state: LoadState = "idle";
  error: string | null = null;
  shopId: string | null = null;
  searchQuery: string = '';

  // Full order detail — GET .../orders/{order_id}/
  orderDetail: OrderDetail | null = null;
  orderDetailState: LoadState = 'idle';
  orderDetailError: string | null = null;

  private session: SessionStore;
  private service: IOrdersService;

  constructor(session: SessionStore, service?: IOrdersService) {
    this.session = session;
    this.service =
      service ??
      (USE_FIXTURES
        ? new OrdersFixtureService()
        : new OrdersApiService(session));
    makeAutoObservable(this);
  }

  async ensureShopId(): Promise<string | null> {
    if (this.shopId) return this.shopId;
    if (this.session.user?.shop_id) {
      runInAction(() => {
        this.shopId = this.session.user!.shop_id;
      });
      return this.shopId;
    }
    const id = await resolveShopId(this.session.accessToken);
    runInAction(() => {
      this.shopId = id;
    });
    return id;
  }

  async fetchOrders(statusFilter?: string, search?: string) {
    runInAction(() => {
      this.state = "loading";
      this.error = null;
      if (search !== undefined) {
        this.searchQuery = search;
      }
    });

    const shopId = await this.ensureShopId();
    if (!shopId) {
      runInAction(() => {
        this.state = "error";
        this.error = "No shop ID found";
      });
      return;
    }

    // Map UI filter status to API status code
    let apiStatus: string | undefined = undefined;
    if (statusFilter === "New Orders") apiStatus = "PLACED";
    else if (statusFilter === "Accepted") apiStatus = "ACCEPTED";
    else if (statusFilter === "Packed")
      apiStatus = "PACKING"; // Also includes READY_FOR_PICKUP if we fetch all
    else if (statusFilter === "Out For Delivery")
      apiStatus = "OUT_FOR_DELIVERY";
    else if (statusFilter === "Delivered") apiStatus = "DELIVERED";
    else if (statusFilter === "Cancelled") apiStatus = "CANCELLED";

    const res = await this.service.fetchOrders(shopId, apiStatus, 1, this.searchQuery);
    runInAction(() => {
      if (res.ok && res.data) {
        this.orders = res.data.results.map((o) => this.mapApiOrderToModel(o));
        this.state = "idle";
      } else {
        this.state = "error";
        this.error = res.message || "Failed to load orders";
      }
    });
  }

  async fetchOrderDetail(orderId: string): Promise<void> {
    runInAction(() => {
      this.orderDetailState = 'loading';
      this.orderDetailError = null;
      this.orderDetail = null;
    });
    const shopId = await this.ensureShopId();
    if (!shopId) {
      runInAction(() => {
        this.orderDetailState = 'error';
        this.orderDetailError = 'No shop ID found';
      });
      return;
    }
    const res = await this.service.fetchOrderDetail(shopId, orderId);
    runInAction(() => {
      if (res.ok && res.data) {
        this.orderDetail = new OrderDetail(res.data);
        this.orderDetailState = 'idle';
      } else {
        this.orderDetailState = 'error';
        this.orderDetailError = res.message || 'Failed to load order detail';
      }
    });
  }

  private mapApiOrderToModel(api: ApiOrder): Order {
    let uiStatus: Order["status"] = "New Orders";
    if (api.status === "PLACED") uiStatus = "New Orders";
    else if (api.status === "ACCEPTED") uiStatus = "Accepted";
    else if (api.status === "PACKING" || api.status === "READY_FOR_PICKUP")
      uiStatus = "Packed";
    else if (api.status === "OUT_FOR_DELIVERY") uiStatus = "Out For Delivery";
    else if (api.status === "DELIVERED") uiStatus = "Delivered";
    else if (api.status === "CANCELLED") uiStatus = "Cancelled";

    const addressStr = api.address
      ? `${api.address.address_line1}${api.address.address_line2 ? ", " + api.address.address_line2 : ""}, ${api.address.state} - ${api.address.pincode}`
      : "No address provided";

    const timeStr = new Date(api.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Handle both list response (no items) and detail response (with items)
    const items = api.items ?? [];
    const itemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

    return new Order({
      id: api.order_id,
      customerName: api.customer_name,
      itemsCount: itemsCount,
      items: items.map((i) => ({
        id: i.variant_id,
        name: i.product_name,
        quantity: i.quantity,
        price: Number(i.unit_price),
      })),
      amount: Number(api.total_amount),
      paymentMethod: api.payment?.payment_method === "COD" ? "COD" : "Online",
      orderTime: timeStr,
      status: uiStatus,
      deliveryAddress: addressStr,
      customerPhone: api.customer_phone,
      timeline: [{ status: "Order Placed", time: timeStr, completed: true }],
    });
  }

  get newOrders() {
    return this.orders.filter((o) => o.status === "New Orders");
  }

  get acceptedOrders() {
    return this.orders.filter((o) => o.status === "Accepted");
  }

  get packedOrders() {
    return this.orders.filter((o) => o.status === "Packed");
  }

  get outForDeliveryOrders() {
    return this.orders.filter((o) => o.status === "Out For Delivery");
  }

  get deliveredOrders() {
    return this.orders.filter((o) => o.status === "Delivered");
  }

  get cancelledOrders() {
    return this.orders.filter(
      (o) => o.status === "Cancelled" || o.status === "Rejected",
    );
  }

  async acceptOrder(id: string) {
    const shopId = await this.ensureShopId();
    if (!shopId) return;

    const res = await this.service.updateOrderStatus(shopId, id, "ACCEPTED");
    if (res.ok) {
      runInAction(() => {
        const order = this.orders.find((o) => o.id === id);
        if (order) order.updateStatus("Accepted");
      });
    }
  }

  async rejectOrder(id: string) {
    const shopId = await this.ensureShopId();
    if (!shopId) return;

    const res = await this.service.updateOrderStatus(shopId, id, "CANCELLED");
    if (res.ok) {
      runInAction(() => {
        const order = this.orders.find((o) => o.id === id);
        if (order) order.updateStatus("Rejected");
      });
    }
  }

  async advanceOrder(
    id: string,
    nextApiStatus:
      | "PACKING"
      | "READY_FOR_PICKUP"
      | "OUT_FOR_DELIVERY"
      | "DELIVERED",
  ) {
    const shopId = await this.ensureShopId();
    if (!shopId) return;

    const res = await this.service.updateOrderStatus(shopId, id, nextApiStatus);
    if (res.ok) {
      runInAction(() => {
        const order = this.orders.find((o) => o.id === id);
        if (order) {
          let uiStatus: Order["status"] = "Accepted";
          if (
            nextApiStatus === "PACKING" ||
            nextApiStatus === "READY_FOR_PICKUP"
          )
            uiStatus = "Packed";
          else if (nextApiStatus === "OUT_FOR_DELIVERY")
            uiStatus = "Out For Delivery";
          else if (nextApiStatus === "DELIVERED") uiStatus = "Delivered";
          order.updateStatus(uiStatus);
        }
      });
    }
  }

  assignDeliveryPartner(orderId: string, partnerId: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) order.assignDeliveryPartner(partnerId);
  }

  injectWebSocketOrder(order: any) {
    if (order.order_id) {
      this.orders.unshift(this.mapApiOrderToModel(order));
    } else {
      this.orders.unshift(order instanceof Order ? order : new Order(order));
    }
  }
}

export type OrdersStoreType = OrdersStore;
