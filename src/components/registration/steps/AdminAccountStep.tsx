// src/components/registration/steps/AdminAccountStep.tsx

"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Lock, Eye, EyeOff, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';

// ✅ FIXED IMPORTS - correct paths from steps/ folder
import { RegistrationService } from '../../../lib/firebase/registration';
import type { AdminAccountFormData } from '../../../types/registration';

// Validation schema - 6 fields (including confirmPassword)
const adminAccountSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s\.\-]+$/, 'Full name can only contain letters, spaces, dots, and hyphens'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters'),
  
  phone: z.string()
    .regex(/^(\+63|0)?[9][0-9]{9}$/, 'Please enter a valid Philippine mobile number')
    .transform(val => val.replace(/^0/, '+63')), // Auto-format to +63
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  confirmPassword: z.string(),
  
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(30, 'Subdomain cannot exceed 30 characters')
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Password strength checker
function checkPasswordStrength(password: string): { score: number; level: 'weak' | 'medium' | 'strong'; feedback: string } {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  
  const feedback = score < 3 ? 'Add more characters, uppercase, and numbers' : 
                   score < 5 ? 'Consider adding special characters' : 
                   'Strong password!';
  
  return {
    score,
    feedback,
    level: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'
  };
}

interface AdminAccountStepProps {
  registrationId: string;
  onNext: (data: AdminAccountFormData) => void;
  onBack: () => void;
  initialData?: AdminAccountFormData;
  companyName?: string; // For subdomain generation
}

export default function AdminAccountStep({ 
  registrationId, 
  onNext, 
  onBack, 
  initialData,
  companyName
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
      fullName: '',
      email: '',
      phone: '',
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

  // ✅ FIXED: Check subdomain availability with proper error handling
  const checkSubdomainAvailability = useCallback(
    async (subdomain: string) => {
      if (!subdomain || subdomain.length < 3) {
        setSubdomainAvailability(prev => ({ ...prev, available: null, error: null }));
        return;
      }

      setSubdomainAvailability(prev => ({ ...prev, checking: true, error: null }));

      try {
        // ✅ FIXED: Use the new optimized method that returns SubdomainAvailabilityResult
        const result = await RegistrationService.checkSubdomainAvailability(subdomain, registrationId);
        
        setSubdomainAvailability({
          checking: false,
          available: result.available,
          error: null
        });

        if (!result.available) {
          setError('subdomain', { 
            type: 'manual', 
            message: result.status === 'reserved' 
              ? 'This subdomain is reserved for system use' 
              : 'This subdomain is already taken. Please choose another.'
          });
        } else {
          clearErrors('subdomain');
        }
      } catch (error) {
        setSubdomainAvailability({
          checking: false,
          available: null,
          error: 'Failed to check availability'
        });
      }
    },
    [registrationId, setError, clearErrors]
  );

  // Debounced subdomain checking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedSubdomain) {
        checkSubdomainAvailability(watchedSubdomain);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedSubdomain, checkSubdomainAvailability]);

  // Generate subdomain from company name
  useEffect(() => {
    if (companyName && !initialData?.subdomain) {
      const generated = companyName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
      
      if (generated.length >= 3) {
        setValue('subdomain', generated, { shouldValidate: true });
      }
    }
  }, [companyName, setValue, initialData]);

  const handlePhoneFormat = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format Philippine mobile numbers
    if (value.startsWith('63')) {
      value = '+' + value;
    } else if (value.startsWith('9') && value.length === 10) {
      value = '+63' + value;
    } else if (value.startsWith('0')) {
      value = '+63' + value.substring(1);
    }
    
    setValue('phone', value, { shouldValidate: true });
  }, [setValue]);

  const onSubmit: SubmitHandler<AdminAccountFormData> = useCallback(async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Save to Firebase draft
      await RegistrationService.saveAdminAccount(registrationId, data);
      onNext(data);
    } catch (error) {
      console.error('Error saving admin account:', error);
      alert('Failed to save admin account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, registrationId, onNext]);

  const getSubdomainIcon = () => {
    if (subdomainAvailability.checking) {
      return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    } else if (subdomainAvailability.available === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (subdomainAvailability.available === false) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <Globe className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Account Setup</h1>
        <p className="text-lg text-gray-600">Create your administrator account and company portal</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="fullName"
              {...register('fullName')}
              className={`w-full px-4 py-3 pl-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full px-4 py-3 pl-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            This will be your login email and company contact
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              {...register('phone', { onChange: handlePhoneFormat })}
              className={`w-full px-4 py-3 pl-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="09XX XXX XXXX"
              disabled={isSubmitting}
            />
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password')}
              className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
              disabled={isSubmitting}
            />
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.level === 'weak' ? 'bg-red-500 w-1/3' :
                      passwordStrength.level === 'medium' ? 'bg-yellow-500 w-2/3' :
                      'bg-green-500 w-full'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.level === 'weak' ? 'text-red-600' :
                  passwordStrength.level === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.level.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{passwordStrength.feedback}</p>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              className={`w-full px-4 py-3 pl-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Company Subdomain */}
        <div>
          <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
            Company Portal URL *
          </label>
          <div className="flex items-center border-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
            <div className="flex items-center px-4 py-3 bg-gray-50 border-r border-gray-300 text-gray-600">
              <Globe className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-sm">https://</span>
            </div>
            <input
              type="text"
              id="subdomain"
              {...register('subdomain')}
              className={`flex-1 px-4 py-3 border-0 focus:ring-0 text-gray-900 placeholder-gray-400 ${
                errors.subdomain ? 'text-red-600' : ''
              }`}
              placeholder="yourcompany"
              disabled={isSubmitting}
            />
            <div className="flex items-center px-4 py-3 bg-gray-50 border-l border-gray-300 text-gray-600">
              <span className="text-sm">.sahod.solutions</span>
              <div className="ml-2">
                {getSubdomainIcon()}
              </div>
            </div>
          </div>
          
          {/* Subdomain Status */}
          {subdomainAvailability.checking && (
            <p className="mt-2 text-sm text-blue-600">Checking availability...</p>
          )}
          {subdomainAvailability.available === true && (
            <p className="mt-2 text-sm text-green-600">✓ Subdomain is available</p>
          )}
          {subdomainAvailability.available === false && (
            <p className="mt-2 text-sm text-red-600">✗ Subdomain is already taken</p>
          )}
          
          {errors.subdomain && (
            <p className="mt-2 text-sm text-red-600">{errors.subdomain.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            This will be your company's unique portal address
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border-2 border-gray-200"
            disabled={isSubmitting}
          >
            ← Back to Company Info
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting || subdomainAvailability.available === false}
            className={`flex-1 py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
              isValid && !isSubmitting && subdomainAvailability.available !== false
                ? 'bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Continue to Trial Activation →'
            )}
          </button>
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Step 2 of 3 - Admin Account Creation</p>
      </div>
    </div>
  );
}