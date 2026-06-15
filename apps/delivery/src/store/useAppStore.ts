import { create } from 'zustand';
import { TripItem } from '../mock';

interface AppState {
  isOnline: boolean;
  isOnboarded: boolean;
  bookedGigIds: string[];
  activeOrder: TripItem | null;
  toggleOnline: () => void;
  setOnboarded: (val: boolean) => void;
  toggleGigBooking: (id: string) => void;
  bookGigs: (ids: string[]) => void;
  setActiveOrder: (order: TripItem | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: false,
  isOnboarded: true,
  bookedGigIds: [],
  activeOrder: null,

  toggleOnline: () => set((s) => ({ isOnline: !s.isOnline })),

  setOnboarded: (val) => set({ isOnboarded: val }),

  toggleGigBooking: (id) =>
    set((s) => ({
      bookedGigIds: s.bookedGigIds.includes(id)
        ? s.bookedGigIds.filter((g) => g !== id)
        : [...s.bookedGigIds, id],
    })),

  bookGigs: (ids) =>
    set((s) => {
      const existing = new Set(s.bookedGigIds);
      ids.forEach((id) => existing.add(id));
      return { bookedGigIds: Array.from(existing) };
    }),

  setActiveOrder: (order) => set({ activeOrder: order }),
}));
