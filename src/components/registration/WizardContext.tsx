// src/components/registration/WizardContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types for our registration data
export interface CompanyInfo {
  name: string;
  industry: string;
  employeeCount: string;
  location: string;
  address: string;
  adminName: string;
  adminPhone: string;
}

export interface BusinessDetails {
  tin: string;
  sssNumber: string;
  philhealthNumber: string;
  pagibigNumber: string;
  businessRegistration: string;
  payrollSchedule: string;
  workingDays: string;
}

export interface AdminAccount {
  email: string;
  password: string;
  confirmPassword: string;
  companySubdomain: string;
}

export interface PlanSelection {
  selectedPlan: 'starter' | 'professional' | 'enterprise';
  employeeCount: number;
  monthlyPrice: number;
}

export interface PaymentSetup {
  paymentMethod: 'credit_card' | 'gcash' | 'bank_transfer';
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
  termsAccepted: boolean;
}

export interface RegistrationData {
  companyInfo: Partial<CompanyInfo>;
  businessDetails: Partial<BusinessDetails>;
  adminAccount: Partial<AdminAccount>;
  planSelection: Partial<PlanSelection>;
  paymentSetup: Partial<PaymentSetup>;
}

export interface WizardState {
  currentStep: number;
  totalSteps: number;
  data: RegistrationData;
  isLoading: boolean;
  errors: Record<string, string>;
  completedSteps: number[];
  canProceed: boolean;
}

// Action types
export type WizardAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_COMPANY_INFO'; payload: Partial<CompanyInfo> }
  | { type: 'UPDATE_BUSINESS_DETAILS'; payload: Partial<BusinessDetails> }
  | { type: 'UPDATE_ADMIN_ACCOUNT'; payload: Partial<AdminAccount> }
  | { type: 'UPDATE_PLAN_SELECTION'; payload: Partial<PlanSelection> }
  | { type: 'UPDATE_PAYMENT_SETUP'; payload: Partial<PaymentSetup> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'MARK_STEP_COMPLETED'; payload: number }
  | { type: 'SET_CAN_PROCEED'; payload: boolean }
  | { type: 'RESET_WIZARD' };

// Initial state
const initialState: WizardState = {
  currentStep: 1,
  totalSteps: 5,
  data: {
    companyInfo: {},
    businessDetails: {},
    adminAccount: {},
    planSelection: {
      selectedPlan: 'professional', // Default to most popular
      employeeCount: 50,
      monthlyPrice: 3950 // 50 * 79
    },
    paymentSetup: {
      paymentMethod: 'credit_card',
      termsAccepted: false
    }
  },
  isLoading: false,
  errors: {},
  completedSteps: [],
  canProceed: false
};

// Reducer function
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };

    case 'UPDATE_COMPANY_INFO':
      return {
        ...state,
        data: {
          ...state.data,
          companyInfo: {
            ...state.data.companyInfo,
            ...action.payload
          }
        }
      };

    case 'UPDATE_BUSINESS_DETAILS':
      return {
        ...state,
        data: {
          ...state.data,
          businessDetails: {
            ...state.data.businessDetails,
            ...action.payload
          }
        }
      };

    case 'UPDATE_ADMIN_ACCOUNT':
      return {
        ...state,
        data: {
          ...state.data,
          adminAccount: {
            ...state.data.adminAccount,
            ...action.payload
          }
        }
      };

    case 'UPDATE_PLAN_SELECTION':
      return {
        ...state,
        data: {
          ...state.data,
          planSelection: {
            ...state.data.planSelection,
            ...action.payload
          }
        }
      };

    case 'UPDATE_PAYMENT_SETUP':
      return {
        ...state,
        data: {
          ...state.data,
          paymentSetup: {
            ...state.data.paymentSetup,
            ...action.payload
          }
        }
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message
        }
      };

    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors
      };

    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        completedSteps: [...state.completedSteps.filter(s => s !== action.payload), action.payload]
      };

    case 'SET_CAN_PROCEED':
      return {
        ...state,
        canProceed: action.payload
      };

    case 'RESET_WIZARD':
      return initialState;

    default:
      return state;
  }
}

// Context
const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
} | null>(null);

// Provider component
interface WizardProviderProps {
  children: ReactNode;
}

export function WizardProvider({ children }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

// Custom hook to use wizard context
export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

// Helper functions for wizard actions
export const wizardActions = {
  setCurrentStep: (step: number): WizardAction => ({
    type: 'SET_CURRENT_STEP',
    payload: step
  }),

  updateCompanyInfo: (data: Partial<CompanyInfo>): WizardAction => ({
    type: 'UPDATE_COMPANY_INFO',
    payload: data
  }),

  updateBusinessDetails: (data: Partial<BusinessDetails>): WizardAction => ({
    type: 'UPDATE_BUSINESS_DETAILS',
    payload: data
  }),

  updateAdminAccount: (data: Partial<AdminAccount>): WizardAction => ({
    type: 'UPDATE_ADMIN_ACCOUNT',
    payload: data
  }),

  updatePlanSelection: (data: Partial<PlanSelection>): WizardAction => ({
    type: 'UPDATE_PLAN_SELECTION',
    payload: data
  }),

  updatePaymentSetup: (data: Partial<PaymentSetup>): WizardAction => ({
    type: 'UPDATE_PAYMENT_SETUP',
    payload: data
  }),

  setLoading: (loading: boolean): WizardAction => ({
    type: 'SET_LOADING',
    payload: loading
  }),

  setError: (field: string, message: string): WizardAction => ({
    type: 'SET_ERROR',
    payload: { field, message }
  }),

  clearError: (field: string): WizardAction => ({
    type: 'CLEAR_ERROR',
    payload: field
  }),

  markStepCompleted: (step: number): WizardAction => ({
    type: 'MARK_STEP_COMPLETED',
    payload: step
  }),

  setCanProceed: (canProceed: boolean): WizardAction => ({
    type: 'SET_CAN_PROCEED',
    payload: canProceed
  }),

  resetWizard: (): WizardAction => ({
    type: 'RESET_WIZARD'
  })
};

// Step configuration
export const STEPS = [
  {
    id: 1,
    title: 'Company Info',
    description: 'Basic company information',
    required: true
  },
  {
    id: 2,
    title: 'Business Details',
    description: 'Government compliance information',
    required: true
  },
  {
    id: 3,
    title: 'Admin Account',
    description: 'Create your admin account',
    required: true
  },
  {
    id: 4,
    title: 'Choose Plan',
    description: 'Select subscription plan',
    required: false
  },
  {
    id: 5,
    title: 'Payment',
    description: 'Payment setup and trial',
    required: false
  }
] as const;