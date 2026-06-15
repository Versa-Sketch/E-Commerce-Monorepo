import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ArrowLeft } from 'lucide-react';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { LoadingWrapper } from '../../../Common/LoadingWrapper';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { useOnboardingStore } from '../../Providers/OnboardingProvider';
import type { ReviewRequestApi } from '../../types/api';
import { ONBOARDING_STATUS_LABELS, ONBOARDING_STATUS_VARIANTS } from '../../Constants/onboardingConstants';
import {
  PageOuter, PageHeader, BackBtn, PageTitle,
  SectionGrid, Card, CardFull, CardHeader, CardBody,
  InfoGrid, InfoItem, InfoLabel, InfoValue, InfoValueMono, EmptyValue,
  DocGrid, DocItem, DocLabel, DocImg, DocEmpty,
  StepsList, StepPill,
  ReviewSection, ReviewTitle, ActionRow, ActionBtn,
  ReasonLabel, ReasonTextarea, ErrorText, SuccessText,
} from './styledComponents';

type Decision = 'approved' | 'rejected' | null;

const ALL_STEPS = ['SHOP_DETAILS', 'BUSINESS_TYPE', 'IDENTITY_DOCS', 'COMPLIANCE_DOCS', 'BANK_DETAILS', 'ADDRESS_PROOF', 'STORE_PHOTOS'];

const val = (v: string | null | undefined) =>
  v ? <InfoValue>{v}</InfoValue> : <EmptyValue>—</EmptyValue>;

const monoVal = (v: string | null | undefined) =>
  v ? <InfoValueMono>{v}</InfoValueMono> : <EmptyValue>—</EmptyValue>;

const DocCard = ({ label, url }: { label: string; url: string }) => (
  <DocItem>
    <DocLabel>{label}</DocLabel>
    {url
      ? <DocImg href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={label} /></DocImg>
      : <DocEmpty>No document</DocEmpty>
    }
  </DocItem>
);

const isReviewable = (status: string) => status === 'pending' || status === 'under_review';

