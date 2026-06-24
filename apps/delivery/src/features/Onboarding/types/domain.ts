export type OnboardingStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type OnboardingStep =
  | 'IDENTITY'
  | 'ADDRESS'
  | 'KYC'
  | 'VEHICLE'
  | 'BANK'
  | 'SCHEDULE'
  | 'WORK_PREFS'
  | 'EMERGENCY'
  | 'CONSENT'
  | 'SUBMITTED';

export type VehicleType = 'BICYCLE' | 'BIKE' | 'AUTO' | 'VAN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AccountType = 'SAVINGS' | 'CURRENT';
export type MaxLoad = 'LIGHT' | 'MEDIUM' | 'HEAVY';

export interface StepResponseData {
  partner_id: string;
  onboarding_status: OnboardingStatus;
  current_step: OnboardingStep;
  completed_steps: OnboardingStep[];
  rejection_reason?: string | null;
  total_steps: number;
  current_step_number: number;
  completed_steps_count: number;
}

export interface ScheduleDay {
  day: number; // 0=Monday ... 6=Sunday
  is_available: boolean;
  start_time?: string; // 'HH:mm'
  end_time?: string;
}

export interface IdentityForm {
  full_name: string;
  date_of_birth?: string;
  gender?: Gender;
  profile_photo?: PickedDoc | null;
  selfie?: PickedDoc | null;
}

export interface AddressForm {
  home_address: string;
  home_pincode: string;
}

export interface KycForm {
  aadhaar_number: string;
  pan_number: string;
  dl_number?: string;
  aadhaar_front?: PickedDoc | null;
  aadhaar_back?: PickedDoc | null;
  pan?: PickedDoc | null;
}

export interface VehicleForm {
  vehicle_type?: VehicleType;
  vehicle_registration?: string;
  vehicle_make_model?: string;
  vehicle_year?: number;
  vehicle_color?: string;
  dl_expiry?: string;
  insurance_expiry?: string;
  puc_expiry?: string;
  dl_front?: PickedDoc | null;
  dl_back?: PickedDoc | null;
  rc?: PickedDoc | null;
  insurance?: PickedDoc | null;
  puc?: PickedDoc | null;
  vehicle_photo?: PickedDoc | null;
}

export interface BankForm {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type?: AccountType;
  upi_id?: string;
}

export interface WorkPrefsForm {
  max_load?: MaxLoad;
  willing_long_distance?: boolean;
  long_distance_km?: number;
  max_orders_per_shift?: number;
  cod_enabled?: boolean;
  cod_limit_per_order?: number;
  cod_limit_per_day?: number;
}

export interface EmergencyForm {
  emergency_name: string;
  emergency_phone: string;
  emergency_relation?: string;
}

export interface ConsentForm {
  terms_accepted: boolean;
  privacy_accepted: boolean;
  location_accepted: boolean;
  background_check: boolean;
  terms_version?: string;
}

// A document picked via expo-image-picker, not yet uploaded.
export interface PickedDoc {
  uri: string;
  name: string;
  type: string;
  file?: Blob; // web only
}

// ── GET response shapes (used to prefill forms when resuming / going back) ──

export interface IdentityDetail {
  full_name: string;
  date_of_birth: string | null;
  gender: Gender | null;
  profile_photo: string | null;
  selfie?: string | null;
}

export interface AddressDetail {
  home_address: string;
  home_pincode: string;
}

export interface KycDetail {
  aadhaar_number: string;
  aadhaar_verified: boolean;
  pan_number: string;
  pan_verified: boolean;
  dl_number: string | null;
}

export interface VehicleDetail {
  vehicle_type: VehicleType | null;
  vehicle_registration: string | null;
  vehicle_make_model: string | null;
  vehicle_year: number | null;
  vehicle_color: string | null;
  dl_expiry: string | null;
  insurance_expiry: string | null;
  puc_expiry: string | null;
}

export interface BankDetail {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: AccountType;
  upi_id: string | null;
  status: string;
}

export interface WorkPreferenceDetail {
  max_load: MaxLoad;
  willing_long_distance: boolean;
  long_distance_km: number;
  max_orders_per_shift: number;
}

export interface CodDetail {
  cod_enabled: boolean;
  cod_limit_per_order: string | null;
  cod_limit_per_day: string | null;
}

export interface EmergencyDetail {
  emergency_name: string | null;
  emergency_phone: string | null;
  emergency_relation: string | null;
}

export interface ConsentDetail {
  terms_accepted: boolean;
  privacy_accepted: boolean;
  location_accepted: boolean;
  background_check: boolean;
  terms_version: string;
}

export interface DocumentItem {
  doc_type: string;
  file_url: string;
  status: string;
  reject_reason: string | null;
}

// GET /delivery-partners/onboarding/details/ — single combined payload used
// to prefill every step screen on resume (including stepping back to an
// already-completed step in a fresh app session).
export interface OnboardingDetails {
  partner_id: string;
  onboarding_status: OnboardingStatus;
  current_step: OnboardingStep;
  completed_steps: OnboardingStep[];
  total_steps: number;
  current_step_number: number;
  completed_steps_count: number;
  identity: IdentityDetail | null;
  address: AddressDetail | null;
  kyc: KycDetail | null;
  vehicle: VehicleDetail | null;
  bank: BankDetail | null;
  work_preference: WorkPreferenceDetail | null;
  cod: CodDetail;
  schedule: ScheduleDay[];
  emergency: EmergencyDetail | null;
  consent: ConsentDetail | null;
  documents: DocumentItem[];
}

// GET /delivery-partners/onboarding/step/{step}/detail/
export interface StepDetailResponse<T> {
  partner_id: string;
  step: OnboardingStep;
  details: T;
}
