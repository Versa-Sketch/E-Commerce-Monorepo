import { format, subDays } from 'date-fns';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── Revenue trend (30 days) ─────────────────────────────────────────────────
export const revenueTrend = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM d'),
  revenue: randomInt(80000, 220000),
  orders: randomInt(300, 900),
}));

// ── Category GMV ────────────────────────────────────────────────────────────
export const categoryGMV = [
  { name: 'Grocery',     value: 420000, color: '#10B981' },
  { name: 'Food',        value: 310000, color: '#F59E0B' },
  { name: 'Medicine',    value: 180000, color: '#3B82F6' },
  { name: 'Electronics', value: 150000, color: '#8B5CF6' },
  { name: 'Clothing',    value: 120000, color: '#EC4899' },
  { name: 'Others',      value:  80000, color: '#6B7280' },
];

// ── KPI Stats ────────────────────────────────────────────────────────────────
export const kpiStats = {
  mau: 48320,
  mauChange: +12.4,
  gmv: 1260000,
  gmvChange: +8.7,
  orders: 18740,
  ordersChange: +5.2,
  fulfillmentRate: 94.6,
  fulfillmentChange: +1.1,
  avgDeliveryTime: 28,
  deliveryChange: -3.2,
  activeStores: 284,
  storesChange: +22,
  openDisputes: 17,
  disputesChange: -4,
  pendingPayouts: 142000,
  payoutsChange: +18000,
};

// ── Stores ───────────────────────────────────────────────────────────────────
const CATEGORIES = ['Grocery', 'Medicine', 'Clothing', 'Food', 'Electronics', 'Others'] as const;
const STORE_STATUSES = ['active', 'pending', 'suspended'] as const;

export interface Store {
  id: string;
  name: string;
  owner: string;
  category: typeof CATEGORIES[number];
  city: string;
  status: typeof STORE_STATUSES[number];
  rating: number;
  orders: number;
  commission: number;
  createdAt: string;
  gstin: string;
}

export const stores: Store[] = [
  { id: 'S001', name: 'FreshMart Superstore', owner: 'Rahul Mehta', category: 'Grocery',     city: 'Mumbai',    status: 'active',    rating: 4.7, orders: 1240, commission: 8,  createdAt: '2025-11-12', gstin: '27AAAAA0000A1Z5' },
  { id: 'S002', name: 'MedPlus Pharmacy',     owner: 'Priya Sharma', category: 'Medicine',    city: 'Delhi',     status: 'active',    rating: 4.9, orders: 890,  commission: 6,  createdAt: '2025-12-01', gstin: '07BBBBB0000B1Z3' },
  { id: 'S003', name: 'Zara Fashion Hub',     owner: 'Anjali Singh', category: 'Clothing',    city: 'Bangalore', status: 'pending',   rating: 0,   orders: 0,    commission: 12, createdAt: '2026-06-05', gstin: '29CCCCC0000C1Z1' },
  { id: 'S004', name: 'Spice Garden',         owner: 'Vikram Nair',  category: 'Food',        city: 'Chennai',   status: 'active',    rating: 4.5, orders: 2100, commission: 10, createdAt: '2025-10-20', gstin: '33DDDDD0000D1Z9' },
  { id: 'S005', name: 'TechZone Electronics', owner: 'Karan Patel',  category: 'Electronics', city: 'Pune',      status: 'suspended', rating: 3.2, orders: 340,  commission: 9,  createdAt: '2025-09-18', gstin: '27EEEEE0000E1Z7' },
  { id: 'S006', name: 'GreenLeaf Organics',   owner: 'Sneha Rao',    category: 'Grocery',     city: 'Hyderabad', status: 'active',    rating: 4.8, orders: 980,  commission: 8,  createdAt: '2026-01-15', gstin: '36FFFFF0000F1Z5' },
  { id: 'S007', name: 'QuickMeds',            owner: 'Arjun Das',    category: 'Medicine',    city: 'Kolkata',   status: 'pending',   rating: 0,   orders: 0,    commission: 6,  createdAt: '2026-06-06', gstin: '19GGGGG0000G1Z3' },
  { id: 'S008', name: 'TrendSetters',         owner: 'Meera Joshi',  category: 'Clothing',    city: 'Ahmedabad', status: 'active',    rating: 4.3, orders: 560,  commission: 12, createdAt: '2025-08-30', gstin: '24HHHHH0000H1Z1' },
];

// ── Customers ─────────────────────────────────────────────────────────────────
export interface Customer {
  id: string; name: string; phone: string; city: string;
  orders: number; totalSpend: number; wallet: number;
  bargainFailures: number; status: 'active' | 'suspended' | 'flagged';
  joinedAt: string;
}

