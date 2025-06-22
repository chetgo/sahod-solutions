// src/components/ui/forms/FormComponents.tsx
'use client';

import React, { forwardRef, useState } from 'react';
import { PHILIPPINE_INDUSTRIES } from '../../../lib/validations/philippineValidators';

// Base Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, required, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              block w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, required, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            block w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`
            block w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 resize-vertical
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          rows={4}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Industry Selector Component
interface IndustrySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export function IndustrySelector({ 
  value, 
  onChange, 
  error, 
  label = 'Industry',
  required = false 
}: IndustrySelectorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PHILIPPINE_INDUSTRIES.map((industry) => (
          <button
            key={industry.code}
            type="button"
            onClick={() => onChange(industry.code)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-center
              hover:shadow-md hover:scale-105
              ${value === industry.code
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }
            `}
          >
            <div className="text-2xl mb-2">{industry.icon}</div>
            <div className="text-sm font-medium">{industry.name}</div>
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// Philippine Government ID Input Component
interface PhilippineIDInputProps {
  type: 'tin' | 'sss' | 'philhealth' | 'pagibig';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function PhilippineIDInput({ 
  type, 
  value, 
  onChange, 
  error, 
  required = false 
}: PhilippineIDInputProps) {
  const [focused, setFocused] = useState(false);

  const configs = {
    tin: {
      label: 'Tax Identification Number (TIN)',
      placeholder: '123-456-789-000',
      helpText: 'BIR registered TIN for your company',
      maxLength: 15,
      format: (val: string) => {
        const clean = val.replace(/\D/g, '');
        if (clean.length <= 3) return clean;
        if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
        if (clean.length <= 9) return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
        return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}-${clean.slice(9, 12)}`;
      }
    },
    sss: {
      label: 'SSS Employer Number',
      placeholder: '03-1234567-8',
      helpText: 'Social Security System employer ID',
      maxLength: 12,
      format: (val: string) => {
        const clean = val.replace(/\D/g, '');
        if (clean.length <= 2) return clean;
        if (clean.length <= 9) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
        return `${clean.slice(0, 2)}-${clean.slice(2, 9)}-${clean.slice(9, 10)}`;
      }
    },
    philhealth: {
      label: 'PhilHealth Number',
      placeholder: '12345678901',
      helpText: 'Philippine Health Insurance Corporation ID',
      maxLength: 11,
      format: (val: string) => val.replace(/\D/g, '').slice(0, 11)
    },
    pagibig: {
      label: 'Pag-IBIG Number',
      placeholder: '1234567890123',
      helpText: 'Home Development Mutual Fund ID',
      maxLength: 13,
      format: (val: string) => val.replace(/\D/g, '').slice(0, 13)
    }
  };

  const config = configs[type];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = config.format(e.target.value);
    onChange(formatted);
  };

  return (
    <Input
      label={config.label}
      value={value}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={config.placeholder}
      helpText={config.helpText}
      error={error}
      required={required}
      maxLength={config.maxLength}
      className={focused ? 'ring-2 ring-blue-200' : ''}
    />
  );
}

// Philippine Mobile Input Component
interface PhilippineMobileInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export function PhilippineMobileInput({ 
  value, 
  onChange, 
  error, 
  label = 'Mobile Number',
  required = false 
}: PhilippineMobileInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    
    // Auto-format as user types
    if (val.startsWith('639')) {
      const number = val.slice(2);
      if (number.length <= 3) {
        onChange(`+63 ${number}`);
      } else if (number.length <= 6) {
        onChange(`+63 ${number.slice(0, 3)} ${number.slice(3)}`);
      } else {
        onChange(`+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`);
      }
    } else if (val.startsWith('09')) {
      const number = val.slice(1);
      if (number.length <= 3) {
        onChange(`+63 ${number}`);
      } else if (number.length <= 6) {
        onChange(`+63 ${number.slice(0, 3)} ${number.slice(3)}`);
      } else {
        onChange(`+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`);
      }
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <Input
      label={label}
      value={value}
      onChange={handleChange}
      placeholder="+63 912 345 6789"
      helpText="Philippine mobile number"
      error={error}
      required={required}
      icon={
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      }
    />
  );
}

// Pricing Card Component
interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    period: string;
    features: string[];
    popular?: boolean;
    description?: string;
  };
  selected?: boolean;
  onSelect: (planId: string) => void;
  employeeCount?: number;
}

export function PricingCard({ plan, selected, onSelect, employeeCount = 50 }: PricingCardProps) {
  const totalPrice = plan.price * employeeCount;

  return (
    <div
      className={`
        relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
        ${plan.popular ? 'ring-2 ring-yellow-400' : ''}
      `}
      onClick={() => onSelect(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
            ⭐ Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        {plan.description && (
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
        )}
        
        <div className="mb-2">
          <span className="text-3xl font-bold text-blue-600">₱{plan.price}</span>
          <span className="text-gray-600 ml-1">{plan.period}</span>
        </div>
        
        <div className="text-sm text-gray-500">
          Total: ₱{totalPrice.toLocaleString()}/month for {employeeCount} employees
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`
          w-full py-3 rounded-lg font-semibold transition-colors
          ${selected
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {selected ? 'Selected' : 'Select Plan'}
      </button>
    </div>
  );
}

// Form Grid Layout Component
interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function FormGrid({ children, columns = 1, className = '' }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
}

// Loading Spinner Component
export function LoadingSpinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ${className}`} />
  );
}

// Philippine Flag Accent Component
export function PhilippineFlagAccent({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-0.5">
        <div className="w-1.5 h-3 bg-blue-600 rounded-sm"></div>
        <div className="w-1.5 h-3 bg-yellow-400 rounded-sm"></div>
        <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
      </div>
      <span className="text-sm text-gray-500">Proudly made in the Philippines</span>
    </div>
  );
}

// Success/Error Alert Components
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ type, title, children, onDismiss, className = '' }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800', 
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[type]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-2 hover:opacity-70"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}