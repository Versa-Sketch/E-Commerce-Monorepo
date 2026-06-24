import { BargainingStore, FixtureBargainGateway, fixtureHttpAdapter } from '@monorepo/bargaining';
import { rootStore } from '../stores/RootStore';

// Fixture-backed for now (per the rollout plan) — swapping to the real
// BargainGatewaySocket/BargainRestClient + http.ts-backed adapter is a
// one-line change here once the backend endpoints are ready.
export const merchantBargainingStore = new BargainingStore({
  role: 'SHOP',
  getToken: () => rootStore.sessionStore.accessToken,
  http: fixtureHttpAdapter,
  gateway: new FixtureBargainGateway(),
});
