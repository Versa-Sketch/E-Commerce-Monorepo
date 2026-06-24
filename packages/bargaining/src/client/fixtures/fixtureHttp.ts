import { BargainHttpAdapter } from '../BargainRestClient';
import { createFixtureSession } from './fixtureData';

// A BargainHttpAdapter that never hits a network — pairs with
// FixtureBargainGateway so a screen can run entirely on mock data.
export const fixtureHttpAdapter: BargainHttpAdapter = {
  async get<T>(url: string): Promise<T> {
    if (url.includes('/sessions/')) return createFixtureSession() as unknown as T;
    return [] as unknown as T;
  },
  async post<T>(): Promise<T> {
    return createFixtureSession() as unknown as T;
  },
};
