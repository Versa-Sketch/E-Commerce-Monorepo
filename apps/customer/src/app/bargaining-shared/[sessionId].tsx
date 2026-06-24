import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { BargainHeader, ChatList, MessageInput, secondsRemaining, TypingIndicator } from '@monorepo/bargaining';
import { useTheme } from '../../theme/ThemeContext';
import { customerBargainingStore as store } from '@/features/BargainingShared/store';

export default observer(function BargainingSharedSession() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  useEffect(() => {
    if (sessionId) store.loadSession(sessionId).catch(() => {});
  }, [sessionId]);

  const session = store.currentSession;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BargainHeader
        counterpartyName={session?.counterpartyName ?? 'Shop'}
        secondsLeft={secondsRemaining(session?.expiresAt ?? null)}
        connectionStatus={store.connectionStatus}
        onBack={() => router.back()}
        onEndSession={() => store.endSession()}
      />
      {session ? (
        <>
          <View style={{ flex: 1 }}>
            <ChatList messages={session.messages} ownSenderId="self" />
          </View>
          <TypingIndicator visible={session.isTyping} />
          <MessageInput
            onSend={(text) => store.sendChatMessage(text)}
            onTypingChange={(isTyping) => store.setTyping(isTyping)}
          />
        </>
      ) : null}
    </KeyboardAvoidingView>
  );
});
