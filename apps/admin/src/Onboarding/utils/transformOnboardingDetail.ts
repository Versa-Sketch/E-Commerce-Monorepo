import type { OnboardingDetailApi } from '../types/api';
import type { OnboardingDetailDomain } from '../types/domain';

export const transformOnboardingDetail = (api: OnboardingDetailApi): OnboardingDetailDomain => ({
  onboardingId: api.onboarding_id,
  status: api.status,
  businessType: api.business_type,
  currentStep: api.current_step,
  completedSteps: api.completed_steps,
  rejectionReason: api.rejection_reason,
  reviewedAt: api.reviewed_at ? new Date(api.reviewed_at) : null,
  reviewedBy: api.reviewed_by,
  shop: {
    id: api.shop.id,
    name: api.shop.name,
    phone: api.shop.phone_number,
    description: api.shop.description,
    isVerified: api.shop.is_verified,
  },
  owner: {
    id: api.owner.id,
    fullName: api.owner.full_name,
    phone: api.owner.phone_number,
  },
  address: {
    line1: api.address.address_line1,
    line2: api.address.address_line2,
    state: api.address.state,
    pincode: api.address.pincode,
  },
  bank: {
    accountName: api.bank.bank_account_name,
    accountNumber: api.bank.bank_account_number,
    ifsc: api.bank.bank_ifsc_code,
    bankName: api.bank.bank_name,
    branch: api.bank.bank_branch,
    chequeUrl: api.bank.cancelled_cheque_or_passbook,
  },
  addressProof: {
    type: api.address_proof.type,
    documentUrl: api.address_proof.document,
  },
  storePhotos: {
    frontUrl: api.store_photos.store_front_photo,
    interiorUrl: api.store_photos.store_interior_photo,
    signatureUrl: api.store_photos.signature_photo,
  },
  kyc: {
    panCard: api.kyc.pan_card,
    aadhaarCard: api.kyc.aadhaar_card,
    gst: api.kyc.gst_certificate,
    msme: api.kyc.msme_certificate,
    tradeLicense: api.kyc.trade_license,
  },
});
