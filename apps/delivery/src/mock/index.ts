export const mockDP = {
  name: 'Chenna Kiran Kumar',
  firstName: 'Kiran',
  phone: '+91 98765 43210',
  isOnboarded: true,
  isNearStore: false,
  aadhaarMasked: 'XXXXXXXX4926',
  panMasked: 'ITXXXXXX6B',
  joiningFee: 1500,
  joiningFeeStatus: 'ongoing' as const,
  storeAddress: 'Gf, Tirumala Platinum, H.no 1-73/JH/TP/, Janardhana hills, Gachibowli, Ranga Reddy, Telangana - 500032',
};

export const mockWallet = {
  pocketBalance: 0,
  availableCashLimit: 375,
  tipsBalance: 0,
  weeklyEarnings: 0,
  weekLabel: '1 Jun – 7 Jun',
};

export const mockEarnings = {
  today: { amount: 0, orders: 0, timeOnOrder: '00:00' },
  week: {
    amount: 0,
    label: '01 Jun – 07 Jun',
    days: [
      { label: '1', value: 0 },
      { label: '2', value: 0 },
      { label: '3', value: 0 },
      { label: '4', value: 0 },
      { label: '5', value: 0 },
      { label: '6', value: 0 },
      { label: '7', value: 0 },
    ],
  },
  month: {
    label: 'April',
    amount: 100,
    orders: 1,
    timeOnOrder: '00:17',
    weeks: [
      { label: '1–5', value: 0 },
      { label: '6–12', value: 0 },
      { label: '13–19', value: 0 },
      { label: '20–26', value: 0 },
      { label: '27–30', value: 100 },
    ],
  },
};

export type GigItem = {
  id: string;
  group: string;
  groupTime: string;
  groupIcon: 'evening' | 'dinner';
  start: string;
  end: string;
  payLow: number;
  payHigh: number;
  oldPayLow?: number;
  oldPayHigh?: number;
  label?: string;
  labelColor?: string;
  recommended?: boolean;
};

export const mockGigs: GigItem[] = [
  { id: 'g1', group: 'Evening Gigs', groupTime: '3:00pm–7:00pm', groupIcon: 'evening', start: '3:00pm', end: '4:00pm', payLow: 45, payHigh: 55, oldPayLow: 40, oldPayHigh: 50, label: 'Free Gig: No min. login hours required', labelColor: 'orange', recommended: false },
  { id: 'g2', group: 'Evening Gigs', groupTime: '3:00pm–7:00pm', groupIcon: 'evening', start: '4:00pm', end: '5:00pm', payLow: 65, payHigh: 85, oldPayLow: 60, oldPayHigh: 80, recommended: false },
  { id: 'g3', group: 'Evening Gigs', groupTime: '3:00pm–7:00pm', groupIcon: 'evening', start: '5:00pm', end: '6:00pm', payLow: 65, payHigh: 85, oldPayLow: 60, oldPayHigh: 80, recommended: false },
  { id: 'g4', group: 'Evening Gigs', groupTime: '3:00pm–7:00pm', groupIcon: 'evening', start: '6:00pm', end: '7:00pm', payLow: 45, payHigh: 70, recommended: false },
  { id: 'g5', group: 'Dinner Gigs', groupTime: '7:00pm–12:00am', groupIcon: 'dinner', start: '7:00pm', end: '9:00pm', payLow: 80, payHigh: 115, recommended: true },
  { id: 'g6', group: 'Dinner Gigs', groupTime: '7:00pm–12:00am', groupIcon: 'dinner', start: '9:00pm', end: '10:00pm', payLow: 70, payHigh: 90, recommended: false },
  { id: 'g7', group: 'Dinner Gigs', groupTime: '7:00pm–12:00am', groupIcon: 'dinner', start: '10:00pm', end: '11:00pm', payLow: 80, payHigh: 100, recommended: false },
  { id: 'g8', group: 'Dinner Gigs', groupTime: '7:00pm–12:00am', groupIcon: 'dinner', start: '11:00pm', end: '12:00am', payLow: 80, payHigh: 100, recommended: false },
];

export type TripItem = {
  id: string;
  store: string;
  time: string;
  date: string;
  earnings: number;
  cashCollected: number;
  status: 'completed' | 'incomplete';
  badges: string[];
  denialReason?: string;
  orderNumber?: string;
};

export const mockTrips: TripItem[] = [
  { id: 't1', store: 'Hotel Sri Lakshmi Sai', time: '10:03pm', date: '27 Apr 2026', earnings: 100, cashCollected: 0, status: 'completed', badges: [] },
  { id: 't2', store: 'Hotel Babu Biryani Point', time: '10:23pm', date: '27 Apr 2026', earnings: 0, cashCollected: 0, status: 'incomplete', badges: ['incomplete', 'denial'], denialReason: 'Personal Emergency', orderNumber: '8053274047' },
  { id: 't3', store: 'Dawat Biryani House', time: '10:23pm', date: '27 Apr 2026', earnings: 0, cashCollected: 0, status: 'incomplete', badges: ['incomplete', 'denial'] },
];

export const mockHelpTopics = [
  'Past order related issues',
  'Payout issues',
  'Update Profile Details',
  'Cash deposit issues',
  'EV Issues',
  'Incentive/Offers Issue',
  'Bag/T-Shirt/Raincoat Center',
  'App issues',
  'PAN Aadhaar Linkage Issue',
  'Voucher related issues',
  'Others',
];
