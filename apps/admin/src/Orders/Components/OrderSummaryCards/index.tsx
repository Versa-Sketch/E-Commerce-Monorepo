import { observer } from 'mobx-react-lite';
import { useTheme } from 'styled-components';
import { useOrdersStore } from '../../Providers/OrdersProvider';
import { SummaryRow, SummaryCard, SummaryValue, SummaryLabel } from './styledComponents';

export const OrderSummaryCards = observer(() => {
  const store = useOrdersStore();
  const theme = useTheme();

  const cards = [
    { label: 'Total Orders', value: store.totalCount, color: theme.colors.textPrimary },
    { label: 'Delivered', value: store.deliveredCount, color: theme.colors.success },
    { label: 'Active', value: store.activeCount, color: theme.colors.info },
    { label: 'Open Disputes', value: store.openDisputeCount, color: theme.colors.danger },
  ];

  return (
    <SummaryRow>
      {cards.map(card => (
        <SummaryCard key={card.label}>
          <SummaryValue $color={card.color}>{card.value}</SummaryValue>
          <SummaryLabel>{card.label}</SummaryLabel>
        </SummaryCard>
      ))}
    </SummaryRow>
  );
});
