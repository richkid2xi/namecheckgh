export type FilterType = 'contains' | 'exact' | 'starts' | 'ends';

export type BusinessStatus = 'Active' | 'Inactive' | 'Struck Off' | 'Dissolved';

export interface BusinessRecord {
  id: string;
  name: string;
  type: string;
  regNumber: string;
  status: BusinessStatus;
  registeredDate: string;
  region: string;
}

export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}
