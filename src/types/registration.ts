// ✅ CORRECTED: 3-Step Registration Flow
// src/types/registration.ts

import type { SubdomainDocument } from './subdomain';

// Step 1: Company Information (SIMPLIFIED)
export interface CompanyInfoFormData {
  companyName: string;
  industry: string;
  address: string;
  // REMOVED: email, phone, city, region, postalCode, employeeCount - not in actual form
}

// Step 2: Admin Account Creation
export interface AdminAccountFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  subdomain: string;
}

// Step 3: Trial Activation
export interface TrialActivationFormData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
}

// REMOVED: BusinessDetailsFormData, PlanSelectionFormData, PaymentFormData
// These are moved to post-registration dashboard setup

// Complete Registration Data Structure (3 STEPS ONLY)
export interface RegistrationData {
  registrationId: string;
  currentStep: 1 | 2 | 3; // ONLY 3 steps
  completedSteps: number[];
  
  // Step Data (3 steps only)
  companyInfo: CompanyInfoFormData | null;
  adminAccount: AdminAccountFormData | null;
  trialActivation: TrialActivationFormData | null;
  
  // Completion Status
  isTrialActivated: boolean;
  companyCreated: boolean;
  companyId?: string;
  userId?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}

// Company Creation Result
export interface CompanyCreationResult {
  companyId: string;
  subdomain: string;
  dashboardUrl: string;
  trialEndDate: Date;
}

// Form Validation States
export interface FormStepState {
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
}

// Wizard Navigation (3 steps)
export interface WizardState {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
  canProceed: boolean;
  isLoading: boolean;
  error?: string;
}

// Auto-save Configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number;
  lastSaved?: Date;
  status: 'idle' | 'saving' | 'saved' | 'error';
}