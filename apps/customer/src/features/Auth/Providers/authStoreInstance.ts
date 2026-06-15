import { AuthStore } from '../Store/AuthStore';
let instance: AuthStore | null = null;
export function setAuthStoreInstance(store: AuthStore): void {
  instance = store;
}
export function getAuthStoreInstance(): AuthStore | null {
  return instance;
}