export const customers: Customer[] = [
  { id: 'C001', name: 'Rohit Kumar',   phone: '+91 98765 43210', city: 'Mumbai',    orders: 84,  totalSpend: 42000, wallet: 500,  bargainFailures: 0, status: 'active',    joinedAt: '2025-08-10' },
  { id: 'C002', name: 'Sanya Kapoor',  phone: '+91 91234 56789', city: 'Chennai',   orders: 56,  totalSpend: 28000, wallet: 0,    bargainFailures: 2, status: 'flagged',   joinedAt: '2025-10-22' },
  { id: 'C003', name: 'Dev Malhotra',  phone: '+91 87654 32109', city: 'Delhi',     orders: 120, totalSpend: 68000, wallet: 1200, bargainFailures: 0, status: 'active',    joinedAt: '2025-07-05' },
  { id: 'C004', name: 'Pooja Nair',    phone: '+91 99887 76655', city: 'Ahmedabad', orders: 32,  totalSpend: 15000, wallet: 200,  bargainFailures: 3, status: 'suspended', joinedAt: '2026-01-18' },
  { id: 'C005', name: 'Ajay Singh',    phone: '+91 77665 54433', city: 'Mumbai',    orders: 7,   totalSpend: 3200,  wallet: 0,    bargainFailures: 1, status: 'active',    joinedAt: '2026-05-30' },
  { id: 'C006', name: 'Nisha Verma',   phone: '+91 66554 43322', city: 'Hyderabad', orders: 48,  totalSpend: 22000, wallet: 750,  bargainFailures: 0, status: 'active',    joinedAt: '2025-11-14' },
];

// ── Delivery Partners ─────────────────────────────────────────────────────────
export interface DeliveryPartner {
  id: string; name: string; phone: string; store: string; city: string;
  status: 'active' | 'offline' | 'on_delivery';
  deliveries: number; rating: number; joinedAt: string;
}

export const deliveryPartners: DeliveryPartner[] = [
  { id: 'DP001', name: 'Arjun Kumar',   phone: '+91 90001 11111', store: 'FreshMart',    city: 'Mumbai',    status: 'on_delivery', deliveries: 840, rating: 4.8, joinedAt: '2025-09-01' },
  { id: 'DP002', name: 'Suresh Nair',   phone: '+91 90002 22222', store: 'Spice Garden', city: 'Chennai',   status: 'active',      deliveries: 620, rating: 4.6, joinedAt: '2025-10-15' },
  { id: 'DP003', name: 'Rahul Tiwari',  phone: '+91 90003 33333', store: 'MedPlus',      city: 'Delhi',     status: 'offline',     deliveries: 310, rating: 4.3, joinedAt: '2026-01-20' },
  { id: 'DP004', name: 'Karthik Raja',  phone: '+91 90004 44444', store: 'GreenLeaf',    city: 'Hyderabad', status: 'active',      deliveries: 1200,rating: 4.9, joinedAt: '2025-08-08' },
  { id: 'DP005', name: 'Deepak Sharma', phone: '+91 90005 55555', store: 'FreshMart',    city: 'Mumbai',    status: 'on_delivery', deliveries: 480, rating: 4.5, joinedAt: '2025-12-01' },
];

// ── Bargain Requests ──────────────────────────────────────────────────────────
export interface BargainRequest {
  id: string; customer: string; store: string; product: string;
  originalPrice: number; proposedPrice: number; counterPrice: number | null;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'paid';
  failureCount: number; createdAt: string; expiresAt: string;
}

export const bargainRequests: BargainRequest[] = [
  { id: 'BR001', customer: 'Sanya Kapoor', store: 'FreshMart',  product: 'Organic Oats 1kg',  originalPrice: 280, proposedPrice: 220, counterPrice: 250, status: 'accepted', failureCount: 2, createdAt: '2026-06-07 10:20', expiresAt: '2026-06-07 12:20' },
  { id: 'BR002', customer: 'Dev Malhotra', store: 'TechZone',   product: 'USB-C Hub 7-in-1',  originalPrice: 1200,proposedPrice: 900, counterPrice: null,status: 'pending',  failureCount: 0, createdAt: '2026-06-07 11:00', expiresAt: '2026-06-07 13:00' },
  { id: 'BR003', customer: 'Pooja Nair',   store: 'TrendSetters',product: 'Summer Kurti M',   originalPrice: 850, proposedPrice: 600, counterPrice: 750, status: 'expired',  failureCount: 3, createdAt: '2026-06-06 14:30', expiresAt: '2026-06-06 16:30' },
  { id: 'BR004', customer: 'Ajay Singh',   store: 'Spice Garden',product: 'Biryani Family Pack',originalPrice:480, proposedPrice: 380, counterPrice: 430, status: 'paid',     failureCount: 1, createdAt: '2026-06-06 18:00', expiresAt: '2026-06-06 20:00' },
];

