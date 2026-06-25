import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { ChatHeader } from '../ChatHeader';
import { PinnedBargainBar } from '../PinnedBargainBar';
import { BargainMessageList } from '../BargainMessageList';
import { ChatInputBar } from '../ChatInputBar';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createBargainChatScreenStyles } from './styles';
import type { BargainChatScreenProps } from './BargainChatScreen.types';

/**
 * Composes header + pinned bargain summary + the message thread + input bar.
 * Does not own a product picker or offer composer sheet — per this package's
 * convention, those are content-only components the host presents in its own
 * bottom sheet (see ProductPickerContent, OfferComposer).
 */
export const BargainChatScreen: React.FC<BargainChatScreenProps> = ({
  header,
  pinned,
  messages,
  viewerParty,
  getActionsForOffer,
  getWaitingLabelForOffer,
  getDealTagForOffer,
  onSendText,
  onAttachPress,
  onChangeInputText,
  inputDisabled,
  inputPlaceholder,
}) => {
  const styles = createBargainChatScreenStyles(useBargainTheme());

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ChatHeader {...header} />

      {pinned ? (
        <PinnedBargainBar product={pinned.product} summary={pinned.summary} expiresAt={pinned.expiresAt} />
      ) : null}

      <View style={{ flex: 1 }}>
        <BargainMessageList
          messages={messages}
          viewerParty={viewerParty}
          getActionsForOffer={getActionsForOffer}
          getWaitingLabelForOffer={getWaitingLabelForOffer}
          getDealTagForOffer={getDealTagForOffer}
        />
      </View>

      <ChatInputBar
        onAttachPress={onAttachPress}
        onSend={onSendText}
        onChangeText={onChangeInputText}
        disabled={inputDisabled}
        placeholder={inputPlaceholder}
      />
    </KeyboardAvoidingView>
  );
};
