import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import type { OnboardingDomain } from '../../types/domain';
import type { ReviewRequestApi } from '../../types/api';
import { ONBOARDING_STATUS_LABELS, ONBOARDING_STATUS_VARIANTS } from '../../Constants/onboardingConstants';
import {
  InfoGrid, InfoItem, InfoLabel, InfoValue,
  ActionRow, ActionBtn,
  ReasonLabel, ReasonTextarea,
  FooterRow,
} from './styledComponents';

export interface ReviewModalProps {
  onboarding: OnboardingDomain | null;
  onClose: () => void;
  onReview: (shopId: string, body: ReviewRequestApi) => Promise<void>;
}

type Decision = 'approved' | 'rejected' | null;

export const ReviewModal = ({ onboarding, onClose, onReview }: ReviewModalProps) => {
  const [decision, setDecision] = useState<Decision>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setDecision(null);
    setReason('');
    setError(null);
    onClose();
  };

  const canSubmit =
    decision !== null && (decision === 'approved' || reason.trim().length > 0);

  const handleSubmit = async () => {
    if (!onboarding || !decision) return;
    setLoading(true);
    setError(null);
    try {
      const body: ReviewRequestApi =
        decision === 'rejected'
          ? { status: 'rejected', reason: reason.trim() }
          : { status: 'approved' };
      await onReview(onboarding.shopId, body);
      handleClose();
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <Modal
      open={!!onboarding}
      onClose={handleClose}
      title="Review Onboarding"
      width={500}
    >
      {onboarding && (
        <div>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Shop Name</InfoLabel>
              <InfoValue>{onboarding.shopName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Owner</InfoLabel>
              <InfoValue>{onboarding.ownerName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{onboarding.ownerPhone}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Business Type</InfoLabel>
              <InfoValue style={{ textTransform: 'capitalize' }}>{onboarding.businessType}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Current Step</InfoLabel>
              <InfoValue>{onboarding.currentStep}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Current Status</InfoLabel>
              <InfoValue>
                <Badge variant={ONBOARDING_STATUS_VARIANTS[onboarding.status]} dot>
                  {ONBOARDING_STATUS_LABELS[onboarding.status]}
                </Badge>
              </InfoValue>
            </InfoItem>
            <InfoItem style={{ gridColumn: '1 / -1' }}>
              <InfoLabel>Submitted At</InfoLabel>
              <InfoValue>{fmt.format(onboarding.submittedAt)}</InfoValue>
            </InfoItem>
          </InfoGrid>

          <ActionRow>
            <ActionBtn
              $variant="approve"
              $active={decision === 'approved'}
              onClick={() => setDecision('approved')}
            >
              ✓ Approve
            </ActionBtn>
            <ActionBtn
              $variant="reject"
              $active={decision === 'rejected'}
              onClick={() => setDecision('rejected')}
            >
              ✕ Reject
            </ActionBtn>
          </ActionRow>

          {decision === 'rejected' && (
            <>
              <ReasonLabel>Rejection Reason *</ReasonLabel>
              <ReasonTextarea
                placeholder="Provide a reason for rejection…"
                value={reason}
                onChange={e => setReason(e.target.value)}
                autoFocus
              />
            </>
          )}

          {error && (
            <p style={{ fontSize: 13, color: '#ef4444', margin: '0 0 12px' }}>{error}</p>
          )}

          <FooterRow>
            <Button variant="outline" size="md" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={loading}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </FooterRow>
        </div>
      )}
    </Modal>
  );
};
