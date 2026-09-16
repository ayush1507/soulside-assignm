export type ClientStatus = 'active' | 'paused';
export type PreferredContact = 'sms' | 'phone' | 'email';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  clinicianId: string;
  startedOn: string; // date-only, e.g. "2026-02-11"
  phone: string;
  preferredContact: PreferredContact;
}
