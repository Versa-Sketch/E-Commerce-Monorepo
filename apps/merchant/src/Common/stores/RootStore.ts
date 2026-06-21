import { makeAutoObservable } from 'mobx';
import { SessionStore } from '../../Auth/Store';
import { OnboardingStore } from '../../Onboarding/Store';
import { ShopSetupStore } from '../../ShopSetup/Store';
import { AuthStore } from '../../Settings/Store';
import { DashboardStore } from '../../Home/Store';
import { OrdersStore } from '../../Orders/Store';
import { ProductsStore } from '../../Products/Store';
import { InventoryStore } from '../../Inventory/Store';
import { BargainingStore } from '../../Bargaining/Store';
import { DeliveryStore } from '../../Delivery/Store';
import { PaymentsStore } from '../../Payments/Store';
import { AnalyticsStore } from '../../Analytics/Store';
import { CustomersStore } from '../../Customers/Store';
import { NotificationStore } from '../../Notifications/Store';
import { SupportStore } from '../../Support/Store';

export class RootStore {
  sessionStore = new SessionStore();
  onboardingStore: OnboardingStore;
  shopSetupStore: ShopSetupStore;
  authStore: AuthStore;
  dashboardStore: DashboardStore;
  ordersStore: OrdersStore;
  productsStore: ProductsStore;
  inventoryStore: InventoryStore;
  bargainingStore: BargainingStore;
  deliveryStore = new DeliveryStore();
  paymentsStore = new PaymentsStore();
  analyticsStore: AnalyticsStore;
  customersStore = new CustomersStore();
  notificationStore = new NotificationStore();
  supportStore = new SupportStore();

  constructor() {
    this.authStore = new AuthStore(this.sessionStore);
    this.onboardingStore = new OnboardingStore(this.sessionStore);
    this.shopSetupStore = new ShopSetupStore(this.sessionStore);
    this.productsStore = new ProductsStore(this.sessionStore);
    this.inventoryStore = new InventoryStore(this.sessionStore);
    this.bargainingStore = new BargainingStore(this.sessionStore);
    this.ordersStore = new OrdersStore(this.sessionStore);
    this.dashboardStore = new DashboardStore(this.sessionStore);
    this.analyticsStore = new AnalyticsStore(this.sessionStore);
    makeAutoObservable(this);
    // Restore session from AsyncStorage on app start
    this.sessionStore.initializeFromAsyncStorage().catch(() => {});
  }
}

export type RootStoreInstance = RootStore;
