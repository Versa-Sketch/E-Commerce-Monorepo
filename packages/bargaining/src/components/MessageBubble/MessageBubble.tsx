import React from 'react';
import { Text, View } from 'react-native';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createMessageBubbleStyles } from './styles';

export interface MessageBubbleProps {
  text: string;
  /** True when the viewer sent this message — aligns right and tints the bubble. */
  isOwn: boolean;
}

const MessageBubbleBase: React.FC<MessageBubbleProps> = ({ text, isOwn }) => {
  const styles = createMessageBubbleStyles(useBargainTheme());
  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

export const MessageBubble = React.memo(MessageBubbleBase);
