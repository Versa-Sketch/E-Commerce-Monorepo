import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from 'styled-components';
import { Search } from 'lucide-react';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { LoadingWrapper } from '../../../Common/LoadingWrapper';
import { Badge } from '../../../components/Badge';
import { useOrdersStore } from '../../Providers/OrdersProvider';
import { OrderSummaryCards } from '../../Components/OrderSummaryCards';
import { OrdersTable } from '../../Components/OrdersTable';
import { OrderDetailModal } from '../../Components/OrderDetailModal';
import { OrderModel } from '../../Models/OrderModel';
import { ORDER_STATUS_LABELS } from '../../Constants/ordersConstants';
import {
  PageOuter, TableCard, ToolbarRow, ToolbarTitleGroup, ToolbarTitle,
  ToolbarControls, SearchBox, SearchInput, StatusSelect,
} from './styledComponents';

const OrdersRouteComponent = () => {
  const store = useOrdersStore();
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    store.fetchOrders();
  }, [store]);

  const models = store.filteredOrders.map(order => new OrderModel(order));
  const selected = selectedId ? models.find(model => model.getId() === selectedId) ?? null : null;

  return (
    <ErrorBoundary>
      <LoadingWrapper status={store.status}>
        <PageOuter>
          <OrderSummaryCards />

          <TableCard>
            <ToolbarRow>
              <ToolbarTitleGroup>
                <ToolbarTitle>All Orders</ToolbarTitle>
                {store.openDisputeCount > 0 && (
                  <Badge variant="danger" dot>{store.openDisputeCount} disputes</Badge>
                )}
              </ToolbarTitleGroup>
              <ToolbarControls>
                <SearchBox>
                  <Search size={13} color={theme.colors.textMuted} />
                  <SearchInput
                    value={store.searchTerm}
                    onChange={e => store.setSearchTerm(e.target.value)}
                    placeholder="Search orders..."
                  />
                </SearchBox>
                <StatusSelect
                  value={store.statusFilter}
                  onChange={e => store.setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </StatusSelect>
              </ToolbarControls>
            </ToolbarRow>
            <OrdersTable orders={models} onView={order => setSelectedId(order.getId())} />
          </TableCard>

          <OrderDetailModal
            order={selected}
            onClose={() => setSelectedId(null)}
            onIssueRefund={orderId => {
              store.issueRefund(orderId);
              setSelectedId(null);
            }}
          />
        </PageOuter>
      </LoadingWrapper>
    </ErrorBoundary>
  );
};

export const OrdersRoute = observer(OrdersRouteComponent);
