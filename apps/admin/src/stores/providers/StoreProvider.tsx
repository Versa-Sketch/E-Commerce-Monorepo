import { ThemeProvider } from '@/UI/ThemeProvider';

export interface StoreProviderProps {
  children: React.ReactNode;
}

// Composes the global, app-wide providers. Feature stores are not created
// here — they live in per-feature providers scoped to their routes, since
// nothing in this app currently needs cross-feature shared state.
export const StoreProvider = ({ children }: StoreProviderProps) => (
  <ThemeProvider>{children}</ThemeProvider>
);
