import type { OnboardingServiceInterface } from './index';
import type { OnboardingApi, OnboardingDetailApi, ReviewRequestApi } from '../../types/api';
import { onboardingFixture } from '../../Fixtures/onboardingFixture';

export class OnboardingFixtureService implements OnboardingServiceInterface {
  private items: OnboardingApi[] = onboardingFixture.map(o => ({ ...o }));

  async getOnboardings(status?: string): Promise<OnboardingApi[]> {
    await delay(400);
    if (status && status !== 'all') {
      return this.items.filter(o => o.status === status).map(o => ({ ...o }));
    }
    return this.items.map(o => ({ ...o }));
  }

  async getOnboardingDetail(shopId: string): Promise<OnboardingDetailApi> {
    await delay(300);
    const item = this.items.find(o => o.shop_id === shopId);
    if (!item) throw new Error(`Onboarding for shop ${shopId} not found`);
    return {
      onboarding_id: item.onboarding_id,
      status: item.status,
      business_type: item.business_type,
      current_step: item.current_step,
      completed_steps: ['SHOP_DETAILS', 'BUSINESS_TYPE'],
      rejection_reason: '',
      reviewed_at: null,
      reviewed_by: null,
      shop: { id: item.shop_id, name: item.shop_name, phone_number: item.owner_phone, description: '', is_verified: false },
      owner: { id: 'owner-1', full_name: item.owner_name, phone_number: item.owner_phone },
      address: { address_line1: '123 Main St', address_line2: '', state: 'Karnataka', pincode: '560001' },
      bank: { bank_account_name: item.shop_name, bank_account_number: '', bank_ifsc_code: '', bank_name: '', bank_branch: '', cancelled_cheque_or_passbook: '' },
      address_proof: { type: '', document: '' },
      store_photos: { store_front_photo: '', store_interior_photo: '', signature_photo: '' },
      kyc: { pan_card: '', aadhaar_card: '', gst_certificate: '', msme_certificate: '', trade_license: '' },
    };
  }

  async reviewOnboarding(shopId: string, body: ReviewRequestApi): Promise<void> {
    await delay(500);
    const item = this.items.find(o => o.shop_id === shopId);
    if (item) {
      item.status = body.status;
    }
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
