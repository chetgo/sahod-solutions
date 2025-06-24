// Extract industry type from constants  
import { INDUSTRIES } from '../lib/constants/philippineData';
type IndustryType = typeof INDUSTRIES[number]['id'];

// Step 1: Company Information
export interface CompanyInfoFormData {
  companyName: string;
  industry: IndustryType;
  employeeCount: '1-10' | '11-25' | '26-50' | '51-100' | '101-250' | '251-500' | '500+';
  region: string;
  city: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

// Step 2: Business Compliance Details
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

// Step 3: Admin Account Creation
export interface AdminAccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
  subdomain: string;
}

// Step 4: Plan Selection
export interface PlanSelectionFormData {
  planTier: 'starter' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  agreedToTerms: boolean;
}

// Step 5: Payment Setup
export interface PaymentFormData {
  paymentMethod: 'credit_card' | 'gcash' | 'bank_transfer';
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
  agreedToTerms: boolean;
}

// Complete Registration Data
export interface RegistrationData {
  registrationId: string;
  currentStep: number;
  completedSteps: number[];
  
  // Step data (null until completed)
  companyInfo: CompanyInfoFormData | null;
  businessDetails: BusinessDetailsFormData | null;
  adminAccount: AdminAccountFormData | null;
  planSelection: PlanSelectionFormData | null;
  payment: PaymentFormData | null;
  
  // Metadata
  createdAt?: any;
  updatedAt?: any;
  expiresAt?: any;
}

// Auto-save status
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Step validation status
export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

// Registration context
export interface RegistrationContextType {
  registrationData: RegistrationData;
  currentStep: number;
  completedSteps: number[];
  isLoading: boolean;
  autoSaveStatus: AutoSaveStatus;
  
  // Actions
  updateRegistrationData: (updates: Partial<RegistrationData>) => void;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  validateStep: (step: number) => StepValidation;
  
  // Navigation
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoToStep: (step: number) => boolean;
  
  // Registration management
  registrationId: string | null;
  saveCurrentStep: () => Promise<void>;
  loadRegistration: (regId: string) => Promise<void>;
  createNewRegistration: () => void;
}