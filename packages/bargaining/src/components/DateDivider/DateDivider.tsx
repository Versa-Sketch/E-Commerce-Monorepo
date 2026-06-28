import React from 'react';
import { Text } from 'react-native';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createDateDividerStyles } from './styles';

export interface DateDividerProps {
  label: string;
}

const DateDividerBase: React.FC<DateDividerProps> = ({ label }) => {
  const styles = createDateDividerStyles(useBargainTheme());
  return <Text style={styles.label}>{label}</Text>;
};

export const DateDivider = React.memo(DateDividerBase);
