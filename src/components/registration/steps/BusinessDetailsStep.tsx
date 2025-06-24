"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Shield, FileText, Clock, Calendar } from 'lucide-react';
import { BusinessDetailsFormData } from '../../../types/registration';
import { businessDetailsSchema } from '../../../lib/validations/philippineValidators';
import { RegistrationService } from '../../../lib/firebase/registration';

interface BusinessDetailsStepProps {
  registrationId: string;
  onNext: (data: BusinessDetailsFormData) => void;
  onBack: () => void;
  initialData?: BusinessDetailsFormData | null;
}

const PAYROLL_SCHEDULES = [
  { value: 'weekly' as const, label: 'Weekly (Every Friday)', description: 'Good for daily workers and construction' },
  { value: 'bi-monthly' as const, label: 'Bi-monthly (15th & 30th)', description: 'Most common for Filipino businesses' },
  { value: 'monthly' as const, label: 'Monthly (End of month)', description: 'Common for salaried employees' }
];

const WORKING_DAY_OPTIONS = [
  { value: 'mon-fri' as const, label: 'Monday to Friday (5 days)', description: 'Standard office schedule' },
  { value: 'mon-sat' as const, label: 'Monday to Saturday (6 days)', description: 'Common for retail and manufacturing' },
  { value: 'custom' as const, label: 'Custom Schedule', description: 'Define your own working days' }
];

const BUSINESS_REGISTRATION_TYPES = [
  { value: 'sec' as const, label: 'SEC Corporation', description: 'Securities and Exchange Commission' },
  { value: 'dti' as const, label: 'DTI Sole Proprietorship', description: 'Department of Trade and Industry' },
  { value: 'cda' as const, label: 'CDA Cooperative', description: 'Cooperative Development Authority' },
  { value: 'other' as const, label: 'Other', description: 'Other business registration' }
];

// Input formatters for government IDs
const formatTIN = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 9)}-${numbers.slice(9, 12)}`;
};

const formatSSS = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 9) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 9)}-${numbers.slice(9, 10)}`;
};

const formatPhilHealth = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 11);
};

const formatPagIBIG = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 13);
};

