export interface Client {
  id: string;
  name: string;
  status: string;
  clinicianId: string;
  startedOn: string; // date-only, e.g. "2026-02-11"
  phone: string;
  preferredContact: string;
}
