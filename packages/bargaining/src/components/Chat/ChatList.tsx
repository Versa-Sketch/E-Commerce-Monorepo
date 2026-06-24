import React from 'react';
import { FlatList } from 'react-native';
import { BargainMessage } from '../../types/domain';
import { ChatBubble } from './ChatBubble';

interface Props {
  messages: BargainMessage[];
  ownSenderId: string;
}

export function ChatList({ messages, ownSenderId }: Props) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(m) => m.messageId}
      renderItem={({ item }) => <ChatBubble message={item} isOwn={item.senderId === ownSenderId} />}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}
