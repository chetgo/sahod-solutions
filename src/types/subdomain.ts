import { Timestamp } from 'firebase/firestore';

export interface SubdomainDocument {
  subdomain: string;           // Document ID (e.g., "abc-manufacturing")
  companyId: string | null;    // Reference to company (null for pending)
  status: 'active' | 'reserved' | 'pending' | 'expired';
  registrationId?: string;     // For draft registrations
  createdAt: Timestamp;
  expiresAt?: Timestamp;       // For draft/reserved subdomains
  updatedAt: Timestamp;
}

export interface SubdomainAvailabilityResult {
  available: boolean;
  status?: string;
}

export interface SubdomainReservation {
  subdomain: string;
  registrationId: string;
  expiresIn: number; // milliseconds
}

export interface SubdomainValidationState {
  checking: boolean;
  available: boolean;
  status?: string;
  error?: string;
}