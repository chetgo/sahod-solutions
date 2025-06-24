"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin, Users, Phone, Mail, User } from 'lucide-react';

// Import from our efficient structure
import { companyInfoSchema } from '../../../lib/validations/philippineValidators';
import { INDUSTRIES, PHILIPPINE_REGIONS, MAJOR_CITIES, EMPLOYEE_RANGES } from '../../../lib/constants/philippineData';
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
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialData?.industry || 'healthcare');
  const [selectedRegion, setSelectedRegion] = useState<string>(initialData?.region || 'National Capital Region (NCR)');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: initialData?.companyName || '',
      industry: initialData?.industry || 'healthcare',
      employeeCount: initialData?.employeeCount || '1-10',
      region: initialData?.region || 'National Capital Region (NCR)',
      city: initialData?.city || '',
      address: initialData?.address || '',
      adminName: initialData?.adminName || '',
      adminEmail: initialData?.adminEmail || '',
      adminPhone: initialData?.adminPhone || ''
    }
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  const watchedValues = watch();

  // Update available cities when region changes
  useEffect(() => {
    const cities = MAJOR_CITIES[selectedRegion as keyof typeof MAJOR_CITIES] || [];
    setAvailableCities(cities);
    
    // Reset city if region changed and current city is not in new region
    if (selectedRegion !== initialData?.region && cities.length > 0 && !cities.includes(watchedValues.city)) {
      setValue('city', '', { shouldValidate: true });
    }
  }, [selectedRegion, setValue, initialData?.region, watchedValues.city]);

  const onSubmit: SubmitHandler<CompanyInfoFormData> = useCallback(async (data) => {
    if (isSubmitting) return;
    
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

  const handleIndustrySelect = useCallback((industryId: string) => {
    setSelectedIndustry(industryId);
    setValue('industry', industryId as any, { shouldValidate: true, shouldDirty: true });
  }, [setValue]);

  const handleRegionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setValue('region', region, { shouldValidate: true, shouldDirty: true });
    setValue('city', '', { shouldValidate: true, shouldDirty: true });
  }, [setValue]);

  const popularIndustries = useMemo(() => INDUSTRIES.filter(industry => industry.popular), []);
  const otherIndustries = useMemo(() => INDUSTRIES.filter(industry => !industry.popular), []);

  return (
    <div className="max-w-4xl mx-auto p-6">
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

        <div className="flex items-center gap-2 text-sm h-5">
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 text-blue-600" />
            Industry *
          </label>
          
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Popular Industries</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularIndustries.map((industry) => (
                <div
                  key={industry.id}
                  onClick={() => handleIndustrySelect(industry.id)}
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

          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Other Industries</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {otherIndustries.map((industry) => (
                <div
                  key={industry.id}
                  onClick={() => handleIndustrySelect(industry.id)}
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
          
          <input type="hidden" {...register('industry')} />
          {errors.industry && (
            <p className="text-red-500 text-sm">{errors.industry.message}</p>
          )}
        </div>

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
              {EMPLOYEE_RANGES.map((range) => (
                <option key={range.value} value={range.value} className="text-gray-900">
                  {range.label} {range.popular ? '⭐' : ''}
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
              Philippine Region *
            </label>
            <select
              {...register('region')}
              onChange={handleRegionChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              {PHILIPPINE_REGIONS.map((region) => (
                <option key={region} value={region} className="text-gray-900">{region}</option>
              ))}
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm">{errors.region.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              City/Municipality *
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

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>All information is securely encrypted</span>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
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
      </form>

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