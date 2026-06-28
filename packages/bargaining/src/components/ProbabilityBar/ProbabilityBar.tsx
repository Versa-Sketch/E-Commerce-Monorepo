import React from 'react';
import { Text, View } from 'react-native';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { getProbabilityColors } from '../../utils/probability';
import { formatPercent } from '../../utils/currency';
import { createProbabilityBarStyles } from './styles';

export interface ProbabilityBarProps {
  /** 0-100 */
  probability: number;
  caption?: string;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({ probability, caption }) => {
  const theme = useBargainTheme();
  const styles = createProbabilityBarStyles(theme);
  const colors = getProbabilityColors(theme, probability);
  const clamped = Math.min(100, Math.max(0, probability));

  return (
    <View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: colors.bar }]} />
      </View>
      <Text style={[styles.label, { color: colors.text }]}>
        {formatPercent(clamped)} likely to be accepted{caption ? ` · ${caption}` : ''}
      </Text>
    </View>
  );
};
