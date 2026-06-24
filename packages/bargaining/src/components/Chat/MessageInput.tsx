import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../colors';

interface Props {
  onSend: (text: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export function MessageInput({ onSend, onTypingChange }: Props) {
  const [text, setText] = useState('');

  function handleChange(value: string) {
    setText(value);
    onTypingChange?.(value.length > 0);
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    onTypingChange?.(false);
  }

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChange}
        placeholder="Type a message…"
        placeholderTextColor={Colors.textSecondary}
        multiline
      />
      <TouchableOpacity style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]} onPress={handleSend} disabled={!text.trim()}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  input: {
    flex: 1, maxHeight: 100, backgroundColor: Colors.surfaceElevated, borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: Colors.textPrimary,
  },
  sendBtn: { backgroundColor: Colors.primary, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10 },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
});