export default function BusinessDetailsStep({ 
  registrationId, 
  onNext, 
  onBack, 
  initialData 
}: BusinessDetailsStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BusinessDetailsFormData>({
    resolver: zodResolver(businessDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      tin: initialData?.tin ?? '',
      sssNumber: initialData?.sssNumber ?? '',
      philhealthNumber: initialData?.philhealthNumber ?? '',
      pagibigNumber: initialData?.pagibigNumber ?? '',
      businessRegistration: initialData?.businessRegistration ?? '',
      businessRegistrationType: initialData?.businessRegistrationType ?? 'sec',
      payrollSchedule: initialData?.payrollSchedule ?? 'bi-monthly',
      workingDays: initialData?.workingDays ?? 'mon-fri',
      overtimeRate: initialData?.overtimeRate ?? 1.25,
      nightDifferentialRate: initialData?.nightDifferentialRate ?? 1.10,
      holidayRate: initialData?.holidayRate ?? 2.0
    }
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  const watchedValues = watch();

  // Custom input handlers with formatting
  const handleTINChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTIN(e.target.value);
    setValue('tin', formatted, { shouldValidate: true });
  }, [setValue]);

  const handleSSSChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSS(e.target.value);
    setValue('sssNumber', formatted, { shouldValidate: true });
  }, [setValue]);

  const handlePhilHealthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhilHealth(e.target.value);
    setValue('philhealthNumber', formatted, { shouldValidate: true });
  }, [setValue]);

  const handlePagIBIGChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPagIBIG(e.target.value);
    setValue('pagibigNumber', formatted, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = useCallback(async (data: BusinessDetailsFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await RegistrationService.saveBusinessDetails(registrationId, data);
      onNext(data);
    } catch (error) {
      console.error('Error saving business details:', error);
      alert('Failed to save business details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [registrationId, onNext, isSubmitting]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            2
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Philippine Government Compliance</h2>
            <p className="text-gray-600">Required information for labor law compliance and government reporting</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm h-5">
        </div>
      </div>

      <div className="space-y-8">
        {/* Government ID Numbers Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Government Registration Numbers</h3>
              <p className="text-sm text-gray-600">All numbers required for Philippine payroll compliance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tax Identification Number (TIN) *
              </label>
              <input
                type="text"
                value={watchedValues.tin}
                onChange={handleTINChange}
                placeholder="123-456-789-000"
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.tin && <p className="text-red-500 text-sm">{errors.tin.message}</p>}
              <p className="text-gray-500 text-sm">BIR registered TIN in format: 123-456-789-000</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                SSS Employer Number *
              </label>
              <input
                type="text"
                value={watchedValues.sssNumber}
                onChange={handleSSSChange}
                placeholder="03-1234567-8"
                maxLength={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.sssNumber && <p className="text-red-500 text-sm">{errors.sssNumber.message}</p>}
              <p className="text-gray-500 text-sm">Social Security System ID in format: 03-1234567-8</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                PhilHealth Number *
              </label>
              <input
                type="text"
                value={watchedValues.philhealthNumber}
                onChange={handlePhilHealthChange}
                placeholder="12345678901"
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.philhealthNumber && <p className="text-red-500 text-sm">{errors.philhealthNumber.message}</p>}
              <p className="text-gray-500 text-sm">Philippine Health Insurance Corporation (11 digits)</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pag-IBIG Number *
              </label>
              <input
                type="text"
                value={watchedValues.pagibigNumber}
                onChange={handlePagIBIGChange}
                placeholder="1234567890123"
                maxLength={13}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.pagibigNumber && <p className="text-red-500 text-sm">{errors.pagibigNumber.message}</p>}
              <p className="text-gray-500 text-sm">Home Development Mutual Fund (13 digits)</p>
            </div>
          </div>
        </div>

        {/* Business Registration Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Business Registration</h3>
              <p className="text-sm text-gray-600">Legal business entity information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Registration Type *</label>
              <select
                {...register('businessRegistrationType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                {BUSINESS_REGISTRATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
              {errors.businessRegistrationType && <p className="text-red-500 text-sm">{errors.businessRegistrationType.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                {...register('businessRegistration')}
                type="text"
                placeholder="CS201234567 or similar"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
              {errors.businessRegistration && <p className="text-red-500 text-sm">{errors.businessRegistration.message}</p>}
              <p className="text-gray-500 text-sm">SEC Registration, DTI Business Name, or other registration number</p>
            </div>
          </div>
        </div>

        {/* Payroll Configuration Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payroll Configuration</h3>
              <p className="text-sm text-gray-600">Set up your payroll schedule and policies</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Payroll Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Payroll Schedule *</label>
              <div className="grid grid-cols-1 gap-3">
                {PAYROLL_SCHEDULES.map((schedule) => (
                  <label
                    key={schedule.value}
                    className={`
                      flex items-center p-4 border rounded-lg cursor-pointer transition-all
                      ${watchedValues.payrollSchedule === schedule.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={schedule.value}
                      {...register('payrollSchedule')}
                      className="mr-3 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{schedule.label}</div>
                      <div className="text-sm text-gray-600">{schedule.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.payrollSchedule && <p className="text-red-500 text-sm">{errors.payrollSchedule.message}</p>}
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Working Days *</label>
              <div className="grid grid-cols-1 gap-3">
                {WORKING_DAY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center p-4 border rounded-lg cursor-pointer transition-all
                      ${watchedValues.workingDays === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('workingDays')}
                      className="mr-3 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.workingDays && <p className="text-red-500 text-sm">{errors.workingDays.message}</p>}
            </div>
          </div>
        </div>

        {/* Labor Law Rates Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Philippine Labor Law Rates</h3>
              <p className="text-sm text-gray-600">Standard rates according to Philippine Labor Code</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Overtime Rate Multiplier *</label>
              <input
                {...register('overtimeRate', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="1"
                max="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.overtimeRate && <p className="text-red-500 text-sm">{errors.overtimeRate.message}</p>}
              <p className="text-gray-500 text-sm">Standard: 1.25 (125% of regular rate)</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Night Differential Rate *</label>
              <input
                {...register('nightDifferentialRate', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="1"
                max="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.nightDifferentialRate && <p className="text-red-500 text-sm">{errors.nightDifferentialRate.message}</p>}
              <p className="text-gray-500 text-sm">Standard: 1.10 (110% of regular rate)</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Holiday Rate Multiplier *</label>
              <input
                {...register('holidayRate', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="1"
                max="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 bg-white"
              />
              {errors.holidayRate && <p className="text-red-500 text-sm">{errors.holidayRate.message}</p>}
              <p className="text-gray-500 text-sm">Standard: 2.0 (200% of regular rate)</p>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Philippine Labor Law Compliance</h4>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                These settings ensure your payroll system complies with Philippine labor regulations. 
                All rates follow the Labor Code of the Philippines and current DOLE guidelines.
              </p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Government IDs are validated for proper formatting</li>
                <li>• Overtime rates comply with Article 87 of the Labor Code</li>
                <li>• Night differential follows Article 86 requirements</li>
                <li>• Holiday pay rates adhere to Republic Act No. 9492</li>
              </ul>
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
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Company Info
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
                  <span>Continue to Admin Account</span>
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
          <div className="w-8 h-1 bg-yellow-500 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Step 2 of 5 - Business Compliance Details</p>
      </div>
    </div>
  );
}