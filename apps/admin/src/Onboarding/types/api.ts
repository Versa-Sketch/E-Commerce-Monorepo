export const ONBOARDING_STATUSES = ['pending', 'under_review', 'approved', 'rejected'] as const;

export interface OnboardingApi {
  shop_id: string;
  shop_name: string;
  owner_name: string;
  owner_phone: string;
  business_type: string;
  status: (typeof ONBOARDING_STATUSES)[number];
  current_step: string;
  submitted_at: string;
  onboarding_id: string;
}

export interface OnboardingDetailApi {
  onboarding_id: string;
  status: (typeof ONBOARDING_STATUSES)[number];
  business_type: string;
  current_step: string;
  completed_steps: string[];
  rejection_reason: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  shop: {
    id: string;
    name: string;
    phone_number: string;
    description: string;
    is_verified: boolean;
  };
  owner: {
    id: string;
    full_name: string;
    phone_number: string;
  };
  address: {
    address_line1: string;
    address_line2: string;
    state: string;
    pincode: string;
  };
  bank: {
    bank_account_name: string;
    bank_account_number: string;
    bank_ifsc_code: string;
    bank_name: string;
    bank_branch: string;
    cancelled_cheque_or_passbook: string;
  };
  address_proof: {
    type: string;
    document: string;
  };
  store_photos: {
    store_front_photo: string;
    store_interior_photo: string;
    signature_photo: string;
  };
  kyc: {
    pan_card: string;
    aadhaar_card: string;
    gst_certificate: string;
    msme_certificate: string;
    trade_license: string;
  };
}

export interface ReviewRequestApi {
  status: 'approved' | 'rejected';
  reason?: string;
}
