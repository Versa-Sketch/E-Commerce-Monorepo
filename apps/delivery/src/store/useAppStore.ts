import { makeAutoObservable } from 'mobx';
import { TripItem } from '../mock';
import { DeliveryOffer, AcceptedOrderData } from '../types/dispatch';

class AppStore {
  isOnline = true;
  bookedGigIds: string[] = [];
  activeOrder: TripItem | null = null;
  pendingOffer: DeliveryOffer | null = {
    offer_id: 'fixture-offer-001',
    order_id: 'fixture-order-001',
    round_number: 1,
    shop_name: 'Fresh Mart',
    pickup_distance_km: 1.8,
    drop_distance_km: 4.2,
    order_value: '350.00',
    items_count: 4,
    expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
  };
  activeOrderDetail: AcceptedOrderData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  toggleOnline() {
    this.isOnline = !this.isOnline;
  }

  toggleGigBooking(id: string) {
    if (this.bookedGigIds.includes(id)) {
      this.bookedGigIds = this.bookedGigIds.filter((g) => g !== id);
    } else {
      this.bookedGigIds = [...this.bookedGigIds, id];
    }
  }

  bookGigs(ids: string[]) {
    const merged = new Set(this.bookedGigIds);
    ids.forEach((id) => merged.add(id));
    this.bookedGigIds = Array.from(merged);
  }

  setActiveOrder(order: TripItem | null) {
    this.activeOrder = order;
  }

  setPendingOffer(offer: DeliveryOffer | null) {
    this.pendingOffer = offer;
  }

  setActiveOrderDetail(data: AcceptedOrderData | null) {
    this.activeOrderDetail = data;
  }
}

export const appStore = new AppStore();
