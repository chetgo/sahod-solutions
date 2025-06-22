// 📁 src/components/registration/CompanyRegistrationWizard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import CompanyInformationStep from './steps/CompanyInformationStep';
import { RegistrationService } from '../../lib/firebase/registration';
import type { RegistrationData, CompanyInfoFormData } from '../../types/registration';

export default function CompanyRegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
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
      companyInfo: data
    }));
    setCurrentStep(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                🇵🇭
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sahod.solutions</h1>
                <p className="text-sm text-gray-600">Philippine Payroll System Registration</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-blue-600 to-red-600' 
                    : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Company Info</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Business Details</span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Admin Account</span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Choose Plan</span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-medium' : ''}>Payment Setup</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-8">
        {currentStep === 1 && (
          <CompanyInformationStep
            registrationId={registrationId}
            onNext={handleCompanyInfoNext}
            initialData={registrationData.companyInfo}
          />
        )}
        
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Compliance Details</h2>
              <p className="text-gray-600 mb-6">Step 2 is being developed...</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Coming Next:</strong> TIN, SSS, PhilHealth, and Pag-IBIG validation with real-time formatting
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Back to Company Information
                </button>
              </div>
            </div>
          </div>
        )}
        
        {currentStep > 2 && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {currentStep}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step {currentStep}</h2>
              <p className="text-gray-600 mb-6">This step is coming soon...</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Back to Step 1
                </button>
                {currentStep > 2 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ← Previous Step
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm max-w-xs">
          <div><strong>Registration ID:</strong> {registrationId.slice(-8)}...</div>
          <div><strong>Current Step:</strong> {currentStep}</div>
          <div><strong>Company:</strong> {registrationData.companyInfo?.companyName || 'None'}</div>
        </div>
      )}
    </div>
  );
}