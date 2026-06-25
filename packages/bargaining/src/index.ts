// Theme
export { BargainThemeProvider, useBargainTheme } from './context/BargainThemeContext';
export { createBargainTheme, defaultBargainTheme } from './utils/defaultTheme';

// Hooks
export { useCountdown } from './hooks/useCountdown';
export type { UseCountdownResult } from './hooks/useCountdown';

// Utils
export { formatCurrency, formatPercent } from './utils/currency';
export { getProbabilityTone, getProbabilityColors, estimateLinearProbability } from './utils/probability';

// Leaf components
export { ProductPhoto } from './components/ProductPhoto';
export type { ProductPhotoProps } from './components/ProductPhoto';
export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';
export { DateDivider } from './components/DateDivider';
export type { DateDividerProps } from './components/DateDivider';
export { MessageBubble } from './components/MessageBubble';
export type { MessageBubbleProps } from './components/MessageBubble';
export { ProductCard } from './components/ProductCard';
export type { ProductCardProps } from './components/ProductCard';
export { ProbabilityBar } from './components/ProbabilityBar';
export type { ProbabilityBarProps } from './components/ProbabilityBar';
export { ActionRow } from './components/ActionRow';
export type { ActionRowProps } from './components/ActionRow';
export { TypingIndicator } from './components/TypingIndicator';
export type { TypingIndicatorProps } from './components/TypingIndicator';
export { ResolvedCard } from './components/ResolvedCard';
export type { ResolvedCardProps } from './components/ResolvedCard';
export { ChatInputBar } from './components/ChatInputBar';
export type { ChatInputBarProps } from './components/ChatInputBar';
export { ProductPickerTile } from './components/ProductPickerTile';
export type { ProductPickerTileProps } from './components/ProductPickerTile';

// Composite components
export { OfferBubble } from './components/OfferBubble';
export type { OfferBubbleProps } from './components/OfferBubble';
export { ChatHeader } from './components/ChatHeader';
export type { ChatHeaderProps } from './components/ChatHeader';
export { PinnedBargainBar } from './components/PinnedBargainBar';
export type { PinnedBargainBarProps } from './components/PinnedBargainBar';
export { ProductPickerContent } from './components/ProductPickerContent';
export type { ProductPickerContentProps } from './components/ProductPickerContent';
export { OfferComposer } from './components/OfferComposer';
export type { OfferComposerProps, OfferComposerPreset } from './components/OfferComposer';
export { BargainMessageList } from './components/BargainMessageList';
export type { BargainMessageListProps } from './components/BargainMessageList';
export { BargainChatScreen } from './components/BargainChatScreen';
export type {
  BargainChatScreenProps,
  BargainChatHeaderConfig,
  BargainChatPinnedConfig,
} from './components/BargainChatScreen';

// Types
export type {
  BargainTheme,
  BargainThemeColors,
  BargainThemeSpacing,
  BargainThemeBorderRadius,
  BargainRole,
  BargainParty,
  BargainProduct,
  BargainProductIcon,
  BargainMessage,
  BargainOutcome,
  DateDividerMessage,
  TextMessage,
  ProductMessage,
  OfferMessage,
  TypingMessage,
  ResolvedMessage,
  BargainOfferActions,
} from './types';
export { partyForRole } from './types';
