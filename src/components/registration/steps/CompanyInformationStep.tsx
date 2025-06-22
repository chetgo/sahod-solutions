// 📁 src/components/registration/steps/CompanyInformationStep.tsx (UPDATE - Fix input styles and performance)
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin, Users, Phone, Mail, User } from 'lucide-react';

// Import validation schema and data
import { companyInfoSchema, PHILIPPINE_INDUSTRIES, EMPLOYEE_COUNT_RANGES, PHILIPPINE_REGIONS, METRO_MANILA_CITIES } from '../../../lib/validations/philippineValidators';
import { RegistrationService } from '../../../lib/firebase/registration';
import type { CompanyInfoFormData } from '../../../types/registration';

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
  const [selectedRegion, setSelectedRegion] = useState<string>(initialData?.region || '');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: initialData?.companyName || '',
      industry: initialData?.industry || '',
      employeeCount: initialData?.employeeCount || '',
      region: initialData?.region || '',
      city: initialData?.city || '',
      address: initialData?.address || '',
      adminName: initialData?.adminName || '',
      adminEmail: initialData?.adminEmail || '',
      adminPhone: initialData?.adminPhone || ''
    }
  });

  const watchedValues = watch();

  // Memoize auto-saver to prevent recreation on every render
  const autoSaver = useMemo(() => 
    RegistrationService.createAutoSaver(registrationId, 1), 
    [registrationId]
  );

  // Update available cities when region changes
  useEffect(() => {
    if (selectedRegion.includes('National Capital Region')) {
      setAvailableCities(METRO_MANILA_CITIES);
    } else {
      setAvailableCities([]);
    }
    if (selectedRegion !== initialData?.region) {
      setValue('city', '');
    }
  }, [selectedRegion, setValue, initialData?.region]);

  // Optimized auto-save functionality with debouncing
  useEffect(() => {
    // Only auto-save if we have meaningful data
    if (watchedValues.companyName && watchedValues.companyName.length >= 3) {
      setIsAutoSaving(true);
      
      autoSaver(watchedValues);
      
      // Set saved indicator after a short delay
      const timer = setTimeout(() => {
        setIsAutoSaving(false);
        setLastSaved(new Date());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [watchedValues.companyName, watchedValues.adminName, watchedValues.adminEmail, autoSaver]);

  const onSubmit = useCallback(async (data: CompanyInfoFormData) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await RegistrationService.saveCompanyInfo(registrationId, data);
      onNext(data);
    } catch (error) {
      console.error('Error saving company information:', error);
      alert('Failed to save company information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [registrationId, onNext, isSubmitting]);

  const handleIndustrySelect = useCallback((industryCode: string) => {
    setSelectedIndustry(industryCode);
    setValue('industry', industryCode, { shouldValidate: true });
  }, [setValue]);

  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
    setValue('region', region, { shouldValidate: true });
  }, [setValue]);

  const handleSaveDraft = useCallback(async () => {
    try {
      await RegistrationService.saveCompanyInfo(registrationId, watchedValues);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  }, [registrationId, watchedValues]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            1
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tell us about your company</h2>
            <p className="text-gray-600">Let's start with the basics about your Filipino business</p>
          </div>
        </div>

        {/* Auto-save indicator - Only show when actually saving */}
        <div className="flex items-center gap-2 text-sm min-h-[20px]">
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Auto-saving...</span>
            </div>
          )}
          {!isAutoSaving && lastSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Company Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Building2 className="w-4 h-4 text-blue-600" />
            Company Name *
          </label>
          <input
            {...register('companyName')}
            type="text"
            placeholder="e.g., ABC Manufacturing Corp"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 bg-white"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName.message}</p>
          )}
          <p className="text-gray-500 text-sm">This will appear on your payslips and reports</p>
        </div>

        {/* Industry Selection */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 text-blue-600" />
            Industry *
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHILIPPINE_INDUSTRIES.map((industry) => (
              <div
                key={industry.code}
                onClick={() => handleIndustrySelect(industry.code)}
                className={`
                  border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md text-center
                  ${selectedIndustry === industry.code 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                  }
                `}
              >
                <div className="text-xl mb-1">{industry.icon}</div>
                <div className="font-medium text-sm text-gray-900">{industry.name}</div>
              </div>
            ))}
          </div>
          
          <input type="hidden" {...register('industry')} />
          {errors.industry && (
            <p className="text-red-500 text-sm">{errors.industry.message}</p>
          )}
        </div>

        {/* Employee Count and Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 text-blue-600" />
              Number of Employees *
            </label>
            <select
              {...register('employeeCount')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="" className="text-gray-500">Select employee count</option>
              {EMPLOYEE_COUNT_RANGES.map((range) => (
                <option key={range.value} value={range.value} className="text-gray-900">
                  {range.label}
                </option>
              ))}
            </select>
            {errors.employeeCount && (
              <p className="text-red-500 text-sm">{errors.employeeCount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              Region *
            </label>
            <select
              {...register('region')}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="" className="text-gray-500">Select region</option>
              {PHILIPPINE_REGIONS.map((region) => (
                <option key={region.code} value={region.name} className="text-gray-900">{region.name}</option>
              ))}
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm">{errors.region.message}</p>
            )}
          </div>
        </div>

        {/* City and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              City *
            </label>
            {availableCities.length > 0 ? (
              <select
                {...register('city')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="" className="text-gray-500">Select city</option>
                {availableCities.map((city) => (
                  <option key={city} value={city} className="text-gray-900">{city}</option>
                ))}
                <option value="other" className="text-gray-900">Other</option>
              </select>
            ) : (
              <input
                {...register('city')}
                type="text"
                placeholder="Enter city name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
              />
            )}
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building2 className="w-4 h-4 text-blue-600" />
              Complete Address *
            </label>
            <textarea
              {...register('address')}
              placeholder="e.g., 123 Industrial Avenue, Barangay San Antonio"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500 bg-white"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Admin Information */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900 mb-4">
            <User className="w-5 h-5" />
            Company Administrator
          </h3>
          <p className="text-blue-700 text-sm mb-4">This person will have full access to manage payroll and employees</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name *</label>
              <input
                {...register('adminName')}
                type="text"
                placeholder="Juan Dela Cruz"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
              />
              {errors.adminName && (
                <p className="text-red-500 text-sm">{errors.adminName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4" />
                Email Address *
              </label>
              <input
                {...register('adminEmail')}
                type="email"
                placeholder="admin@yourcompany.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
              />
              {errors.adminEmail && (
                <p className="text-red-500 text-sm">{errors.adminEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4" />
                Phone Number *
              </label>
              <input
                {...register('adminPhone')}
                type="tel"
                placeholder="+63 912 345 6789"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
              />
              {errors.adminPhone && (
                <p className="text-red-500 text-sm">{errors.adminPhone.message}</p>
              )}
              <p className="text-gray-500 text-sm">Format: +63 912 345 6789 or 09123456789</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>All information is securely encrypted</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={!watchedValues.companyName}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue to Business Details</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Step 1 of 5 - Company Information</p>
      </div>
    </div>
  );
}