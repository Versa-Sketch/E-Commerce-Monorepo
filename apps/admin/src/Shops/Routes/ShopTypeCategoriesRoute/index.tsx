import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Plus } from 'lucide-react';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { LoadingWrapper } from '../../../Common/LoadingWrapper';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useShopTypeCategoriesStore } from '../../Providers/ShopTypeCategoriesProvider';
import { CategoriesTable } from '../../Components/CategoriesTable';
import { AddCategoriesModal } from '../../Components/AddCategoriesModal';
import {
  PageOuter, TableCard, ToolbarRow, TitleGroup, Title, Subtitle,
  StatsRow, StatCard, StatValue, StatLabel,
} from './styledComponents';

const ShopTypeCategoriesRouteComponent = () => {
  const { shopTypeId = '' } = useParams<{ shopTypeId: string }>();
  const store = useShopTypeCategoriesStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (shopTypeId) store.fetchCategories(shopTypeId);
  }, [store, shopTypeId]);

  return (
    <ErrorBoundary>
      <LoadingWrapper status={store.status} error={store.error ?? undefined}>
        <PageOuter>
          <StatsRow>
            <StatCard>
              <StatValue>{store.totalCount}</StatValue>
              <StatLabel>Mapped Categories</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{store.primaryCategories.length}</StatValue>
              <StatLabel>Primary Categories</StatLabel>
            </StatCard>
          </StatsRow>

          <TableCard>
            <ToolbarRow>
              <TitleGroup>
                <Title>Categories</Title>
                <Subtitle>Shop Type: {shopTypeId}</Subtitle>
                {store.primaryCategories.length > 0 && (
                  <Badge variant="success" dot>{store.primaryCategories.length} primary</Badge>
                )}
              </TitleGroup>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setModalOpen(true)}
              >
                Map Categories
              </Button>
            </ToolbarRow>

            <CategoriesTable />
          </TableCard>

          <AddCategoriesModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </PageOuter>
      </LoadingWrapper>
    </ErrorBoundary>
  );
};

export const ShopTypeCategoriesRoute = observer(ShopTypeCategoriesRouteComponent);
