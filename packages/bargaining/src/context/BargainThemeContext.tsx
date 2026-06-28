import React, { createContext, useContext } from 'react';
import type { BargainTheme } from '../types/theme';
import { defaultBargainTheme } from '../utils/defaultTheme';

const BargainThemeContext = createContext<BargainTheme>(defaultBargainTheme);

export interface BargainThemeProviderProps {
  theme: BargainTheme;
  children: React.ReactNode;
}

/**
 * Wrap a bargaining screen once with the host app's theme (green for customer,
 * orange for merchant, ...). Every component underneath reads it via useBargainTheme
 * instead of needing the theme threaded through every prop list.
 */
export const BargainThemeProvider: React.FC<BargainThemeProviderProps> = ({ theme, children }) => (
  <BargainThemeContext.Provider value={theme}>{children}</BargainThemeContext.Provider>
);

export function useBargainTheme(): BargainTheme {
  return useContext(BargainThemeContext);
}
