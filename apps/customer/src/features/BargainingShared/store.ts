import { BargainingStore, FixtureBargainGateway, fixtureHttpAdapter } from '@monorepo/bargaining';
import { getAuthStoreInstance } from '@/features/Auth/Providers/authStoreInstance';

// Fixture-backed for now (per the rollout plan) — swapping to the real
// BargainGatewaySocket/BargainRestClient + AppClient-backed http adapter is
// a one-line change here once the backend endpoints are ready.
export const customerBargainingStore = new BargainingStore({
  role: 'CUSTOMER',
  getToken: () => getAuthStoreInstance()?.token ?? null,
  http: fixtureHttpAdapter,
  gateway: new FixtureBargainGateway(),
});
