// src/lib/validations/philippineValidators.ts

/**
 * Philippine-specific validation utilities for business registration
 * Includes government ID formats, address validation, and business rules
 */

// TIN (Tax Identification Number) validation
export const validateTIN = (tin: string): { isValid: boolean; message?: string; formatted?: string } => {
  if (!tin) return { isValid: false, message: 'TIN is required' };
  
  // Remove any spaces or dashes
  const cleanTIN = tin.replace(/[\s-]/g, '');
  
  // Check if it's exactly 12 digits
  if (!/^\d{12}$/.test(cleanTIN)) {
    return { 
      isValid: false, 
      message: 'TIN must be 12 digits in format ###-###-###-###' 
    };
  }
  
  // Format check: ###-###-###-###
  const formattedTIN = `${cleanTIN.slice(0, 3)}-${cleanTIN.slice(3, 6)}-${cleanTIN.slice(6, 9)}-${cleanTIN.slice(9, 12)}`;
  
  return { isValid: true, formatted: formattedTIN };
};

// SSS (Social Security System) validation
export const validateSSS = (sss: string): { isValid: boolean; message?: string; formatted?: string } => {
  if (!sss) return { isValid: false, message: 'SSS number is required' };
  
  // Remove any spaces or dashes
  const cleanSSS = sss.replace(/[\s-]/g, '');
  
  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(cleanSSS)) {
    return { 
      isValid: false, 
      message: 'SSS number must be 10 digits in format ##-#######-#' 
    };
  }
  
  // Format check: ##-#######-#
  const formattedSSS = `${cleanSSS.slice(0, 2)}-${cleanSSS.slice(2, 9)}-${cleanSSS.slice(9, 10)}`;
  
  return { isValid: true, formatted: formattedSSS };
};

// PhilHealth validation
export const validatePhilHealth = (philhealth: string): { isValid: boolean; message?: string; formatted?: string } => {
  if (!philhealth) return { isValid: false, message: 'PhilHealth number is required' };
  
  // Remove any spaces or dashes
  const cleanPhilHealth = philhealth.replace(/[\s-]/g, '');
  
  // Check if it's exactly 11 digits
  if (!/^\d{11}$/.test(cleanPhilHealth)) {
    return { 
      isValid: false, 
      message: 'PhilHealth number must be 11 digits' 
    };
  }
  
  return { isValid: true, formatted: cleanPhilHealth };
};

// Pag-IBIG validation
export const validatePagIBIG = (pagibig: string): { isValid: boolean; message?: string; formatted?: string } => {
  if (!pagibig) return { isValid: false, message: 'Pag-IBIG number is required' };
  
  // Remove any spaces or dashes
  const cleanPagIBIG = pagibig.replace(/[\s-]/g, '');
  
  // Check if it's exactly 13 digits
  if (!/^\d{13}$/.test(cleanPagIBIG)) {
    return { 
      isValid: false, 
      message: 'Pag-IBIG number must be 13 digits' 
    };
  }
  
  return { isValid: true, formatted: cleanPagIBIG };
};

// Philippine mobile number validation
export const validatePhilippineMobile = (mobile: string): { isValid: boolean; message?: string; formatted?: string } => {
  if (!mobile) return { isValid: false, message: 'Mobile number is required' };
  
  // Remove any spaces, dashes, or parentheses
  const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
  
  // Check for Philippine mobile format
  // Starts with +63 or 63 or 0, followed by 9 and 9 more digits
  const philippinePattern = /^(\+63|63|0)9\d{9}$/;
  
  if (!philippinePattern.test(cleanMobile)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid Philippine mobile number (e.g., +63 912 345 6789)' 
    };
  }
  
  // Format to international format
  let formatted = cleanMobile;
  if (formatted.startsWith('0')) {
    formatted = '+63' + formatted.slice(1);
  } else if (formatted.startsWith('63')) {
    formatted = '+' + formatted;
  }
  
  return { isValid: true, formatted };
};

// SEC Registration validation
export const validateSECRegistration = (secReg: string): { isValid: boolean; message?: string } => {
  if (!secReg) return { isValid: true }; // Optional field
  
  // SEC registration numbers typically follow pattern: CS############ or AS############ 
  const secPattern = /^(CS|AS|GCS)\d{9,12}$/i;
  
  if (!secPattern.test(secReg.replace(/[\s-]/g, ''))) {
    return { 
      isValid: false, 
      message: 'Invalid SEC registration format (e.g., CS201234567)' 
    };
  }
  
  return { isValid: true };
};

