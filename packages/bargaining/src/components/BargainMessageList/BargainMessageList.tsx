import React, { useCallback, useRef } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import type { BargainMessage, OfferMessage } from '../../types/message';
import type { BargainParty } from '../../types/role';
import type { BargainOfferActions } from '../../types/actions';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { renderBargainMessage } from './renderBargainMessage';
import { createBargainMessageListStyles } from './styles';

export interface BargainMessageListProps {
  messages: BargainMessage[];
  /** Whose device this is rendering on — decides which bubbles align as "own". */
  viewerParty: BargainParty;
  /** Return actions only for the offer awaiting the viewer's response; omit otherwise. */
  getActionsForOffer?: (message: OfferMessage) => BargainOfferActions | undefined;
  getWaitingLabelForOffer?: (message: OfferMessage) => string | undefined;
  getDealTagForOffer?: (message: OfferMessage) => string | undefined;
}

/**
 * Virtualized, auto-scrolling chat thread. Handles every BargainMessage variant
 * through an exhaustive switch (see renderBargainMessage) so a new message type
 * added to the union surfaces as a compile error here, not a silent gap at runtime.
 */
export const BargainMessageList: React.FC<BargainMessageListProps> = ({
  messages,
  viewerParty,
  getActionsForOffer,
  getWaitingLabelForOffer,
  getDealTagForOffer,
}) => {
  const styles = createBargainMessageListStyles(useBargainTheme());
  const listRef = useRef<FlatList<BargainMessage>>(null);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BargainMessage>) =>
      renderBargainMessage(item, { viewerParty, getActionsForOffer, getWaitingLabelForOffer, getDealTagForOffer }),
    [viewerParty, getActionsForOffer, getWaitingLabelForOffer, getDealTagForOffer]
  );

  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      contentContainerStyle={styles.content}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews
      initialNumToRender={16}
      maxToRenderPerBatch={12}
      windowSize={9}
      showsVerticalScrollIndicator={false}
    />
  );
};
