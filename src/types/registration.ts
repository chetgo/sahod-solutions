// 📁 src/types/registration.ts
export interface CompanyInfoFormData {
  companyName: string;
  industry: string;
  employeeCount: string;
  region: string;
  city: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

export interface BusinessDetailsFormData {
  tin: string;
  sssNumber: string;
  philhealthNumber: string;
  pagibigNumber: string;
  businessRegistration: string;
  payrollSchedule: string;
  workingDays: string;
}

export interface AdminAccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
  subdomain: string;
}

export interface PlanSelectionFormData {
  selectedPlan: 'starter' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'annually';
}

export interface PaymentFormData {
  paymentMethod: 'card' | 'gcash' | 'bank_transfer';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  termsAccepted: boolean;
}

export interface RegistrationData {
  companyInfo: CompanyInfoFormData;
  businessDetails: BusinessDetailsFormData;
  adminAccount: AdminAccountFormData;
  planSelection: PlanSelectionFormData;
  payment: PaymentFormData;
  currentStep: number;
  completedSteps: number[];
  createdAt: string;
  updatedAt: string;
}

