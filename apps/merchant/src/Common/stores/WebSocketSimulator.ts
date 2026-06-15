import { RootStore } from './RootStore';

export function startWebSocketSimulator(rootStore: RootStore) {
  setInterval(() => {
    rootStore.deliveryStore.simulateMovement();
  }, 1000);
}

export function simulateIncomingWebSocketMessage(
  rootStore: RootStore,
  type: 'order' | 'alert',
) {
  if (type === 'order') {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshOrder = {
      id: orderId,
      customerName: ['Priyanshu Verma', 'Aditi Das', 'Vikram Sen', 'Kavita Patel'][Math.floor(Math.random() * 4)],
      itemsCount: 1,
      items: [
        { id: 'ws-1', name: 'Fresh Hass Avocado (Pack of 2)', quantity: 1, price: 299 },
      ],
      amount: 299,
      paymentMethod: Math.random() > 0.5 ? 'COD' as const : 'Online' as const,
      orderTime: 'Just now',
      status: 'New Orders' as const,
      deliveryAddress: 'Flat 901, Pearl Residency, Outer Ring Road, Bengaluru',
      customerPhone: '+91 99887 11223',
      timeline: [{ status: 'Order Placed', time: 'Just now', completed: true }],
    };
    rootStore.ordersStore.injectWebSocketOrder(freshOrder);
    rootStore.notificationStore.addNotification({
      title: 'New Order Received',
      message: `Received ${orderId} from ${freshOrder.customerName} of amount ₹299.`,
      type: 'new_order',
    });
    rootStore.dashboardStore.refreshMetrics();
  } else if (type === 'alert') {
    rootStore.notificationStore.addNotification({
      title: 'Low Stock Alert',
      message: 'Organic Roma Tomatoes 1kg stock is down to 4 units.',
      type: 'low_stock',
    });
  }
}
