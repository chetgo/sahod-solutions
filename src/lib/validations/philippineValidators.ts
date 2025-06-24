import { z } from 'zod';
import { INDUSTRIES, PHILIPPINE_REGIONS, MAJOR_CITIES } from '../constants/philippineData';

// Philippine phone number validation
export const validatePhilippineMobile = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Support +63, 63, 09 formats
  if (cleanPhone.startsWith('63')) {
    return cleanPhone.length === 12 && cleanPhone.startsWith('639');
  }
  if (cleanPhone.startsWith('09')) {
    return cleanPhone.length === 11;
  }
  return false;
};

// Tax Identification Number validation
export const validateTIN = (tin: string): boolean => {
  const cleanTIN = tin.replace(/\D/g, '');
  return cleanTIN.length === 12; // 9 digits + 3 digit branch code
};

// SSS Number validation  
export const validateSSS = (sss: string): boolean => {
  const cleanSSS = sss.replace(/\D/g, '');
  return cleanSSS.length === 10; // Format: XX-XXXXXXX-X
};

// PhilHealth Number validation
export const validatePhilHealth = (philhealth: string): boolean => {
  const cleanPhilHealth = philhealth.replace(/\D/g, '');
  return cleanPhilHealth.length === 11;
};

// Pag-IBIG Number validation
export const validatePagIBIG = (pagibig: string): boolean => {
  const cleanPagIBIG = pagibig.replace(/\D/g, '');
  return cleanPagIBIG.length === 13;
};

// Create industry enum from constants - exact match with types
const industryValues = INDUSTRIES.map(industry => industry.id);

// Create region enum from constants - exact match  
const regionValues = PHILIPPINE_REGIONS;

// Employee count ranges - exact match with types
const employeeCountValues = ['1-10', '11-25', '26-50', '51-100', '101-250', '251-500', '500+'] as const;

// Zod schema for Company Information (Step 1)
export const companyInfoSchema = z.object({
  companyName: z.string()
    .min(3, 'Company name must be at least 3 characters')
    .max(100, 'Company name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.\,\&]+$/, 'Company name contains invalid characters'),
  
  industry: z.enum(industryValues as [string, ...string[]], { 
    errorMap: () => ({ message: 'Please select a valid industry' }) 
  }),
  
  employeeCount: z.enum(employeeCountValues, { 
    errorMap: () => ({ message: 'Please select employee count range' }) 
  }),
  
  region: z.enum(regionValues as [string, ...string[]], { 
    errorMap: () => ({ message: 'Please select a valid region' }) 
  }),
  
  city: z.string()
    .min(2, 'City is required')
    .max(50, 'City name too long'),
  
  address: z.string()
    .min(10, 'Complete address is required')
    .max(200, 'Address is too long'),
  
  adminName: z.string()
    .min(2, 'Admin name is required')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Name contains invalid characters'),
  
  adminEmail: z.string()
    .email('Invalid email address')
    .min(5, 'Email is required')
    .max(100, 'Email is too long')
    .toLowerCase(),
  
  adminPhone: z.string()
    .refine(validatePhilippineMobile, 'Invalid Philippine phone number format')
});

// Zod schema for Business Details (Step 2)
export const businessDetailsSchema = z.object({
  tin: z.string()
    .refine(validateTIN, 'Invalid TIN format. Use: 123-456-789-000'),
  
  sssNumber: z.string()
    .refine(validateSSS, 'Invalid SSS number format. Use: 03-1234567-8'),
  
  philhealthNumber: z.string()
    .refine(validatePhilHealth, 'PhilHealth number must be 11 digits'),
  
  pagibigNumber: z.string()
    .refine(validatePagIBIG, 'Pag-IBIG number must be 13 digits'),
  
  businessRegistrationType: z.enum(['sec', 'dti', 'cda', 'other'], {
    errorMap: () => ({ message: 'Please select business registration type' })
  }),
  
  businessRegistration: z.string()
    .max(50, 'Registration number is too long')
    .optional(),
  
  payrollSchedule: z.enum(['weekly', 'bi-monthly', 'monthly'], {
    errorMap: () => ({ message: 'Please select payroll schedule' })
  }),
  
  workingDays: z.enum(['mon-fri', 'mon-sat', 'custom'], {
    errorMap: () => ({ message: 'Please select working days' })
  }),
  
  overtimeRate: z.number()
    .min(1, 'Overtime rate must be at least 1.0')
    .max(3, 'Overtime rate cannot exceed 3.0'),
  
  nightDifferentialRate: z.number()
    .min(1, 'Night differential rate must be at least 1.0')
    .max(2, 'Night differential rate cannot exceed 2.0'),
  
  holidayRate: z.number()
    .min(1, 'Holiday rate must be at least 1.0')
    .max(3, 'Holiday rate cannot exceed 3.0')
});

// Zod schema for Admin Account (Step 3)
export const adminAccountSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email is required')
    .max(100, 'Email is too long')
    .toLowerCase(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number')
    .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
  
  confirmPassword: z.string(),
  
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(30, 'Subdomain cannot exceed 30 characters')
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Subdomain can only contain letters, numbers, and hyphens')
    .refine(val => !val.startsWith('-') && !val.endsWith('-'), 'Subdomain cannot start or end with hyphen')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Zod schema for Plan Selection (Step 4)
export const planSelectionSchema = z.object({
  planTier: z.enum(['starter', 'professional', 'enterprise'], {
    errorMap: () => ({ message: 'Please select a subscription plan' })
  }),
  
  billingCycle: z.enum(['monthly', 'annual'], {
    errorMap: () => ({ message: 'Please select billing cycle' })
  }),
  
  agreedToTerms: z.boolean()
    .refine(val => val === true, 'You must agree to the terms of service')
});

// Zod schema for Payment (Step 5)
export const paymentSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'gcash', 'bank_transfer'], {
    errorMap: () => ({ message: 'Please select a payment method' })
  }),
  
  cardNumber: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional for non-card payments
      const numbers = val.replace(/\D/g, '');
      return numbers.length >= 13 && numbers.length <= 19;
    }, 'Invalid card number'),
  
  cardholderName: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return val.length >= 2 && val.length <= 50;
    }, 'Cardholder name must be 2-50 characters'),
  
  expiryDate: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^(0[1-9]|1[0-2])\/\d{2}$/.test(val);
    }, 'Invalid expiry date format (MM/YY)'),
  
  cvv: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^\d{3,4}$/.test(val);
    }, 'CVV must be 3 or 4 digits'),
  
  agreedToTerms: z.boolean()
    .refine(val => val === true, 'You must agree to the terms of service and privacy policy')
});

// Export constants for use in components (re-export for convenience)
export { PHILIPPINE_REGIONS, MAJOR_CITIES, INDUSTRIES } from '../constants/philippineData';