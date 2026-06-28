import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { useAuthStore } from '../../../Auth/Providers/useAuthStore';
import { Button } from '../../../../Common/components/ui/Button';
import { Input } from '../../../../Common/components/ui/Input';
import { containerStyle, inputWrapperStyle, quickActionsRowStyle, sendButtonStyle, wrapperStyle } from './styledcomponents';

const TYPING_TIMEOUT_MS = 1500;

interface BargainMessageInputProps {
  onMakeOffer: () => void;
}

export const BargainMessageInput: React.FC<BargainMessageInputProps> = observer(({ onMakeOffer }) => {
  const { theme } = useTheme();
  const bargainingStore = useBargainingStore();
  const authStore = useAuthStore();
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disabled = !bargainingStore.isActive;

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleChangeText = (value: string) => {
    setText(value);
    bargainingStore.setTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      bargainingStore.setTyping(false);
    }, TYPING_TIMEOUT_MS);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    bargainingStore.sendChatMessage(
      trimmed,
      authStore.currentUser?.id,
      authStore.currentUser?.name,
    );
    setText('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    bargainingStore.setTyping(false);
  };

  const canSend = !disabled && text.trim().length > 0;

  return (
    <View style={[wrapperStyle, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      {!disabled && (
        <View style={quickActionsRowStyle}>
          <Button
            label="Make new offer"
            onPress={onMakeOffer}
            size="sm"
            variant="outline"
            leftIcon={<Ionicons name="pricetag-outline" size={14} color={theme.colors.primary} />}
          />
        </View>
      )}
      <View style={containerStyle}>
        <View style={inputWrapperStyle}>
          <Input value={text} onChangeText={handleChangeText} placeholder={disabled ? 'Session ended' : 'Type a message…'} />
        </View>
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={[sendButtonStyle, { backgroundColor: canSend ? theme.colors.primary : theme.colors.surfaceSecondary }]}
        >
          <Ionicons name="send" size={18} color={canSend ? theme.colors.surface : theme.colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
});
export default BargainMessageInput;
