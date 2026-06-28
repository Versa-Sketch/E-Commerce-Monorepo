import React from 'react';
import { Text, View } from 'react-native';
import { Check, X, Clock } from 'lucide-react-native';
import type { BargainOutcome } from '../../types/message';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createResolvedCardStyles } from './styles';

export interface ResolvedCardProps {
  outcome: BargainOutcome;
  text: string;
}

const ResolvedCardBase: React.FC<ResolvedCardProps> = ({ outcome, text }) => {
  const theme = useBargainTheme();
  const styles = createResolvedCardStyles(theme);

  const tone = {
    accepted: { bg: theme.colors.successBackground, fg: theme.colors.success, Icon: Check },
    declined: { bg: theme.colors.dangerBackground, fg: theme.colors.danger, Icon: X },
    expired: { bg: theme.colors.surfaceSecondary, fg: theme.colors.textSecondary, Icon: Clock },
  }[outcome];

  return (
    <View style={[styles.row, { backgroundColor: tone.bg }]}>
      <tone.Icon size={15} color={tone.fg} />
      <Text style={[styles.text, { color: tone.fg }]}>{text}</Text>
    </View>
  );
};

export const ResolvedCard = React.memo(ResolvedCardBase);
