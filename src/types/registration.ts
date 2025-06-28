// src/types/registration.ts

// Extract industry type from constants  
import { INDUSTRIES } from '../lib/constants/philippineData';
type IndustryType = typeof INDUSTRIES[number]['id'];

// Step 1 - Company Information (3 fields only)
export interface CompanyInfoFormData {
  companyName: string;
  industry: IndustryType;
  address: string;
}

// Step 2 - Admin Account Creation (5 fields)
export interface AdminAccountFormData {
  fullName: string;     // Admin's full name
  email: string;        // Login email + company contact
  phone: string;        // Company contact phone
  password: string;
  confirmPassword: string;
  subdomain: string;
}

// Step 3 - Trial Activation
export interface TrialActivationFormData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
}

// Registration Data for 3-step flow
export interface RegistrationData {
  registrationId: string;
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
  
  // Step data
  companyInfo: CompanyInfoFormData | null;
  adminAccount: AdminAccountFormData | null;
  trialActivation: TrialActivationFormData | null;
  
  // Status
  isTrialActivated: boolean;
  companyCreated: boolean;
  
  // Metadata
  createdAt?: any;
  updatedAt?: any;
  expiresAt?: any;
}

// Business details for dashboard setup (post-registration)
export interface BusinessDetailsFormData {
  tin: string;
  sssNumber: string;
  philhealthNumber: string;
  pagibigNumber: string;
  businessRegistrationType: 'sec' | 'dti' | 'cda' | 'other';
  businessRegistration?: string;
  payrollSchedule: 'weekly' | 'bi-monthly' | 'monthly';
  workingDays: 'mon-fri' | 'mon-sat' | 'custom';
  overtimeRate: number;
  nightDifferentialRate: number;
  holidayRate: number;
}

// Company document structure (created after trial activation)
export interface CompanyDocument {
  companyId: string;
  subdomain: string;
  
  // Basic info from registration
  companyName: string;
  industry: IndustryType;
  address: string;
  
  // Admin info
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  
  // Trial status
  trialStartDate: any;
  trialEndDate: any;
  isTrialActive: boolean;
  
  // Setup progress (for dashboard)
  setupProgress: {
    businessDetails: boolean;
    firstEmployee: boolean;
    paymentMethod: boolean;
    kioskSetup: boolean;
    bankIntegration: boolean;
  };
  
  // Metadata
  createdAt: any;
  updatedAt: any;
}

// Registration context for 3-step flow
export interface RegistrationContextType {
  registrationData: RegistrationData;
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
  isLoading: boolean;
  
  // Actions
  setCurrentStep: (step: 1 | 2 | 3) => void;
  markStepCompleted: (step: number) => void;
  
  // Navigation
  goToStep: (step: 1 | 2 | 3) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoToStep: (step: number) => boolean;
  
  // Registration management
  registrationId: string | null;
  saveCurrentStep: () => Promise<void>;
  activateTrial: () => Promise<string>; // Returns company subdomain for redirect
}

// Export types for easier imports
export type {
  IndustryType
};