// DTI Business Name validation
export const validateDTIBusinessName = (dtiName: string): { isValid: boolean; message?: string } => {
  if (!dtiName) return { isValid: true }; // Optional field
  
  // DTI business names should be reasonable length and format
  if (dtiName.length < 3 || dtiName.length > 100) {
    return { 
      isValid: false, 
      message: 'DTI business name must be between 3 and 100 characters' 
    };
  }
  
  return { isValid: true };
};

// Philippine regions and provinces
export const PHILIPPINE_REGIONS = [
  { code: 'NCR', name: 'National Capital Region (Metro Manila)' },
  { code: 'CAR', name: 'Cordillera Administrative Region' },
  { code: 'I', name: 'Ilocos Region' },
  { code: 'II', name: 'Cagayan Valley' },
  { code: 'III', name: 'Central Luzon' },
  { code: 'IV-A', name: 'CALABARZON' },
  { code: 'IV-B', name: 'MIMAROPA' },
  { code: 'V', name: 'Bicol Region' },
  { code: 'VI', name: 'Western Visayas' },
  { code: 'VII', name: 'Central Visayas' },
  { code: 'VIII', name: 'Eastern Visayas' },
  { code: 'IX', name: 'Zamboanga Peninsula' },
  { code: 'X', name: 'Northern Mindanao' },
  { code: 'XI', name: 'Davao Region' },
  { code: 'XII', name: 'SOCCSKSARGEN' },
  { code: 'XIII', name: 'Caraga' },
  { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' }
];

export const METRO_MANILA_CITIES = [
  'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila',
  'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig',
  'Pateros', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela'
];

// Industry categories relevant to Philippine businesses
export const PHILIPPINE_INDUSTRIES = [
  { code: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
  { code: 'bpo', name: 'Business Process Outsourcing', icon: '🏢' },
  { code: 'retail', name: 'Retail & Trade', icon: '🏪' },
  { code: 'healthcare', name: 'Healthcare & Medical', icon: '🏥' },
  { code: 'food_service', name: 'Food Service & Hospitality', icon: '🍽️' },
  { code: 'construction', name: 'Construction & Real Estate', icon: '🏗️' },
  { code: 'transportation', name: 'Transportation & Logistics', icon: '🚛' },
  { code: 'agriculture', name: 'Agriculture & Fisheries', icon: '🌾' },
  { code: 'education', name: 'Education & Training', icon: '📚' },
  { code: 'finance', name: 'Financial Services', icon: '🏦' },
  { code: 'technology', name: 'Information Technology', icon: '💻' },
  { code: 'other', name: 'Other', icon: '📋' }
];

// Employee count ranges for pricing
export const EMPLOYEE_COUNT_RANGES = [
  { value: '1-10', label: '1-10 employees', max: 10 },
  { value: '11-25', label: '11-25 employees', max: 25 },
  { value: '26-50', label: '26-50 employees', max: 50 },
  { value: '51-100', label: '51-100 employees', max: 100 },
  { value: '101-250', label: '101-250 employees', max: 250 },
  { value: '251-500', label: '251-500 employees', max: 500 },
  { value: '500+', label: '500+ employees', max: 1000 }
];

// Payroll schedules common in Philippines
export const PAYROLL_SCHEDULES = [
  { value: 'weekly', label: 'Weekly', description: 'Every week' },
  { value: 'bi-monthly', label: 'Bi-monthly (15th & 30th)', description: 'Twice per month' },
  { value: 'monthly', label: 'Monthly', description: 'Once per month' }
];

// Working day configurations
export const WORKING_DAY_OPTIONS = [
  { value: 'mon-fri', label: 'Monday to Friday', days: 5 },
  { value: 'mon-sat', label: 'Monday to Saturday', days: 6 },
  { value: 'custom', label: 'Custom schedule', days: null }
];

// Format helpers
export const formatTIN = (tin: string): string => {
  const clean = tin.replace(/\D/g, '');
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  if (clean.length <= 9) return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}-${clean.slice(9, 12)}`;
};

export const formatSSS = (sss: string): string => {
  const clean = sss.replace(/\D/g, '');
  if (clean.length <= 2) return clean;
  if (clean.length <= 9) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  return `${clean.slice(0, 2)}-${clean.slice(2, 9)}-${clean.slice(9, 10)}`;
};

export const formatPhilippineMobile = (mobile: string): string => {
  const clean = mobile.replace(/\D/g, '');
  
  // Handle different input formats
  if (clean.startsWith('639')) {
    const number = clean.slice(2);
    return `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  } else if (clean.startsWith('09')) {
    const number = clean.slice(1);
    return `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }
  
  return mobile;
};

// Comprehensive validation function for all Philippine business data
export const validatePhilippineBusinessData = (data: Record<string, unknown>) => {
  const errors: { [key: string]: string } = {};
  
  // Validate TIN
  if (data.tin && typeof data.tin === 'string') {
    const tinResult = validateTIN(data.tin);
    if (!tinResult.isValid) {
      errors.tin = tinResult.message!;
    }
  }
  
  // Validate SSS
  if (data.sssNumber && typeof data.sssNumber === 'string') {
    const sssResult = validateSSS(data.sssNumber);
    if (!sssResult.isValid) {
      errors.sssNumber = sssResult.message!;
    }
  }
  
  // Validate PhilHealth
  if (data.philhealthNumber && typeof data.philhealthNumber === 'string') {
    const philhealthResult = validatePhilHealth(data.philhealthNumber);
    if (!philhealthResult.isValid) {
      errors.philhealthNumber = philhealthResult.message!;
    }
  }
  
  // Validate Pag-IBIG
  if (data.pagibigNumber && typeof data.pagibigNumber === 'string') {
    const pagibigResult = validatePagIBIG(data.pagibigNumber);
    if (!pagibigResult.isValid) {
      errors.pagibigNumber = pagibigResult.message!;
    }
  }
  
  // Validate mobile number
  if (data.adminPhone && typeof data.adminPhone === 'string') {
    const mobileResult = validatePhilippineMobile(data.adminPhone);
    if (!mobileResult.isValid) {
      errors.adminPhone = mobileResult.message!;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// APPEND THIS TO THE END OF: src/lib/validations/philippineValidators.ts

import { z } from 'zod';

// ========================================
// ZOD SCHEMAS FOR REACT-HOOK-FORM
// ========================================

// Philippine TIN validation schema (using existing validation function)
export const tinSchema = z.string().refine((tin) => {
  const result = validateTIN(tin);
  return result.isValid;
}, {
  message: 'TIN must be in format: 123-456-789-000'
});

// Philippine SSS validation schema
export const sssSchema = z.string().refine((sss) => {
  const result = validateSSS(sss);
  return result.isValid;
}, {
  message: 'SSS number must be in format: 03-1234567-8'
});

// Philippine PhilHealth validation schema
export const philhealthSchema = z.string().refine((philhealth) => {
  const result = validatePhilHealth(philhealth);
  return result.isValid;
}, {
  message: 'PhilHealth number must be 11 digits'
});

// Philippine Pag-IBIG validation schema
export const pagibigSchema = z.string().refine((pagibig) => {
  const result = validatePagIBIG(pagibig);
  return result.isValid;
}, {
  message: 'Pag-IBIG number must be 13 digits'
});

// Philippine phone number validation schema
export const phoneSchema = z.string().refine((phone) => {
  const result = validatePhilippineMobile(phone);
  return result.isValid;
}, {
  message: 'Invalid Philippine phone number format'
});

// Company information validation schema
export const companyInfoSchema = z.object({
  companyName: z.string()
    .min(3, 'Company name must be at least 3 characters')
    .max(100, 'Company name must be less than 100 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  employeeCount: z.string().min(1, 'Please select employee count'),
  region: z.string().min(1, 'Please select a region'),
  city: z.string().min(1, 'Please select a city'),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  adminName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  adminEmail: z.string().email('Invalid email address'),
  adminPhone: phoneSchema
});

// Business details validation schema
export const businessDetailsSchema = z.object({
  tin: tinSchema,
  sssNumber: sssSchema,
  philhealthNumber: philhealthSchema,
  pagibigNumber: pagibigSchema,
  businessRegistration: z.string().optional(),
  payrollSchedule: z.string().min(1, 'Please select payroll schedule'),
  workingDays: z.string().min(1, 'Please select working days')
});

// Admin account validation schema
export const adminAccountSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(30, 'Subdomain must be less than 30 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Plan selection validation schema
export const planSelectionSchema = z.object({
  selectedPlan: z.enum(['starter', 'professional', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annually'])
});

// Payment validation schema
export const paymentSchema = z.object({
  paymentMethod: z.enum(['card', 'gcash', 'bank_transfer']),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
});