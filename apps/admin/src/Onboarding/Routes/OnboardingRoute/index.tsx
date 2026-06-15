import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { LoadingWrapper } from '../../../Common/LoadingWrapper';
import { Badge } from '../../../components/Badge';
import { useOnboardingStore } from '../../Providers/OnboardingProvider';
import { OnboardingTable } from '../../Components/OnboardingTable';
import { ReviewModal } from '../../Components/ReviewModal';
import type { OnboardingDomain } from '../../types/domain';
import type { ReviewRequestApi } from '../../types/api';
import { ONBOARDING_STATUS_LABELS } from '../../Constants/onboardingConstants';
import { ONBOARDING_STATUSES } from '../../types/api';
import {
  PageOuter, TableCard, ToolbarRow, ToolbarTitleGroup,
  ToolbarTitle, StatusSelect,
} from './styledComponents';

const OnboardingRouteComponent = () => {
  const store = useOnboardingStore();
  const [reviewing, setReviewing] = useState<OnboardingDomain | null>(null);

  useEffect(() => {
    store.fetchOnboardings();
  }, [store]);

  const handleReview = async (shopId: string, body: ReviewRequestApi) => {
    await store.reviewOnboarding(shopId, body);
  };

  return (
    <ErrorBoundary>
      <LoadingWrapper status={store.status}>
        <PageOuter>
          <TableCard>
            <ToolbarRow>
              <ToolbarTitleGroup>
                <ToolbarTitle>Onboarding</ToolbarTitle>
                {store.pendingCount > 0 && (
                  <Badge variant="neutral" dot>{store.pendingCount} pending</Badge>
                )}
                {store.underReviewCount > 0 && (
                  <Badge variant="warning" dot>{store.underReviewCount} under review</Badge>
                )}
              </ToolbarTitleGroup>

              <StatusSelect
                value={store.statusFilter}
                onChange={e => store.setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {ONBOARDING_STATUSES.map(s => (
                  <option key={s} value={s}>{ONBOARDING_STATUS_LABELS[s]}</option>
                ))}
              </StatusSelect>
            </ToolbarRow>

            <OnboardingTable
              onboardings={store.filteredOnboardings}
              onReview={setReviewing}
            />
          </TableCard>

          <ReviewModal
            onboarding={reviewing}
            onClose={() => setReviewing(null)}
            onReview={handleReview}
          />
        </PageOuter>
      </LoadingWrapper>
    </ErrorBoundary>
  );
};

export const OnboardingRoute = observer(OnboardingRouteComponent);
