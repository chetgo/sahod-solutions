"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminAccountSchema } from '../../../lib/validations/philippineValidators';
import { RegistrationService } from '../../../lib/firebase/registration';
import type { AdminAccountFormData } from '../../../types/registration';

interface AdminAccountStepProps {
  registrationId: string;
  onNext: (data: AdminAccountFormData) => void;
  onBack: () => void;
  initialData?: AdminAccountFormData;
}

// Helper function to generate subdomain from company name
function generateSubdomainFromName(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 30); // Limit to 30 characters
}

// Password strength checker
function checkPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    checks,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'
  };
}

export default function AdminAccountStep({ 
  registrationId, 
  onNext, 
  onBack, 
  initialData 
}: AdminAccountStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subdomainAvailability, setSubdomainAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
    error: string | null;
  }>({
    checking: false,
    available: null,
    error: null
  });
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof checkPasswordStrength> | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid }
  } = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      email: '',
      password: '',
      confirmPassword: '',
      subdomain: ''
    }
  });

  const watchedPassword = watch('password');
  const watchedSubdomain = watch('subdomain');

  // Check password strength when password changes
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(checkPasswordStrength(watchedPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [watchedPassword]);

  // Check subdomain availability with debounce
  const checkSubdomainAvailability = useCallback(
    async (subdomain: string) => {
      if (!subdomain || subdomain.length < 3) {
        setSubdomainAvailability(prev => ({ ...prev, available: null, error: null }));
        return;
      }

      setSubdomainAvailability(prev => ({ ...prev, checking: true, error: null }));

      try {
        const isAvailable = await RegistrationService.checkSubdomainAvailability(subdomain, registrationId);
        setSubdomainAvailability({
          checking: false,
          available: isAvailable,
          error: null
        });

        if (!isAvailable) {
          setError('subdomain', { 
            type: 'manual', 
            message: 'This subdomain is already taken. Please choose another.' 
          });
        } else {
          clearErrors('subdomain');
        }
      } catch (error) {
        setSubdomainAvailability({
          checking: false,
          available: null,
          error: 'Error checking availability'
        });
      }
    },
    [setError, clearErrors, registrationId]
  );

  // Debounced subdomain checking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedSubdomain) {
        checkSubdomainAvailability(watchedSubdomain);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [watchedSubdomain, checkSubdomainAvailability]);

  // Auto-generate subdomain from company name
  const handleGenerateSubdomain = async () => {
    try {
      // Get registration data to access company name
      const regData = await RegistrationService.getRegistration(registrationId);
      if (regData?.companyInfo?.companyName) {
        const generatedSubdomain = generateSubdomainFromName(regData.companyInfo.companyName);
        setValue('subdomain', generatedSubdomain);
      }
    } catch (error) {
      console.error('Error generating subdomain:', error);
    }
  };

  const onSubmit = async (data: AdminAccountFormData) => {
    setIsSubmitting(true);

    try {
      // Save admin account data to Firebase draft
      await RegistrationService.saveAdminAccount(registrationId, data);
      
      // Move to next step
      onNext(data);
    } catch (error) {
      console.error('Error saving admin account:', error);
      // You could add a toast notification here for better UX
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            👤
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Admin Account</h2>
          <p className="text-gray-600">
            Set up your login credentials and company access URL
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="admin@yourcompany.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This will be your login email for Sahod.solutions
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 text-gray-900 placeholder-gray-400 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M13.12 14.12L16.95 17.95" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            
            {/* Password Strength Indicator */}
            {passwordStrength && watchedPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength === 'weak' ? 'text-red-600' :
                    passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.strength.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded ${
                        i < passwordStrength.score
                          ? passwordStrength.strength === 'weak' ? 'bg-red-500' :
                            passwordStrength.strength === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className={passwordStrength.checks.length ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </div>
                  <div className={passwordStrength.checks.lowercase ? 'text-green-600' : ''}>
                    ✓ Lowercase letter
                  </div>
                  <div className={passwordStrength.checks.uppercase ? 'text-green-600' : ''}>
                    ✓ Uppercase letter
                  </div>
                  <div className={passwordStrength.checks.number ? 'text-green-600' : ''}>
                    ✓ Number
                  </div>
                  <div className={passwordStrength.checks.special ? 'text-green-600' : ''}>
                    ✓ Special character (@$!%*?&)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Company Subdomain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company URL <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                {...register('subdomain', {
                  onChange: (e) => {
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-+/g, '-')
                      .substring(0, 30);
                    setValue('subdomain', value);
                  }
                })}
                className={`flex-1 px-4 py-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                  errors.subdomain ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="yourcompany"
                maxLength={30}
              />
              <div className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 font-medium">
                .sahod.solutions
              </div>
            </div>
            
            {/* Subdomain Status */}
            <div className="mt-2 flex items-center gap-2">
              {subdomainAvailability.checking && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  Checking availability...
                </div>
              )}
              {subdomainAvailability.available === true && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Available!
                </div>
              )}
              {subdomainAvailability.available === false && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Already taken
                </div>
              )}
              <button
                type="button"
                onClick={handleGenerateSubdomain}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Auto-generate
              </button>
            </div>
            
            {errors.subdomain && (
              <p className="mt-1 text-sm text-red-600">{errors.subdomain.message}</p>
            )}
            
            <p className="mt-1 text-xs text-gray-500">
              Your employees will access: <strong>{watchedSubdomain || 'yourcompany'}.sahod.solutions</strong>
            </p>
          </div>

          {/* Success Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                🎉
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Almost there!</h4>
                <p className="text-sm text-blue-800">
                  After this step, you'll have immediate access to your company dashboard. 
                  You can add employees and start using the time tracking system right away!
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Back
            </button>
            
            <button
              type="submit"
              disabled={!isValid || isSubmitting || subdomainAvailability.available === false}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Continue to Plan Selection →'
              )}
            </button>
          </div>
        </form>
            
      </div>
    </div>
  );
}
         