const OnboardingDetailRouteComponent = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [decision, setDecision] = useState<Decision>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (shopId) store.fetchOnboardingDetail(shopId);
    return () => store.clearSelected();
  }, [shopId, store]);

  const o = store.selectedOnboarding;
  const canSubmit = decision !== null && (decision === 'approved' || reason.trim().length > 0);

  const handleSubmit = async () => {
    if (!o || !decision) return;
    setLoading(true);
    setError(null);
    try {
      const body: ReviewRequestApi =
        decision === 'rejected'
          ? { status: 'rejected', reason: reason.trim() }
          : { status: 'approved' };
      await store.reviewOnboarding(o.shop.id, body);
      setSubmitted(true);
      setDecision(null);
      setReason('');
      if (shopId) store.fetchOnboardingDetail(shopId);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <LoadingWrapper status={store.detailStatus}>
        <PageOuter>
          <PageHeader>
            <BackBtn onClick={() => navigate('/onboarding')}><ArrowLeft size={14} /> Back</BackBtn>
            {o && (
              <>
                <PageTitle>{o.shop.name}</PageTitle>
                <Badge variant={ONBOARDING_STATUS_VARIANTS[o.status]} dot>
                  {ONBOARDING_STATUS_LABELS[o.status]}
                </Badge>
                {o.shop.isVerified && <Badge variant="success">Verified</Badge>}
              </>
            )}
          </PageHeader>

          {o && (
            <>
              <SectionGrid>
                {/* Shop Details */}
                <Card>
                  <CardHeader>Shop Details</CardHeader>
                  <CardBody>
                    <InfoGrid>
                      <InfoItem><InfoLabel>Shop Name</InfoLabel>{val(o.shop.name)}</InfoItem>
                      <InfoItem><InfoLabel>Phone</InfoLabel>{monoVal(o.shop.phone)}</InfoItem>
                      <InfoItem><InfoLabel>Business Type</InfoLabel>{val(o.businessType)}</InfoItem>
                      <InfoItem><InfoLabel>Description</InfoLabel>{val(o.shop.description)}</InfoItem>
                    </InfoGrid>
                  </CardBody>
                </Card>

                {/* Owner Details */}
                <Card>
                  <CardHeader>Owner Details</CardHeader>
                  <CardBody>
                    <InfoGrid>
                      <InfoItem><InfoLabel>Full Name</InfoLabel>{val(o.owner.fullName)}</InfoItem>
                      <InfoItem><InfoLabel>Phone</InfoLabel>{monoVal(o.owner.phone)}</InfoItem>
                      <InfoItem><InfoLabel>Owner ID</InfoLabel>{monoVal(o.owner.id)}</InfoItem>
                    </InfoGrid>
                  </CardBody>
                </Card>

                {/* Address */}
                <Card>
                  <CardHeader>Address</CardHeader>
                  <CardBody>
                    <InfoGrid>
                      <InfoItem><InfoLabel>Line 1</InfoLabel>{val(o.address.line1)}</InfoItem>
                      <InfoItem><InfoLabel>Line 2</InfoLabel>{val(o.address.line2)}</InfoItem>
                      <InfoItem><InfoLabel>State</InfoLabel>{val(o.address.state)}</InfoItem>
                      <InfoItem><InfoLabel>Pincode</InfoLabel>{monoVal(o.address.pincode)}</InfoItem>
                    </InfoGrid>
                  </CardBody>
                </Card>

                {/* Bank Details */}
                <Card>
                  <CardHeader>Bank Details</CardHeader>
                  <CardBody>
                    <InfoGrid>
                      <InfoItem><InfoLabel>Account Name</InfoLabel>{val(o.bank.accountName)}</InfoItem>
                      <InfoItem><InfoLabel>Account Number</InfoLabel>{monoVal(o.bank.accountNumber)}</InfoItem>
                      <InfoItem><InfoLabel>IFSC Code</InfoLabel>{monoVal(o.bank.ifsc)}</InfoItem>
                      <InfoItem><InfoLabel>Bank Name</InfoLabel>{val(o.bank.bankName)}</InfoItem>
                      <InfoItem><InfoLabel>Branch</InfoLabel>{val(o.bank.branch)}</InfoItem>
                    </InfoGrid>
                    {o.bank.chequeUrl && (
                      <div style={{ marginTop: 14 }}>
                        <DocLabel>Cancelled Cheque / Passbook</DocLabel>
                        <DocImg href={o.bank.chequeUrl} target="_blank" rel="noopener noreferrer" style={{ maxWidth: 180, marginTop: 6 }}>
                          <img src={o.bank.chequeUrl} alt="Cheque" />
                        </DocImg>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* KYC Documents */}
                <Card>
                  <CardHeader>KYC Documents</CardHeader>
                  <CardBody>
                    <DocGrid>
                      <DocCard label="PAN Card" url={o.kyc.panCard} />
                      <DocCard label="Aadhaar Card" url={o.kyc.aadhaarCard} />
                      <DocCard label="GST Certificate" url={o.kyc.gst} />
                      <DocCard label="MSME Certificate" url={o.kyc.msme} />
                      <DocCard label="Trade License" url={o.kyc.tradeLicense} />
                    </DocGrid>
                  </CardBody>
                </Card>

                {/* Address Proof */}
                <Card>
                  <CardHeader>Address Proof</CardHeader>
                  <CardBody>
                    <InfoGrid style={{ marginBottom: 14 }}>
                      <InfoItem>
                        <InfoLabel>Document Type</InfoLabel>
                        {val(o.addressProof.type.replace(/_/g, ' '))}
                      </InfoItem>
                    </InfoGrid>
                    <DocGrid>
                      <DocCard label="Document" url={o.addressProof.documentUrl} />
                    </DocGrid>
                  </CardBody>
                </Card>

                {/* Store Photos */}
                <CardFull>
                  <CardHeader>Store Photos</CardHeader>
                  <CardBody>
                    <DocGrid>
                      <DocCard label="Store Front" url={o.storePhotos.frontUrl} />
                      <DocCard label="Store Interior" url={o.storePhotos.interiorUrl} />
                      <DocCard label="Signature" url={o.storePhotos.signatureUrl} />
                    </DocGrid>
                  </CardBody>
                </CardFull>

                {/* Onboarding Progress */}
                <CardFull>
                  <CardHeader>Onboarding Progress</CardHeader>
                  <CardBody>
                    <InfoGrid style={{ marginBottom: 14 }}>
                      <InfoItem><InfoLabel>Current Step</InfoLabel>{val(o.currentStep)}</InfoItem>
                      <InfoItem><InfoLabel>Onboarding ID</InfoLabel>{monoVal(o.onboardingId)}</InfoItem>
                      {o.rejectionReason && (
                        <InfoItem style={{ gridColumn: '1 / -1' }}>
                          <InfoLabel>Rejection Reason</InfoLabel>
                          <InfoValue style={{ color: '#ef4444' }}>{o.rejectionReason}</InfoValue>
                        </InfoItem>
                      )}
                    </InfoGrid>
                    <StepsList>
                      {ALL_STEPS.map(step => (
                        <StepPill key={step} $done={o.completedSteps.includes(step)}>
                          {o.completedSteps.includes(step) ? '✓' : '○'} {step.replace(/_/g, ' ')}
                        </StepPill>
                      ))}
                    </StepsList>
                  </CardBody>
                </CardFull>
              </SectionGrid>

              {/* Review */}
              {isReviewable(o.status) && !submitted && (
                <ReviewSection>
                  <ReviewTitle>Review Application</ReviewTitle>
                  <ActionRow>
                    <ActionBtn $variant="approve" $active={decision === 'approved'} onClick={() => setDecision('approved')}>✓ Approve</ActionBtn>
                    <ActionBtn $variant="reject" $active={decision === 'rejected'} onClick={() => setDecision('rejected')}>✕ Reject</ActionBtn>
                  </ActionRow>
                  {decision === 'rejected' && (
                    <>
                      <ReasonLabel>Rejection Reason *</ReasonLabel>
                      <ReasonTextarea placeholder="Provide a reason for rejection…" value={reason} onChange={e => setReason(e.target.value)} autoFocus />
                    </>
                  )}
                  {error && <ErrorText>{error}</ErrorText>}
                  <Button variant="primary" size="md" loading={loading} disabled={!canSubmit} onClick={handleSubmit}>
                    Confirm Decision
                  </Button>
                </ReviewSection>
              )}

              {submitted && (
                <ReviewSection>
                  <SuccessText>✓ Review submitted. Status updated to <strong>{ONBOARDING_STATUS_LABELS[o.status]}</strong>.</SuccessText>
                </ReviewSection>
              )}
            </>
          )}
        </PageOuter>
      </LoadingWrapper>
    </ErrorBoundary>
  );
};

export const OnboardingDetailRoute = observer(OnboardingDetailRouteComponent);
