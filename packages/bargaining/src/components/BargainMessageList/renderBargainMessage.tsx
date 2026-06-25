import React from 'react';
import type { BargainMessage, OfferMessage } from '../../types/message';
import type { BargainParty } from '../../types/role';
import type { BargainOfferActions } from '../../types/actions';
import { DateDivider } from '../DateDivider';
import { MessageBubble } from '../MessageBubble';
import { ProductCard } from '../ProductCard';
import { OfferBubble } from '../OfferBubble';
import { TypingIndicator } from '../TypingIndicator';
import { ResolvedCard } from '../ResolvedCard';

export interface RenderBargainMessageOptions {
  viewerParty: BargainParty;
  getActionsForOffer?: (message: OfferMessage) => BargainOfferActions | undefined;
  getWaitingLabelForOffer?: (message: OfferMessage) => string | undefined;
  getDealTagForOffer?: (message: OfferMessage) => string | undefined;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled bargain message type: ${JSON.stringify(value)}`);
}

export function renderBargainMessage(message: BargainMessage, options: RenderBargainMessageOptions): React.ReactElement {
  const { viewerParty, getActionsForOffer, getWaitingLabelForOffer, getDealTagForOffer } = options;

  switch (message.type) {
    case 'date':
      return <DateDivider label={message.label} />;

    case 'text':
      return <MessageBubble text={message.text} isOwn={message.sender === viewerParty} />;

    case 'product':
      return <ProductCard product={message.product} isOwn={message.sender === viewerParty} />;

    case 'offer':
      return (
        <OfferBubble
          product={message.product}
          price={message.price}
          probability={message.probability}
          variant={message.variant}
          isOwn={message.sender === viewerParty}
          actions={message.resolved ? undefined : getActionsForOffer?.(message)}
          waitingLabel={getWaitingLabelForOffer?.(message)}
          dealTag={getDealTagForOffer?.(message)}
        />
      );

    case 'typing':
      return <TypingIndicator name={message.name} />;

    case 'resolved':
      return <ResolvedCard outcome={message.outcome} text={message.text} />;

    default:
      return assertNever(message);
  }
}
