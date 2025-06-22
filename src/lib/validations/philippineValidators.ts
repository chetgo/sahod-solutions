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
export const validatePhilippineBusinessData = (data: any) => {
  const errors: { [key: string]: string } = {};
  
  // Validate TIN
  if (data.tin) {
    const tinResult = validateTIN(data.tin);
    if (!tinResult.isValid) {
      errors.tin = tinResult.message!;
    }
  }
  
  // Validate SSS
  if (data.sssNumber) {
    const sssResult = validateSSS(data.sssNumber);
    if (!sssResult.isValid) {
      errors.sssNumber = sssResult.message!;
    }
  }
  
  // Validate PhilHealth
  if (data.philhealthNumber) {
    const philhealthResult = validatePhilHealth(data.philhealthNumber);
    if (!philhealthResult.isValid) {
      errors.philhealthNumber = philhealthResult.message!;
    }
  }
  
  // Validate Pag-IBIG
  if (data.pagibigNumber) {
    const pagibigResult = validatePagIBIG(data.pagibigNumber);
    if (!pagibigResult.isValid) {
      errors.pagibigNumber = pagibigResult.message!;
    }
  }
  
  // Validate mobile number
  if (data.adminPhone) {
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