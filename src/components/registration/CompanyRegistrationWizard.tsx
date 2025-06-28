// src/components/registration/CompanyRegistrationWizard.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import CompanyInformationStep from './steps/CompanyInformationStep';
import AdminAccountStep from './steps/AdminAccountStep';
import TrialActivationStep from './steps/TrialActivationStep';
import { RegistrationService } from '../../lib/firebase/registration';
import type { 
  RegistrationData, 
  CompanyInfoFormData, 
  AdminAccountFormData,
  TrialActivationFormData 
} from '../../types/registration';

export default function CompanyRegistrationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [registrationId, setRegistrationId] = useState<string>('');
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize registration on component mount
  useEffect(() => {
    const initializeRegistration = async () => {
      // Check if we have a registration ID in sessionStorage (for resuming)
      let regId = sessionStorage.getItem('registrationId');
      
      if (!regId) {
        // Create new registration
        regId = RegistrationService.generateRegistrationId();
        sessionStorage.setItem('registrationId', regId);
      }
      
      setRegistrationId(regId);
      
      // Try to load existing registration data
      try {
        const existingData = await RegistrationService.getRegistration(regId);
        if (existingData) {
          setRegistrationData(existingData);
          setCurrentStep(existingData.currentStep || 1);
        }
      } catch (error) {
        console.error('Error loading registration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRegistration();
  }, []);

  const handleCompanyInfoNext = (data: CompanyInfoFormData) => {
    setRegistrationData(prev => ({
      ...prev,
      companyInfo: data,
      completedSteps: [1]
    }));
    setCurrentStep(2);
  };

  const handleAdminAccountNext = (data: AdminAccountFormData) => {
    setRegistrationData(prev => ({
      ...prev,
      adminAccount: data,
      completedSteps: [1, 2]
    }));
    setCurrentStep(3);
  };

  const handleTrialActivationComplete = (subdomain: string) => {
    // Clear registration session
    sessionStorage.removeItem('registrationId');
    
    // Redirect to company dashboard
    window.location.href = `https://${subdomain}.sahod.solutions/dashboard`;
  };

  const handleStepBack = (targetStep: 1 | 2 | 3) => {
    setCurrentStep(targetStep);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Logo and Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sahod.solutions</h1>
                <p className="text-sm text-gray-600">Philippine Payroll System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Step {currentStep} of 3</div>
              <div className="text-xs text-gray-500">Company Registration</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            {/* Step Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Company Information</span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Admin Account</span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Trial Activation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          {currentStep === 1 && (
            <CompanyInformationStep
              registrationId={registrationId}
              onNext={handleCompanyInfoNext}
              initialData={registrationData.companyInfo || undefined}
            />
          )}
          
          {currentStep === 2 && (
            <AdminAccountStep
              registrationId={registrationId}
              onNext={handleAdminAccountNext}
              onBack={() => handleStepBack(1)}
              initialData={registrationData.adminAccount || undefined}
              companyName={registrationData.companyInfo?.companyName}
            />
          )}
          
          {currentStep === 3 && (
            <TrialActivationStep
              registrationId={registrationId}
              onComplete={handleTrialActivationComplete}
              onBack={() => handleStepBack(2)}
              companyName={registrationData.companyInfo?.companyName}
              adminName={registrationData.adminAccount?.fullName}
              subdomain={registrationData.adminAccount?.subdomain}
            />
          )}
        </div>
      </div>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm max-w-xs">
          <div><strong>Registration ID:</strong> {registrationId.slice(-8)}...</div>
          <div><strong>Current Step:</strong> {currentStep}/3</div>
          <div><strong>Company:</strong> {registrationData.companyInfo?.companyName || 'None'}</div>
          <div><strong>Industry:</strong> {registrationData.companyInfo?.industry || 'None'}</div>
          <div><strong>Admin:</strong> {registrationData.adminAccount?.fullName || 'None'}</div>
          <div><strong>Email:</strong> {registrationData.adminAccount?.email || 'None'}</div>
          <div><strong>Subdomain:</strong> {registrationData.adminAccount?.subdomain || 'None'}</div>
        </div>
      )}
    </div>
  );
}