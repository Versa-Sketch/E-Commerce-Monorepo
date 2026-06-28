import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Plus, Send } from 'lucide-react-native';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createChatInputBarStyles } from './styles';

export interface ChatInputBarProps {
  onAttachPress: () => void;
  onSend: (text: string) => void;
  /** Optional — lets a host broadcast typing presence without owning the input's state. */
  onChangeText?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onAttachPress,
  onSend,
  onChangeText,
  placeholder = 'Type a message…',
  disabled = false,
}) => {
  const theme = useBargainTheme();
  const styles = createChatInputBarStyles(theme);
  const [text, setText] = useState('');

  const handleChangeText = (value: string) => {
    setText(value);
    onChangeText?.(value);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.iconButton, styles.attachButton]}
        onPress={onAttachPress}
        disabled={disabled}
        accessibilityLabel="Attach a product"
      >
        <Plus size={16} color={theme.colors.onPrimary} />
      </Pressable>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        editable={!disabled}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <Pressable
        style={[styles.iconButton, styles.plainButton]}
        onPress={handleSend}
        disabled={disabled}
        accessibilityLabel="Send message"
      >
        <Send size={14} color={theme.colors.text} />
      </Pressable>
    </View>
  );
};
