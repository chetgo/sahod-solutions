// src/components/registration/steps/CompanyInformationStep.tsx

"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin } from 'lucide-react';
import { z } from 'zod';

// Import from our efficient structure
import { INDUSTRIES } from '../../../lib/constants/philippineData';
import { RegistrationService } from '../../../lib/firebase/registration';
import type { CompanyInfoFormData } from '../../../types/registration';

// Validation schema - only 3 fields
const companyInfoSchema = z.object({
  companyName: z.string()
    .min(3, 'Company name must be at least 3 characters')
    .max(100, 'Company name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.\,\&]+$/, 'Company name contains invalid characters'),
  
  industry: z.enum(INDUSTRIES.map(i => i.id) as [string, ...string[]], { 
    errorMap: () => ({ message: 'Please select a valid industry' }) 
  }),
  
  address: z.string()
    .min(10, 'Complete address is required')
    .max(200, 'Address is too long'),
});

interface CompanyInformationStepProps {
  registrationId: string;
  onNext: (data: CompanyInfoFormData) => void;
  initialData?: Partial<CompanyInfoFormData>;
}

export default function CompanyInformationStep({ 
  registrationId, 
  onNext, 
  initialData 
}: CompanyInformationStepProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialData?.industry || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: initialData?.companyName || '',
      industry: initialData?.industry || '',
      address: initialData?.address || ''
    }
  });

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = form;

  const onSubmit: SubmitHandler<CompanyInfoFormData> = useCallback(async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Save to Firebase draft
      await RegistrationService.saveCompanyInfo(registrationId, data);
      onNext(data);
    } catch (error) {
      console.error('Error saving company information:', error);
      alert('Failed to save company information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, registrationId, onNext]);

  const handleIndustrySelect = useCallback((industryId: string) => {
    setSelectedIndustry(industryId);
    setValue('industry', industryId, { shouldValidate: true });
  }, [setValue]);

  // Memoized industry options for performance
  const industryOptions = useMemo(() => 
    INDUSTRIES.map(industry => ({
      ...industry,
      isSelected: selectedIndustry === industry.id
    })), 
    [selectedIndustry]
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Information</h1>
        <p className="text-lg text-gray-600">Let's start with the basics about your company</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="companyName"
              {...register('companyName')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.companyName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your company name"
              disabled={isSubmitting}
            />
            <Building2 className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {errors.companyName && (
            <p className="mt-2 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Industry Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {industryOptions.map((industry) => (
              <button
                key={industry.id}
                type="button"
                onClick={() => handleIndustrySelect(industry.id)}
                className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  industry.isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{industry.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{industry.description}</div>
                  </div>
                  {industry.isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.industry && (
            <p className="mt-2 text-sm text-red-600">{errors.industry.message}</p>
          )}
        </div>

        {/* Company Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Company Address *
          </label>
          <div className="relative">
            <textarea
              id="address"
              {...register('address')}
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 resize-none ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your complete company address"
              disabled={isSubmitting}
            />
            <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {errors.address && (
            <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Include complete address with city and postal code
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
              isValid && !isSubmitting
                ? 'bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Saving...
              </>
            ) : (
              'Continue to Admin Account →'
            )}
          </button>
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Step 1 of 3 - Company Information</p>
      </div>
    </div>
  );
}