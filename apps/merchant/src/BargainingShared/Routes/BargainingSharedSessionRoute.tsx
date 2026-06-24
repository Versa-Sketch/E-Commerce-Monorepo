import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { BargainHeader, ChatList, MessageInput, secondsRemaining, TypingIndicator } from '@monorepo/bargaining';
import { Colors } from '../../theme/colors';
import { merchantBargainingStore as store } from '../store';

export default observer(function BargainingSharedSessionRoute() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  useEffect(() => {
    if (sessionId) store.loadSession(sessionId).catch(() => {});
  }, [sessionId]);

  const session = store.currentSession;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BargainHeader
        counterpartyName={session?.counterpartyName ?? 'Customer'}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceElevated },
});
