// src/components/registration/ProgressIndicator.tsx
'use client';

import React from 'react';
import { useWizard, STEPS } from './WizardContext';

interface ProgressIndicatorProps {
  className?: string;
}

export default function ProgressIndicator({ className = '' }: ProgressIndicatorProps) {
  const { state } = useWizard();
  const { currentStep, completedSteps } = state;

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className={`bg-gray-100 p-6 border-b border-gray-200 ${className}`}>
      {/* Step indicators */}
      <div className="flex justify-between items-center mb-4 relative">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="flex flex-col items-center relative flex-1">
              {/* Step circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  relative z-10 transition-all duration-300
                  ${status === 'completed' 
                    ? 'bg-yellow-500 text-white shadow-md' 
                    : status === 'active'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                    : 'bg-gray-300 text-gray-600'
                  }
                `}
              >
                {status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Step label */}
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-medium transition-colors duration-300 ${
                    status === 'active'
                      ? 'text-blue-600'
                      : status === 'completed'
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 hidden sm:block mt-1">
                  {step.description}
                </div>
              </div>

              {/* Connection line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors duration-300
                    ${completedSteps.includes(step.id) ? 'bg-yellow-400' : 'bg-gray-300'}
                  `}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-yellow-400 to-red-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Progress percentage */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-600">
            Step {currentStep} of {STEPS.length}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {Math.round(progressPercentage)}% Complete
          </div>
        </div>
      </div>

      {/* Philippine flag accent */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-3 bg-blue-600 rounded-sm"></div>
            <div className="w-1.5 h-3 bg-yellow-400 rounded-sm"></div>
            <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
          </div>
          <span>Proudly made in the Philippines</span>
        </div>
      </div>
    </div>
  );
}

// Utility function to check if step can be accessed
export function canAccessStep(stepId: number, completedSteps: number[], currentStep: number): boolean {
  // Always allow access to current step and completed steps
  if (stepId === currentStep || completedSteps.includes(stepId)) {
    return true;
  }
  
  // Allow access to next step if current step is completed
  if (stepId === currentStep + 1 && completedSteps.includes(currentStep)) {
    return true;
  }
  
  // For steps 4 and 5 (plan selection and payment), allow access after step 3
  if (stepId >= 4 && completedSteps.includes(3)) {
    return true;
  }
  
  return false;
}

// Step validation helpers
export const stepValidators = {
  // Step 1: Company Info validation
  validateCompanyInfo: (data: any) => {
    const errors: string[] = [];
    
    if (!data.name?.trim()) errors.push('Company name is required');
    if (!data.industry) errors.push('Industry selection is required');
    if (!data.employeeCount) errors.push('Employee count is required');
    if (!data.location) errors.push('Company location is required');
    if (!data.address?.trim()) errors.push('Company address is required');
    if (!data.adminName?.trim()) errors.push('Admin name is required');
    if (!data.adminPhone?.trim()) errors.push('Admin phone number is required');
    
    return errors;
  },

  // Step 2: Business Details validation
  validateBusinessDetails: (data: any) => {
    const errors: string[] = [];
    
    if (!data.tin?.match(/^\d{3}-\d{3}-\d{3}-\d{3}$/)) {
      errors.push('Valid TIN format required (###-###-###-###)');
    }
    if (!data.sssNumber?.match(/^\d{2}-\d{7}-\d$/)) {
      errors.push('Valid SSS number format required (##-#######-#)');
    }
    if (!data.philhealthNumber?.match(/^\d{11}$/)) {
      errors.push('Valid PhilHealth number required (11 digits)');
    }
    if (!data.pagibigNumber?.match(/^\d{13}$/)) {
      errors.push('Valid Pag-IBIG number required (13 digits)');
    }
    if (!data.payrollSchedule) errors.push('Payroll schedule is required');
    if (!data.workingDays) errors.push('Working days configuration is required');
    
    return errors;
  },

  // Step 3: Admin Account validation
  validateAdminAccount: (data: any) => {
    const errors: string[] = [];
    
    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Valid email address is required');
    }
    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
    if (!data.companySubdomain?.match(/^[a-z0-9-]+$/)) {
      errors.push('Valid company subdomain is required (lowercase, numbers, hyphens only)');
    }
    
    return errors;
  },

  // Step 4: Plan Selection validation
  validatePlanSelection: (data: any) => {
    const errors: string[] = [];
    
    if (!data.selectedPlan) errors.push('Plan selection is required');
    if (!data.employeeCount || data.employeeCount < 1) {
      errors.push('Valid employee count is required');
    }
    
    return errors;
  },

  // Step 5: Payment Setup validation
  validatePaymentSetup: (data: any) => {
    const errors: string[] = [];
    
    if (!data.paymentMethod) errors.push('Payment method is required');
    if (!data.termsAccepted) errors.push('You must accept the terms of service');
    
    if (data.paymentMethod === 'credit_card') {
      if (!data.cardNumber?.replace(/\s/g, '').match(/^\d{16}$/)) {
        errors.push('Valid 16-digit card number is required');
      }
      if (!data.cardholderName?.trim()) errors.push('Cardholder name is required');
      if (!data.expiryDate?.match(/^\d{2}\/\d{2}$/)) {
        errors.push('Valid expiry date is required (MM/YY)');
      }
      if (!data.cvv?.match(/^\d{3,4}$/)) {
        errors.push('Valid CVV is required (3-4 digits)');
      }
    }
    
    return errors;
  }
};