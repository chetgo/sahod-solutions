// src/components/registration/CompanyRegistrationWizard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardProvider, useWizard, wizardActions, STEPS } from './WizardContext';
import ProgressIndicator, { canAccessStep, stepValidators } from './ProgressIndicator';

// Step component imports (we'll create these in Phase 2)
// import CompanyInfoStep from './steps/CompanyInfoStep';
// import BusinessDetailsStep from './steps/BusinessDetailsStep';
// import AdminAccountStep from './steps/AdminAccountStep';
// import PlanSelectionStep from './steps/PlanSelectionStep';
// import PaymentSetupStep from './steps/PaymentSetupStep';

// Placeholder step components for now
const PlaceholderStep = ({ stepNumber, title }: { stepNumber: number; title: string }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Step {stepNumber}: {title}</h2>
    <p className="text-gray-600 mb-8">This step will be implemented in Phase 2</p>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
      <p className="text-blue-800 text-sm">
        For now, this is a placeholder. The actual form components will be built next!
      </p>
    </div>
  </div>
);

function WizardContent() {
  const { state, dispatch } = useWizard();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { currentStep, data, isLoading, errors, completedSteps, canProceed } = state;

  // Auto-save functionality (simulated for now)
  useEffect(() => {
    const autoSave = async () => {
      if (Object.keys(data).length > 0) {
        // TODO: Implement actual auto-save to Firebase
        console.log('Auto-saving registration data:', data);
        
        // Simulate API call
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [data]);

  // Step validation and progression logic
  const validateCurrentStep = () => {
    let isValid = false;
    let errors: string[] = [];

    switch (currentStep) {
      case 1:
        errors = stepValidators.validateCompanyInfo(data.companyInfo);
        isValid = errors.length === 0;
        break;
      case 2:
        errors = stepValidators.validateBusinessDetails(data.businessDetails);
        isValid = errors.length === 0;
        break;
      case 3:
        errors = stepValidators.validateAdminAccount(data.adminAccount);
        isValid = errors.length === 0;
        break;
      case 4:
        errors = stepValidators.validatePlanSelection(data.planSelection);
        isValid = errors.length === 0;
        break;
      case 5:
        errors = stepValidators.validatePaymentSetup(data.paymentSetup);
        isValid = errors.length === 0;
        break;
      default:
        isValid = false;
    }

    // Clear previous errors and set new ones
    Object.keys(state.errors).forEach(field => {
      dispatch(wizardActions.clearError(field));
    });

    errors.forEach((error, index) => {
      dispatch(wizardActions.setError(`step${currentStep}_error_${index}`, error));
    });

    dispatch(wizardActions.setCanProceed(isValid));
    return isValid;
  };

  // Navigation functions
  const goToNextStep = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    dispatch(wizardActions.setLoading(true));

    try {
      // Mark current step as completed
      dispatch(wizardActions.markStepCompleted(currentStep));

      // Special handling for Step 3 - redirect to dashboard
      if (currentStep === 3) {
        // TODO: Create Firebase Auth account and company profile
        console.log('Creating admin account and company profile...');
        
        // Simulate account creation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirect to company dashboard
        router.push('/dashboard');
        return;
      }

      // Move to next step
      if (currentStep < STEPS.length) {
        dispatch(wizardActions.setCurrentStep(currentStep + 1));
      } else {
        // Complete registration
        await completeRegistration();
      }
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      dispatch(wizardActions.setError('general', 'An error occurred. Please try again.'));
    } finally {
      dispatch(wizardActions.setLoading(false));
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      dispatch(wizardActions.setCurrentStep(currentStep - 1));
    }
  };

  const jumpToStep = (stepId: number) => {
    if (canAccessStep(stepId, completedSteps, currentStep)) {
      dispatch(wizardActions.setCurrentStep(stepId));
    }
  };

  const completeRegistration = async () => {
    dispatch(wizardActions.setLoading(true));

    try {
      // TODO: Complete Stripe subscription setup and finalize registration
      console.log('Completing registration with payment setup...');
      
      // Simulate final registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard with success message
      router.push('/dashboard?registration=complete');
    } catch (error) {
      console.error('Error completing registration:', error);
      dispatch(wizardActions.setError('general', 'Registration failed. Please try again.'));
    } finally {
      dispatch(wizardActions.setLoading(false));
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PlaceholderStep stepNumber={1} title="Company Information" />;
        // return <CompanyInfoStep />;
      case 2:
        return <PlaceholderStep stepNumber={2} title="Business Details" />;
        // return <BusinessDetailsStep />;
      case 3:
        return <PlaceholderStep stepNumber={3} title="Admin Account" />;
        // return <AdminAccountStep />;
      case 4:
        return <PlaceholderStep stepNumber={4} title="Plan Selection" />;
        // return <PlanSelectionStep />;
      case 5:
        return <PlaceholderStep stepNumber={5} title="Payment Setup" />;
        // return <PaymentSetupStep />;
      default:
        return <PlaceholderStep stepNumber={currentStep} title="Unknown Step" />;
    }
  };

  const getNextButtonText = () => {
    switch (currentStep) {
      case 3:
        return 'Create Account & Continue →';
      case 5:
        return 'Start Free Trial →';
      default:
        return 'Continue →';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-red-500 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Sahod.solutions</h1>
          <p className="text-lg opacity-90">
            🇵🇭 The Philippine Payroll System Built by Filipinos, for Filipino Businesses
          </p>
        </div>
      </header>

      {/* Progress Indicator */}
      <ProgressIndicator />

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step Content */}
          <div className="p-8 min-h-96">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              {/* Left side - Filipino pride */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-3 bg-blue-600 rounded-sm"></div>
                  <div className="w-1.5 h-3 bg-yellow-400 rounded-sm"></div>
                  <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
                </div>
                <span>Proudly made in the Philippines</span>
              </div>

              {/* Right side - Navigation buttons */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={goToPreviousStep}
                    disabled={isLoading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                )}

                <button
                  onClick={goToNextStep}
                  disabled={isLoading || !canProceed}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                           flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    getNextButtonText()
                  )}
                </button>
              </div>
            </div>

            {/* Auto-save indicator */}
            {isSaving && (
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Auto-saving...
              </div>
            )}

            {/* Error display */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Please fix the following issues:</span>
                </div>
                <ul className="mt-2 list-disc list-inside text-red-700 text-sm">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Development helper - Step quick navigation */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">🚧 Development Helper</h3>
            <div className="flex gap-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(step.id)}
                  className={`px-3 py-1 text-xs rounded ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : canAccessStep(step.id, completedSteps, currentStep)
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!canAccessStep(step.id, completedSteps, currentStep)}
                >
                  Step {step.id}
                </button>
              ))}
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Current data: {JSON.stringify(data, null, 2).slice(0, 100)}...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Main component with provider
interface CompanyRegistrationWizardProps {
  initialStep?: number;
  onComplete?: (data: unknown) => void;
}

export default function CompanyRegistrationWizard({ 
  initialStep = 1,
  onComplete 
}: CompanyRegistrationWizardProps) {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}

// Export additional utilities
export { useWizard, wizardActions, STEPS } from './WizardContext';
export { canAccessStep, stepValidators } from './ProgressIndicator';