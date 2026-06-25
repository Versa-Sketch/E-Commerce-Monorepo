import React, { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import {
  BargainChatScreen,
  BargainThemeProvider,
  createBargainTheme,
  estimateLinearProbability,
  OfferComposer,
  ProductPickerContent,
  type BargainMessage,
  type BargainOfferActions,
  type BargainProduct,
  type OfferMessage,
} from '@monorepo/bargaining';
import { MOCK_PRODUCTS } from './_bargainPreview.mockData';

/**
 * Dev-only preview of the @monorepo/bargaining package, simulating a session
 * entirely on-device (no store, no socket). Not linked from app navigation —
 * open it directly at /dev-preview/bargain-chat. Safe to delete once the real
 * screens are migrated to this package, or kept around as a living style guide.
 */
export default function BargainChatPreviewScreen() {
  const { theme } = useTheme();
  const bargainTheme = createBargainTheme({
    primary: theme.colors.primary,
    primaryDark: theme.colors.deepPrimary,
    primaryLight: theme.colors.accentSoft,
  });

  const idRef = useRef(0);
  const nextId = useCallback(() => `m${++idRef.current}`, []);

  const [messages, setMessages] = useState<BargainMessage[]>([
    { id: nextId(), type: 'date', label: 'Today, 2:02 PM', timestamp: Date.now() },
    { id: nextId(), type: 'text', sender: 'buyer', text: 'Hi! Is the ANC headphones still available?', timestamp: Date.now() },
    { id: nextId(), type: 'text', sender: 'seller', text: 'Yes! Brand new, sealed box.', timestamp: Date.now() },
  ]);
  const [pinned, setPinned] = useState<{ product: BargainProduct; summary: string; expiresAt?: number } | null>(null);
  const [awaitingOfferId, setAwaitingOfferId] = useState<string | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [composerProduct, setComposerProduct] = useState<BargainProduct | null>(null);

  const append = useCallback((message: BargainMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSelectProduct = useCallback((product: BargainProduct) => {
    setPickerOpen(false);
    setComposerProduct(product);
  }, []);

  const handleSendOpeningOffer = useCallback(
    (price: number) => {
      const product = composerProduct;
      if (!product) return;
      setComposerProduct(null);

      const min = Math.round(product.listedPrice * 0.5);
      const probability = estimateLinearProbability(price, min, product.listedPrice);
      append({ id: nextId(), type: 'product', sender: 'buyer', product, timestamp: Date.now() });
      append({ id: nextId(), type: 'offer', sender: 'buyer', variant: 'offer', product, price, probability, timestamp: Date.now() });
      setPinned({ product, summary: `${product.name} · offer sent ${formatRupee(price)}`, expiresAt: Date.now() + 4 * 60 * 1000 + 18 * 1000 });

      const typingId = nextId();
      append({ id: typingId, type: 'typing', name: 'Seller', timestamp: Date.now() });
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== typingId));
        const counterPrice = Math.round(product.listedPrice * 0.86);
        const counterId = nextId();
        append({ id: nextId(), type: 'text', sender: 'seller', text: "Thanks for the interest — here's my best:", timestamp: Date.now() });
        append({
          id: counterId,
          type: 'offer',
          sender: 'seller',
          variant: 'counter',
          product,
          price: counterPrice,
          probability: estimateLinearProbability(counterPrice, min, product.listedPrice),
          timestamp: Date.now(),
        });
        setPinned({
          product,
          summary: `${product.name} · ${formatRupee(price)} → countered ${formatRupee(counterPrice)}`,
          expiresAt: Date.now() + 4 * 60 * 1000 + 18 * 1000,
        });
        setAwaitingOfferId(counterId);
      }, 1400);
    },
    [append, composerProduct, nextId]
  );

  const resolveOffer = useCallback(
    (outcome: 'accepted' | 'declined', text: string) => {
      append({ id: nextId(), type: 'resolved', outcome, text, timestamp: Date.now() });
      setPinned(null);
      setAwaitingOfferId(null);
      setInputDisabled(true);
    },
    [append, nextId]
  );

  const getActionsForOffer = useCallback(
    (message: OfferMessage): BargainOfferActions | undefined => {
      if (message.id !== awaitingOfferId) return undefined;
      return {
        onAccept: () => resolveOffer('accepted', `Deal closed at ${formatRupee(message.price)}`),
        onDecline: () => resolveOffer('declined', 'Offer declined · you can try a new offer'),
        onCounter: () => setComposerProduct(message.product),
      };
    },
    [awaitingOfferId, resolveOffer]
  );

  return (
    <BargainThemeProvider theme={bargainTheme}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <BargainChatScreen
          header={{ name: 'Urban Gadgets', showStoreIcon: true, online: true }}
          pinned={pinned}
          messages={messages}
          viewerParty="buyer"
          getActionsForOffer={getActionsForOffer}
          onSendText={(text) => append({ id: nextId(), type: 'text', sender: 'buyer', text, timestamp: Date.now() })}
          onAttachPress={() => setPickerOpen(true)}
          inputDisabled={inputDisabled}
        />

        <Modal visible={pickerOpen} animationType="slide" transparent onRequestClose={() => setPickerOpen(false)}>
          <View style={styles.sheetBackdrop}>
            <View style={styles.sheetCard}>
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetTitle}>Select a product</Text>
                <Pressable onPress={() => setPickerOpen(false)}>
                  <Text style={styles.sheetClose}>Close</Text>
                </Pressable>
              </View>
              <ProductPickerContent products={MOCK_PRODUCTS} onSelectProduct={handleSelectProduct} />
            </View>
          </View>
        </Modal>

        <Modal
          visible={!!composerProduct}
          animationType="slide"
          transparent
          onRequestClose={() => setComposerProduct(null)}
        >
          <View style={styles.sheetBackdrop}>
            <View style={styles.sheetCard}>
              {composerProduct ? (
                <OfferComposer
                  product={composerProduct}
                  min={Math.round(composerProduct.listedPrice * 0.5)}
                  max={composerProduct.listedPrice}
                  initialPrice={Math.round(composerProduct.listedPrice * 0.76)}
                  presets={[
                    { label: '-24%', price: Math.round(composerProduct.listedPrice * 0.76) },
                    { label: '-15%', price: Math.round(composerProduct.listedPrice * 0.85) },
                    { label: '-10%', price: Math.round(composerProduct.listedPrice * 0.9) },
                  ]}
                  getProbability={(price) =>
                    estimateLinearProbability(price, Math.round(composerProduct.listedPrice * 0.5), composerProduct.listedPrice)
                  }
                  onSend={handleSendOpeningOffer}
                />
              ) : null}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </BargainThemeProvider>
  );
}

function formatRupee(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15,23,42,0.5)',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 28,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sheetClose: {
    fontSize: 13,
    color: '#6B7280',
  },
});
