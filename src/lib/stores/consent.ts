import { createStore } from "./create-store";

export interface ConsentState {
  decided: boolean;
  google: boolean;
}

export const consentStore = createStore<ConsentState>({ decided: false, google: false }, "cosenza-consent:v1");

export function setConsent(google: boolean) {
  consentStore.set({ decided: true, google });
}
