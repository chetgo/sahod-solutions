// src/components/registration/steps/TrialActivationStep.tsx

"use client";

import React, { useState } from 'react';
import { CheckCircle, Sparkles, Users, Clock, CreditCard, Globe } from 'lucide-react';

import { RegistrationService } from '../../../lib/firebase/registration';
import type { TrialActivationFormData } from '../../../types/registration';

interface TrialActivationStepProps {
  registrationId: string;
  onComplete: (subdomain: string) => void; // Returns subdomain for redirect
  onBack: () => void;
  companyName?: string;
  adminName?: string;
  subdomain?: string;
}

export default function TrialActivationStep({ 
  registrationId, 
  onComplete, 
  onBack,
  companyName,
  adminName,
  subdomain
}: TrialActivationStepProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(true);

  const isValid = termsAccepted && privacyAccepted;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!termsAccepted || !privacyAccepted) {
      return;
    }

    const data: TrialActivationFormData = {
      termsAccepted,
      privacyAccepted,
      marketingOptIn
    };

    setIsActivating(true);

    try {
      // Save trial activation data and create company
      const companySubdomain = await RegistrationService.activateTrialAndCreateCompany(registrationId, data);
      
      // Redirect to company dashboard
      onComplete(companySubdomain);
    } catch (error) {
      console.error('Error activating trial:', error);
      alert('Failed to activate trial. Please try again.');
      setIsActivating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activate Your 14-Day Trial</h1>
        <p className="text-lg text-gray-600">You're almost ready! Let's activate your free trial</p>
      </div>

      {/* Company Summary */}
      <div className="bg-gradient-to-r from-blue-50 via-yellow-50 to-red-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          Registration Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Company Name</div>
            <div className="font-medium text-gray-900">{companyName}</div>
          </div>
          <div>
            <div className="text-gray-600">Administrator</div>
            <div className="font-medium text-gray-900">{adminName}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-gray-600">Company Portal</div>
            <div className="font-medium text-blue-600">https://{subdomain}.sahod.solutions</div>
          </div>
        </div>
      </div>

      {/* Trial Benefits */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
          What's Included in Your Free Trial
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Up to 25 Employees</div>
              <div className="text-sm text-gray-600">Add and manage your team members</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Time Tracking</div>
              <div className="text-sm text-gray-600">Digital time clock and attendance</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Payroll Processing</div>
              <div className="text-sm text-gray-600">Full payroll computation and payslips</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Government Compliance</div>
              <div className="text-sm text-gray-600">SSS, PhilHealth, Pag-IBIG reporting</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Terms */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trial Terms</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>14 days free</strong> - No credit card required</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Full access</strong> - All features included</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Cancel anytime</strong> - No commitment required</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Your data is safe</strong> - Export anytime during trial</span>
          </li>
        </ul>
      </div>

      {/* Terms and Activation Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Terms Acceptance */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isActivating}
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-700 cursor-pointer">
              I accept the{' '}
              <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
              </a>{' '}
              and understand the trial terms
            </label>
          </div>
          {!termsAccepted && (
            <p className="text-sm text-red-600 ml-7">You must accept the Terms of Service</p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacyAccepted"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isActivating}
            />
            <label htmlFor="privacyAccepted" className="text-sm text-gray-700 cursor-pointer">
              I accept the{' '}
              <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </a>{' '}
              and data processing terms
            </label>
          </div>
          {!privacyAccepted && (
            <p className="text-sm text-red-600 ml-7">You must accept the Privacy Policy</p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="marketingOptIn"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isActivating}
            />
            <label htmlFor="marketingOptIn" className="text-sm text-gray-700 cursor-pointer">
              Send me helpful tips, product updates, and special offers (optional)
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border-2 border-gray-200"
            disabled={isActivating}
          >
            ← Back to Admin Account
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isActivating}
            className={`flex-1 py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
              isValid && !isActivating
                ? 'bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isActivating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Activating Trial...
              </>
            ) : (
              'Activate Free Trial & Access Dashboard 🚀'
            )}
          </button>
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Step 3 of 3 - Trial Activation</p>
      </div>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your data is encrypted and secure. We never share your information with third parties.
        </p>
      </div>
    </div>
  );
}