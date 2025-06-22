// 📁 src/lib/firebase/registration.ts (CREATE THIS FILE)
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase'; // Make sure this path is correct
import type { RegistrationData, CompanyInfoFormData } from '../../types/registration';

export class RegistrationService {
  private static getRegistrationRef(registrationId: string) {
    return doc(db, 'draft_registrations', registrationId);
  }

  // Save company information step
  static async saveCompanyInfo(
    registrationId: string, 
    data: CompanyInfoFormData
  ): Promise<void> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      const existingDoc = await getDoc(registrationRef);
      
      if (existingDoc.exists()) {
        // Update existing registration
        await updateDoc(registrationRef, {
          companyInfo: data,
          currentStep: Math.max(existingDoc.data().currentStep || 1, 1),
          completedSteps: Array.from(new Set([...(existingDoc.data().completedSteps || []), 1])),
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new registration
        const newRegistration: Partial<RegistrationData> = {
          companyInfo: data,
          currentStep: 1,
          completedSteps: [1],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(registrationRef, newRegistration);
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      throw new Error('Failed to save company information');
    }
  }

  // Get registration data
  static async getRegistration(registrationId: string): Promise<RegistrationData | null> {
    try {
      const registrationRef = this.getRegistrationRef(registrationId);
      const docSnap = await getDoc(registrationRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as RegistrationData;
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
      const companiesRef = collection(db, 'companies');
      const subdomainDoc = doc(companiesRef, subdomain);
      const docSnap = await getDoc(subdomainDoc);
      
      return !docSnap.exists();
    } catch (error) {
      console.error('Error checking subdomain:', error);
      return false;
    }
  }

  // Generate registration ID
  static generateRegistrationId(): string {
    return `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Auto-save functionality with debouncing
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
}