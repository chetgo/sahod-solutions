import React, { forwardRef, useState } from 'react';

// Base Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-colors text-gray-900 placeholder-gray-500 bg-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {helpText && <p className="text-gray-500 text-sm">{helpText}</p>}
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
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, required, options, className = '', ...props }, ref) => {
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
            w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            text-gray-900 bg-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {helpText && <p className="text-gray-500 text-sm">{helpText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// TextArea Component
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
            w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            resize-none text-gray-900 placeholder-gray-500 bg-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {helpText && <p className="text-gray-500 text-sm">{helpText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

// Industry Selector Component
interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  popular?: boolean;
}

interface IndustrySelectorProps {
  industries: Industry[];
  selectedIndustry: string;
  onSelect: (industryId: string) => void;
  error?: string;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industries,
  selectedIndustry,
  onSelect,
  error
}) => {
  const popularIndustries = industries.filter(industry => industry.popular);
  const otherIndustries = industries.filter(industry => !industry.popular);

  return (
    <div className="space-y-4">
      {/* Popular Industries */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-3">Popular Industries</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularIndustries.map((industry) => (
            <div
              key={industry.id}
              onClick={() => onSelect(industry.id)}
              className={`
                border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md text-center
                ${selectedIndustry === industry.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 bg-white'
                }
              `}
            >
              <div className="text-xl mb-1">{industry.icon}</div>
              <div className="font-medium text-sm text-gray-900">{industry.name}</div>
              <div className="text-xs text-gray-600 mt-1">{industry.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Industries */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-3">Other Industries</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {otherIndustries.map((industry) => (
            <div
              key={industry.id}
              onClick={() => onSelect(industry.id)}
              className={`
                border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md text-center
                ${selectedIndustry === industry.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 bg-white'
                }
              `}
            >
              <div className="text-lg mb-1">{industry.icon}</div>
              <div className="font-medium text-xs text-gray-900">{industry.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

// Form Field Wrapper
interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  error,
  helpText,
  required
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {helpText && <p className="text-gray-500 text-sm">{helpText}</p>}
    </div>
  );
};

// Form Error Component
interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
};