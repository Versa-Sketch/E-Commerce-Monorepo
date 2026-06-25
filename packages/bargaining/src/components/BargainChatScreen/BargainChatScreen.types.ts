import type { ReactNode } from 'react';
import type { BargainMessage, OfferMessage } from '../../types/message';
import type { BargainParty } from '../../types/role';
import type { BargainProduct } from '../../types/product';
import type { BargainOfferActions } from '../../types/actions';

export interface BargainChatHeaderConfig {
  name: string;
  avatarImageUrl?: string;
  showStoreIcon?: boolean;
  initials?: string;
  online?: boolean;
  onBack?: () => void;
  rightSlot?: ReactNode;
}

export interface BargainChatPinnedConfig {
  product: BargainProduct;
  summary: string;
  expiresAt?: number;
}

export interface BargainChatScreenProps {
  header: BargainChatHeaderConfig;
  /** Omit once there's no active bargain to surface above the thread. */
  pinned?: BargainChatPinnedConfig | null;
  messages: BargainMessage[];
  viewerParty: BargainParty;
  getActionsForOffer?: (message: OfferMessage) => BargainOfferActions | undefined;
  getWaitingLabelForOffer?: (message: OfferMessage) => string | undefined;
  getDealTagForOffer?: (message: OfferMessage) => string | undefined;
  onSendText: (text: string) => void;
  onAttachPress: () => void;
  /** Optional — e.g. to broadcast typing presence over a socket. */
  onChangeInputText?: (text: string) => void;
  inputDisabled?: boolean;
  inputPlaceholder?: string;
}
