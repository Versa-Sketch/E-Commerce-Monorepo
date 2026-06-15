import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { BargainPendingOfferCard } from './BargainPendingOfferCard';
import { scrollContentStyle, trayContainerStyle, trayLabelRowStyle, trayLabelTextStyle } from './styledcomponents';

export const BargainPendingOfferTray: React.FC = observer(() => {
  const { theme } = useTheme();
  const bargainingStore = useBargainingStore();

  const pendingOffers = Object.values(bargainingStore.offersByCartItem).filter(
    (offer) => offer.status === 'PENDING' && offer.offered_by === 'SHOP'
  );

  if (pendingOffers.length === 0) return null;

  const label =
    pendingOffers.length === 1 ? '1 offer awaiting your response' : `${pendingOffers.length} offers awaiting your response`;

  return (
    <View style={[trayContainerStyle, { backgroundColor: theme.colors.surfaceSecondary, borderBottomColor: theme.colors.border }]}>
      <View style={trayLabelRowStyle}>
        <Ionicons name="alert-circle" size={14} color={theme.colors.warning} />
        <Text style={[theme.textPresets.label, trayLabelTextStyle, { color: theme.colors.warning }]}>{label}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={scrollContentStyle}>
        {pendingOffers.map((offer) => (
          <BargainPendingOfferCard key={offer.offer_id} offer={offer} />
        ))}
      </ScrollView>
    </View>
  );
});
export default BargainPendingOfferTray;
