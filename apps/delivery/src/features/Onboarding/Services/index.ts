import { http } from '../../../services/http';
import {
  AddressForm,
  BankForm,
  ConsentForm,
  EmergencyForm,
  IdentityForm,
  KycForm,
  OnboardingDetails,
  OnboardingStep,
  PickedDoc,
  ScheduleDay,
  StepDetailResponse,
  StepResponseData,
  VehicleForm,
  WorkPrefsForm,
} from '../types/domain';
import { STEP_SLUG } from '../utils/stepSlug';

const BASE = '/delivery-partners/onboarding';

export const OnboardingService = {
  async saveIdentity(form: IdentityForm): Promise<StepResponseData> {
    const res = await http.postFormData<StepResponseData>(
      `${BASE}/step/identity/`,
      { full_name: form.full_name, date_of_birth: form.date_of_birth, gender: form.gender },
      { profile_photo: form.profile_photo, selfie: form.selfie }
    );
    return res.data;
  },

  async saveAddress(form: AddressForm): Promise<StepResponseData> {
    const res = await http.post<StepResponseData>(`${BASE}/step/address/`, { ...form });
    return res.data;
  },

  async saveKyc(form: KycForm): Promise<StepResponseData> {
    const res = await http.postFormData<StepResponseData>(
      `${BASE}/step/kyc/`,
      { aadhaar_number: form.aadhaar_number, pan_number: form.pan_number, dl_number: form.dl_number },
      { aadhaar_front: form.aadhaar_front, aadhaar_back: form.aadhaar_back, pan: form.pan }
    );
    return res.data;
  },

  async saveVehicle(form: VehicleForm): Promise<StepResponseData> {
    const res = await http.postFormData<StepResponseData>(
      `${BASE}/step/vehicle/`,
      {
        vehicle_type: form.vehicle_type,
        vehicle_registration: form.vehicle_registration,
        vehicle_make_model: form.vehicle_make_model,
        vehicle_year: form.vehicle_year,
        vehicle_color: form.vehicle_color,
        dl_expiry: form.dl_expiry,
        insurance_expiry: form.insurance_expiry,
        puc_expiry: form.puc_expiry,
      },
      {
        dl_front: form.dl_front,
        dl_back: form.dl_back,
        rc: form.rc,
        insurance: form.insurance,
        puc: form.puc,
        vehicle_photo: form.vehicle_photo,
      }
    );
    return res.data;
  },

  async saveBank(form: BankForm): Promise<StepResponseData> {
    const res = await http.post<StepResponseData>(`${BASE}/step/bank/`, { ...form });
    return res.data;
  },

  async saveSchedule(days: ScheduleDay[]): Promise<StepResponseData> {
    const res = await http.post<StepResponseData>(`${BASE}/step/schedule/`, { days });
    return res.data;
  },

  async saveWorkPrefs(form: WorkPrefsForm): Promise<StepResponseData> {
    const res = await http.post<StepResponseData>(`${BASE}/step/work-prefs/`, { ...form });
    return res.data;
  },

  async saveEmergency(form: EmergencyForm): Promise<StepResponseData> {
    const res = await http.post<StepResponseData>(`${BASE}/step/emergency/`, { ...form });
    return res.data;
  },

  async saveConsent(form: ConsentForm): Promise<StepResponseData> {
    const res = await http.post<StepResponseData>(`${BASE}/step/consent/`, { ...form });
    return res.data;
  },

  // Used by the "reupload rejected documents" flow — PATCH only the changed
  // file(s) for whichever step owns them, without resending unrelated
  // required fields (PATCH endpoints treat every field as optional).
  async patchIdentityFiles(files: { profile_photo?: PickedDoc | null; selfie?: PickedDoc | null }): Promise<StepResponseData> {
    const res = await http.patchFormData<StepResponseData>(`${BASE}/step/identity/`, {}, files);
    return res.data;
  },

  async patchKycFiles(files: { aadhaar_front?: PickedDoc | null; aadhaar_back?: PickedDoc | null; pan?: PickedDoc | null }): Promise<StepResponseData> {
    const res = await http.patchFormData<StepResponseData>(`${BASE}/step/kyc/`, {}, files);
    return res.data;
  },

  async patchVehicleFiles(files: {
    dl_front?: PickedDoc | null;
    dl_back?: PickedDoc | null;
    rc?: PickedDoc | null;
    insurance?: PickedDoc | null;
    puc?: PickedDoc | null;
    vehicle_photo?: PickedDoc | null;
  }): Promise<StepResponseData> {
    const res = await http.patchFormData<StepResponseData>(`${BASE}/step/vehicle/`, {}, files);
    return res.data;
  },

  async getStepDetail<T>(step: OnboardingStep): Promise<T> {
    const slug = STEP_SLUG[step] ?? step.toLowerCase();
    const res = await http.get<StepDetailResponse<T>>(`${BASE}/step/${slug}/detail/`);
    return res.data.details;
  },

  async getStatus(): Promise<StepResponseData> {
    const res = await http.get<StepResponseData>(`${BASE}/status/`);
    return res.data;
  },

  async getDetails(): Promise<OnboardingDetails> {
    const res = await http.get<OnboardingDetails>(`${BASE}/details/`);
    return res.data;
  },

  async submit(): Promise<void> {
    await http.post(`${BASE}/submit/`);
  },
};
