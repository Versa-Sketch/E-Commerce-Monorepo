import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from './theme';
let themeStorage: any;
try {
  const { MMKV } = require('react-native-mmkv');
  themeStorage = new MMKV({ id: 'localio-theme-storage' });
} catch (e) {
  themeStorage = {
    getString: () => null,
    set: () => {},
  };
}
type ThemeType = 'light' | 'dark' | 'system';
interface ThemeContextProps {
  theme: AppTheme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  isDark: boolean;
}
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeType, setThemeTypeState] = useState<ThemeType>('light');
  useEffect(() => {
    const savedTheme = themeStorage.getString('user-theme') as ThemeType | undefined;
    if (savedTheme) {
      setThemeTypeState(savedTheme);
    } else {
      setThemeTypeState('light');
    }
  }, []);
  const setThemeType = (type: ThemeType) => {
    setThemeTypeState(type);
    themeStorage.set('user-theme', type);
  };
  const activeScheme = themeType === 'system' ? systemScheme : themeType;
  const isDark = activeScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
