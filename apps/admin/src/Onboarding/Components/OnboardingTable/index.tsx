import { ClipboardCheck, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table/types';
import type { OnboardingDomain } from '../../types/domain';
import {
  ONBOARDING_STATUS_LABELS,
  ONBOARDING_STATUS_VARIANTS,
} from '../../Constants/onboardingConstants';
import { PhoneText, BusinessTypePill, DateText, StepText } from './styledComponents';

export interface OnboardingTableProps {
  onboardings: OnboardingDomain[];
  onReview: (onboarding: OnboardingDomain) => void;
}

const fmt = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const asRow = (row: Record<string, unknown>) => row as unknown as OnboardingDomain;

const isReviewable = (status: OnboardingDomain['status']) =>
  status === 'pending' || status === 'under_review';

export const OnboardingTable = ({ onboardings, onReview }: OnboardingTableProps) => {
  const navigate = useNavigate();
  const columns: Column<Record<string, unknown>>[] = [
    {
      id: 'shopName',
      key: 'shopName',
      header: 'Shop Name',
      width: 160,
      sortable: true,
      render: (_, row) => asRow(row).shopName,
    },
    {
      id: 'ownerName',
      key: 'ownerName',
      header: 'Owner',
      width: 140,
      sortable: true,
      render: (_, row) => asRow(row).ownerName,
    },
    {
      id: 'ownerPhone',
      key: 'ownerPhone',
      header: 'Phone',
      width: 130,
      render: (_, row) => <PhoneText>{asRow(row).ownerPhone}</PhoneText>,
    },
    {
      id: 'businessType',
      key: 'businessType',
      header: 'Type',
      width: 110,
      render: (_, row) => <BusinessTypePill>{asRow(row).businessType}</BusinessTypePill>,
    },
    {
      id: 'currentStep',
      key: 'currentStep',
      header: 'Step',
      width: 120,
      render: (_, row) => <StepText>{asRow(row).currentStep}</StepText>,
    },
    {
      id: 'submittedAt',
      key: 'submittedAt',
      header: 'Submitted',
      width: 150,
      sortable: true,
      render: (_, row) => <DateText>{fmt.format(asRow(row).submittedAt)}</DateText>,
    },
    {
      id: 'status',
      key: 'status',
      header: 'Status',
      width: 130,
      render: (_, row) => {
        const o = asRow(row);
        return (
          <Badge variant={ONBOARDING_STATUS_VARIANTS[o.status]} dot>
            {ONBOARDING_STATUS_LABELS[o.status]}
          </Badge>
        );
      },
    },
    {
      id: 'view',
      key: 'view',
      header: '',
      width: 70,
      render: (_, row) => {
        const o = asRow(row);
        return (
          <Button
            size="sm"
            variant="ghost"
            icon={<Eye size={13} />}
            onClick={() => navigate(`/onboarding/${o.shopId}`)}
          >
            View
          </Button>
        );
      },
    },
    {
      id: 'review',
      key: 'review',
      header: '',
      width: 90,
      render: (_, row) => {
        const o = asRow(row);
        return (
          <Button
            size="sm"
            variant="ghost"
            icon={<ClipboardCheck size={13} />}
            onClick={() => onReview(o)}
            disabled={!isReviewable(o.status)}
          >
            Review
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={onboardings as unknown as Record<string, unknown>[]}
      emptyMessage="No onboarding submissions found."
    />
  );
};