// ── Bargain Fine Config ───────────────────────────────────────────────────────
export const bargainFineConfig = [
  { category: 'Grocery',     fine: 50  },
  { category: 'Medicine',    fine: 100 },
  { category: 'Food',        fine: 75  },
  { category: 'Clothing',    fine: 150 },
  { category: 'Electronics', fine: 200 },
  { category: 'Others',      fine: 50  },
];

// ── Support Tickets ───────────────────────────────────────────────────────────
export interface SupportTicket {
  id: string; customer: string; subject: string;
  category: 'Missing Item' | 'Wrong Item' | 'Refund' | 'Bargaining Fine' | 'General';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string; slaDue: string; orderId: string;
}

export const supportTickets: SupportTicket[] = [
  { id: 'TKT-001', customer: 'Nisha Verma',  subject: 'Missing item in grocery order',       category: 'Missing Item',    status: 'open',        priority: 'high',   createdAt: '2026-06-07 09:15', slaDue: '2026-06-07 21:15', orderId: 'ORD-7816' },
  { id: 'TKT-002', customer: 'Ramesh Patil', subject: 'Wrong product delivered — electronics',category: 'Wrong Item',     status: 'in_progress', priority: 'urgent', createdAt: '2026-06-07 08:00', slaDue: '2026-06-07 20:00', orderId: 'ORD-7815' },
  { id: 'TKT-003', customer: 'Pooja Nair',   subject: 'Bargaining fine dispute',              category: 'Bargaining Fine', status: 'escalated',   priority: 'medium', createdAt: '2026-06-06 15:00', slaDue: '2026-06-09 15:00', orderId: '' },
  { id: 'TKT-004', customer: 'Rohit Kumar',  subject: 'Refund not received',                  category: 'Refund',          status: 'resolved',    priority: 'low',    createdAt: '2026-06-05 12:00', slaDue: '2026-06-07 12:00', orderId: 'ORD-7817' },
];

// ── Payouts ───────────────────────────────────────────────────────────────────
export interface Payout {
  id: string; store: string; amount: number; commission: number;
  net: number; status: 'pending' | 'processing' | 'paid' | 'failed';
  method: string; scheduledFor: string;
}

export const payouts: Payout[] = [
  { id: 'PAY-101', store: 'FreshMart Superstore', amount: 84200, commission: 6736, net: 77464, status: 'pending',    method: 'NEFT', scheduledFor: '2026-06-08' },
  { id: 'PAY-102', store: 'Spice Garden',         amount: 52000, commission: 5200, net: 46800, status: 'processing', method: 'NEFT', scheduledFor: '2026-06-08' },
  { id: 'PAY-103', store: 'MedPlus Pharmacy',     amount: 38400, commission: 2304, net: 36096, status: 'paid',       method: 'IMPS', scheduledFor: '2026-06-07' },
  { id: 'PAY-104', store: 'TrendSetters',         amount: 21600, commission: 2592, net: 19008, status: 'failed',     method: 'UPI',  scheduledFor: '2026-06-07' },
  { id: 'PAY-105', store: 'GreenLeaf Organics',   amount: 48000, commission: 3840, net: 44160, status: 'pending',    method: 'NEFT', scheduledFor: '2026-06-09' },
];

// ── Activity Feed ─────────────────────────────────────────────────────────────
export const activityFeed = [
  { id: 1, type: 'store_approved',  message: 'Store "QuickMeds" approved and now live',           time: '2 min ago',  color: '#10B981' },
  { id: 2, type: 'dispute_raised',  message: 'Dispute raised on ORD-7815 by Ramesh Patil',        time: '14 min ago', color: '#EF4444' },
  { id: 3, type: 'payout_sent',     message: 'Payout ₹36,096 sent to MedPlus Pharmacy',           time: '28 min ago', color: '#10B981' },
  { id: 4, type: 'bargain_fine',    message: 'Fine ₹150 applied to Pooja Nair (3rd offence)',     time: '1 hr ago',   color: '#F59E0B' },
  { id: 5, type: 'store_suspended', message: 'Store "TechZone Electronics" suspended by admin',   time: '2 hr ago',   color: '#EF4444' },
  { id: 6, type: 'order_spike',     message: 'Order volume spike detected — 1,200 orders/hour',   time: '3 hr ago',   color: '#3B82F6' },
  { id: 7, type: 'new_store',       message: 'New store application: "Zara Fashion Hub", Bangalore', time: '4 hr ago', color: '#8B5CF6' },
];
