import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  RegistrationData, 
  CompanyInfoFormData, 
  BusinessDetailsFormData 
} from '../../types/registration';

export class RegistrationService {
  private static COLLECTION_NAME = 'draft_registrations';

  private static getRegistrationRef(registrationId: string) {
    return doc(db, this.COLLECTION_NAME, registrationId);
  }

  // Generate unique registration ID
  static generateRegistrationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `reg_${timestamp}_${random}`;
  }

  // Save company information (Step 1)
  static async saveCompanyInfo(
    registrationId: string, 
    data: CompanyInfoFormData
  ): Promise<void> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      const existingDoc = await getDoc(registrationRef);
      
      if (existingDoc.exists()) {
        // Update existing registration
        const existingData = existingDoc.data();
        const completedSteps = existingData.completedSteps || [];
        const updatedCompletedSteps = completedSteps.includes(1) 
          ? completedSteps 
          : [...completedSteps, 1].sort();

        await updateDoc(registrationRef, {
          companyInfo: data,
          currentStep: Math.max(existingData.currentStep || 1, 1),
          completedSteps: updatedCompletedSteps,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new registration
        const newRegistration = {
          registrationId,
          companyInfo: data,
          businessDetails: null,
          adminAccount: null,
          planSelection: null,
          payment: null,
          currentStep: 1,
          completedSteps: [1],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        };
        await setDoc(registrationRef, newRegistration);
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      throw new Error('Failed to save company information');
    }
  }

  // Save business details (Step 2) 
  static async saveBusinessDetails(
    registrationId: string, 
    data: BusinessDetailsFormData
  ): Promise<void> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      const existingDoc = await getDoc(registrationRef);
      
      if (existingDoc.exists()) {
        const existingData = existingDoc.data();
        const completedSteps = existingData.completedSteps || [];
        const updatedCompletedSteps = completedSteps.includes(2) 
          ? completedSteps 
          : [...completedSteps, 2].sort();

        await updateDoc(registrationRef, {
          businessDetails: data,
          currentStep: Math.max(existingData.currentStep || 2, 2),
          completedSteps: updatedCompletedSteps,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new registration with business details (shouldn't happen normally)
        const newRegistration = {
          registrationId,
          companyInfo: null,
          businessDetails: data,
          adminAccount: null,
          planSelection: null,
          payment: null,
          currentStep: 2,
          completedSteps: [2],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };
        await setDoc(registrationRef, newRegistration);
      }
    } catch (error) {
      console.error('Error saving business details:', error);
      throw new Error('Failed to save business details');
    }
  }

  // Get registration data
  static async getRegistration(registrationId: string): Promise<RegistrationData | null> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      const docSnap = await getDoc(registrationRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Check if registration has expired
        const expiresAt = data.expiresAt?.toDate?.() || data.expiresAt;
        if (expiresAt && new Date(expiresAt) < new Date()) {
          return null; // Registration expired
        }
        
        return {
          registrationId: data.registrationId,
          currentStep: data.currentStep || 1,
          completedSteps: data.completedSteps || [],
          companyInfo: data.companyInfo || null,
          businessDetails: data.businessDetails || null,
          adminAccount: data.adminAccount || null,
          planSelection: data.planSelection || null,
          payment: data.payment || null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting registration:', error);
      return null;
    }
  }

  // Check subdomain availability
  static async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    try {
      // Check in companies collection for existing subdomains
      const companiesQuery = query(
        collection(db, 'companies'),
        where('subdomain', '==', subdomain.toLowerCase()),
        limit(1)
      );
      
      const companiesSnapshot = await getDocs(companiesQuery);
      
      if (!companiesSnapshot.empty) {
        return false; // Subdomain already taken
      }

      // Check in draft registrations for pending subdomains
      const draftsQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('adminAccount.subdomain', '==', subdomain.toLowerCase()),
        limit(1)
      );
      
      const draftsSnapshot = await getDocs(draftsQuery);
      
      return draftsSnapshot.empty; // Available if no drafts found
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      // Return false for safety - assume unavailable on error
      return false;
    }
  }

  // PRESERVE WORKING AUTO-SAVE PATTERN from Phase 2.1
  static createAutoSaver(registrationId: string, stepNumber: number) {
    let timeoutId: NodeJS.Timeout;
    
    return (data: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          switch (stepNumber) {
            case 1:
              await this.saveCompanyInfo(registrationId, data);
              break;
            case 2:
              await this.saveBusinessDetails(registrationId, data);
              break;
            // Add other steps as we implement them
            default:
              console.log('Auto-save for step', stepNumber, data);
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000); // 2 second debounce
    };
  }

  // NEW: Modern auto-saver pattern for new components (Phase 2.2+)
  static createAutoSaverFunction<T>(
    saveFn: (data: T) => Promise<void>,
    debounceMs: number = 2000
  ) {
    let timeoutId: NodeJS.Timeout;
    
    return (data: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await saveFn(data);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, debounceMs);
    };
  }

  // Update current step
  static async updateCurrentStep(
    registrationId: string, 
    step: number
  ): Promise<void> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      
      await updateDoc(registrationRef, {
        currentStep: step,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error updating current step:', error);
      throw new Error('Failed to update current step');
    }
  }

  // Mark step as completed
  static async markStepCompleted(
    registrationId: string, 
    step: number
  ): Promise<void> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      
      // Get current data
      const currentDoc = await getDoc(registrationRef);
      const currentData = currentDoc.data();
      const completedSteps = currentData?.completedSteps || [];
      
      // Add step to completed if not already there
      const updatedCompletedSteps = completedSteps.includes(step)
        ? completedSteps
        : [...completedSteps, step].sort();

      await updateDoc(registrationRef, {
        completedSteps: updatedCompletedSteps,
        currentStep: step,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error marking step completed:', error);
      throw new Error('Failed to mark step as completed');
    }
  }

  // Delete registration (cleanup)
  static async deleteRegistration(registrationId: string): Promise<void> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      await updateDoc(registrationRef, {
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw new Error('Failed to delete registration');
    }
  }
}