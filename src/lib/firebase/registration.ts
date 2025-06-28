// src/lib/firebase/registration.ts

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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  RegistrationData,
  CompanyInfoFormData,
  AdminAccountFormData,
  TrialActivationFormData,
  CompanyDocument,
  BusinessDetailsFormData
} from '../../types/registration';

export class RegistrationService {
  private static COLLECTION_NAME = 'draft_registrations';
  private static COMPANIES_COLLECTION = 'companies';
  private static USERS_COLLECTION = 'users';

  private static getRegistrationRef(registrationId: string) {
    return doc(db, this.COLLECTION_NAME, registrationId);
  }

  private static getCompanyRef(companyId: string) {
    return doc(db, this.COMPANIES_COLLECTION, companyId);
  }

  // Generate unique registration ID
  static generateRegistrationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `reg_${timestamp}_${random}`;
  }

  // Save company information (Step 1 - 3 fields only)
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
          currentStep: 1,
          completedSteps: [1],
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new registration
        const newRegistration: Partial<RegistrationData> = {
          registrationId,
          companyInfo: data,
          adminAccount: null,
          trialActivation: null,
          currentStep: 1,
          completedSteps: [1],
          isTrialActivated: false,
          companyCreated: false,
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

  // Save admin account (Step 2 - 5 fields)
  static async saveAdminAccount(
    registrationId: string, 
    data: AdminAccountFormData
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
          adminAccount: data,
          currentStep: 2,
          completedSteps: updatedCompletedSteps,
          updatedAt: serverTimestamp()
        });
      } else {
        throw new Error('Registration not found');
      }
    } catch (error) {
      console.error('Error saving admin account:', error);
      throw new Error('Failed to save admin account');
    }
  }

  // Activate trial and create company (Step 3)
  static async activateTrialAndCreateCompany(
    registrationId: string, 
    data: TrialActivationFormData
  ): Promise<string> {
    try {
      // Get registration data
      const registrationRef = this.getRegistrationRef(registrationId);
      const regDoc = await getDoc(registrationRef);
      
      if (!regDoc.exists()) {
        throw new Error('Registration not found');
      }
      
      const regData = regDoc.data() as RegistrationData;
      
      if (!regData.companyInfo || !regData.adminAccount) {
        throw new Error('Incomplete registration data');
      }

      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        regData.adminAccount.email, 
        regData.adminAccount.password
      );
      
      const userId = userCredential.user.uid;
      const companyId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create company document
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

      const companyDoc: CompanyDocument = {
        companyId,
        subdomain: regData.adminAccount.subdomain,
        companyName: regData.companyInfo.companyName,
        industry: regData.companyInfo.industry,
        address: regData.companyInfo.address,
        adminName: regData.adminAccount.fullName,
        adminEmail: regData.adminAccount.email,
        adminPhone: regData.adminAccount.phone,
        trialStartDate: trialStartDate,
        trialEndDate: trialEndDate,
        isTrialActive: true,
        setupProgress: {
          businessDetails: false,
          firstEmployee: false,
          paymentMethod: false,
          kioskSetup: false,
          bankIntegration: false
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Create user document
      const userDoc = {
        userId,
        companyId,
        email: regData.adminAccount.email,
        fullName: regData.adminAccount.fullName,
        phone: regData.adminAccount.phone,
        role: 'admin',
        permissions: ['all'],
        employment: {
          position: 'Company Administrator',
          department: 'Management',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0]
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Save to Firebase
      await Promise.all([
        setDoc(this.getCompanyRef(companyId), companyDoc),
        setDoc(doc(db, this.USERS_COLLECTION, userId), userDoc)
      ]);
      
      // Update registration as completed
      await updateDoc(registrationRef, {
        trialActivation: data,
        currentStep: 3,
        completedSteps: [1, 2, 3],
        isTrialActivated: true,
        companyCreated: true,
        companyId: companyId,
        userId: userId,
        updatedAt: serverTimestamp()
      });
      
      return regData.adminAccount.subdomain;
      
    } catch (error) {
      console.error('Error activating trial:', error);
      throw new Error('Failed to activate trial and create company');
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
          adminAccount: data.adminAccount || null,
          trialActivation: data.trialActivation || null,
          isTrialActivated: data.isTrialActivated || false,
          companyCreated: data.companyCreated || false,
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

  // Check subdomain availability with self-exclusion
  static async checkSubdomainAvailability(subdomain: string, currentRegistrationId?: string): Promise<boolean> {
    try {
      // Reserved subdomains
      const reservedSubdomains = [
        'www', 'api', 'admin', 'support', 'help', 'mail', 'email', 'ftp', 'ssh',
        'secure', 'ssl', 'app', 'mobile', 'dev', 'test', 'staging', 'production',
        'sahod', 'payroll', 'hrms', 'hris', 'dashboard', 'portal', 'login',
        'register', 'signup', 'signin', 'auth', 'oauth', 'sso', 'account',
        'billing', 'payment', 'invoice', 'receipt', 'finance', 'accounting'
      ];

      if (reservedSubdomains.includes(subdomain.toLowerCase())) {
        return false;
      }

      // Check if subdomain exists in companies collection
      const companiesQuery = query(
        collection(db, this.COMPANIES_COLLECTION),
        where('subdomain', '==', subdomain),
        limit(1)
      );
      
      const companiesSnapshot = await getDocs(companiesQuery);
      if (!companiesSnapshot.empty) {
        return false; // Subdomain already taken by a company
      }

      // Check if subdomain exists in draft registrations (excluding current registration)
      const registrationQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('adminAccount.subdomain', '==', subdomain),
        limit(10) // Get more results to filter out current registration
      );
      
      const registrationSnapshot = await getDocs(registrationQuery);
      
      // Filter out current registration and expired registrations
      const conflictingRegistrations = registrationSnapshot.docs.filter(docSnapshot => {
        const data = docSnapshot.data();
        
        // Skip current registration
        if (currentRegistrationId && docSnapshot.id === currentRegistrationId) {
          return false;
        }
        
        // Skip expired registrations
        const expiresAt = data.expiresAt?.toDate?.() || data.expiresAt;
        if (expiresAt && new Date(expiresAt) < new Date()) {
          return false;
        }
        
        return true;
      });

      return conflictingRegistrations.length === 0;
      
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      return false; // Assume unavailable on error for safety
    }
  }

  // Save business details (for dashboard setup)
  static async saveBusinessDetails(
    companyId: string, 
    data: BusinessDetailsFormData
  ): Promise<void> {
    try {
      const companyRef = this.getCompanyRef(companyId);
      await updateDoc(companyRef, {
        businessDetails: data,
        'setupProgress.businessDetails': true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving business details:', error);
      throw new Error('Failed to save business details');
    }
  }

  // Auto-save functionality
  static createAutoSaver<T>(
    registrationId: string,
    saveFunction: (id: string, data: T) => Promise<void>,
    delay: number = 2000
  ) {
    let timeoutId: NodeJS.Timeout;
    
    return (data: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await saveFunction(registrationId, data);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, delay);
    };
  }
}