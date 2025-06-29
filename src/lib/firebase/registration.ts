import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import type { 
  RegistrationData, 
  CompanyInfoFormData, 
  AdminAccountFormData,
  TrialActivationFormData
} from '../../types/registration';
import type { 
  SubdomainDocument, 
  SubdomainAvailabilityResult 
} from '../../types/subdomain';

export class RegistrationService {
  
  // ✅ Enhanced subdomain availability checking with debugging
  static async checkSubdomainAvailability(
    subdomain: string, 
    excludeRegistrationId?: string
  ): Promise<SubdomainAvailabilityResult> {
    try {
      console.log('🔍 Checking subdomain availability:', subdomain, 'excluding:', excludeRegistrationId);
      
      if (!subdomain || subdomain.length < 3) {
        console.log('❌ Subdomain too short');
        return { available: false, status: 'too_short' };
      }

      // Check reserved subdomains
      const reservedSubdomains = [
        'admin', 'api', 'www', 'app', 'dashboard', 'staging', 'dev', 'test',
        'support', 'help', 'docs', 'blog', 'mail', 'ftp', 'cdn', 'static',
        'portal', 'kiosk', 'reports', 'analytics', 'billing', 'auth'
      ];

      if (reservedSubdomains.includes(subdomain.toLowerCase())) {
        console.log('❌ Subdomain is reserved');
        return { 
          available: false, 
          status: 'reserved',
        };
      }

      // Query the subdomains collection
      const subdomainRef = doc(db, 'subdomains', subdomain);
      const subdomainSnap = await getDoc(subdomainRef);
      
      if (!subdomainSnap.exists()) {
        console.log('✅ Subdomain available - no existing document');
        return { available: true };
      }
      
      const data = subdomainSnap.data() as SubdomainDocument;
      console.log('📄 Found existing subdomain data:', data);
      
      // Check if it's the current registration (self-exclusion logic)
      if (excludeRegistrationId && data.registrationId === excludeRegistrationId) {
        console.log('✅ Subdomain available - same registration ID');
        return { available: true };
      }
      
      // Check if it's an expired draft registration
      if (data.status === 'pending' && data.expiresAt) {
        const expiresAt = data.expiresAt.toDate();
        console.log('⏰ Checking expiration:', expiresAt, 'vs now:', new Date());
        
        if (expiresAt < new Date()) {
          console.log('🧹 Cleaning up expired subdomain');
          await deleteDoc(subdomainRef);
          return { available: true };
        }
      }
      
      // Subdomain is taken
      console.log('❌ Subdomain taken by:', data.registrationId, 'status:', data.status);
      return { 
        available: false, 
        status: data.status === 'active' ? 'taken' : 'reserved',
      };
      
    } catch (error) {
      console.error('❌ Error checking subdomain availability:', error);
      return { available: false, status: 'error' };
    }
  }

  // ✅ Enhanced subdomain reservation with comprehensive debugging
  static async reserveSubdomain(
    subdomain: string, 
    registrationId: string
  ): Promise<void> {
    try {
      console.log('🔐 Starting subdomain reservation...');
      console.log('📝 Subdomain:', subdomain);
      console.log('📝 Registration ID:', registrationId);
      
      const subdomainRef = doc(db, 'subdomains', subdomain);
      
      // Check if subdomain document already exists
      console.log('🔍 Checking if subdomain document exists...');
      const existing = await getDoc(subdomainRef);
      
      if (existing.exists()) {
        const data = existing.data() as SubdomainDocument;
        console.log('📄 Found existing subdomain document:', {
          subdomain: data.subdomain,
          registrationId: data.registrationId,
          status: data.status,
          companyId: data.companyId
        });
        
        // Check if it's the same registration
        if (data.registrationId === registrationId) {
          console.log('✅ Same registration ID - updating timestamp only');
          
          await updateDoc(subdomainRef, {
            updatedAt: serverTimestamp()
          });
          
          console.log('✅ Successfully updated existing reservation');
          return;
        } else {
          console.log('❌ Different registration ID found');
          console.log('❌ Existing:', data.registrationId, 'vs Current:', registrationId);
          throw new Error(`Subdomain is already reserved by different registration: ${data.registrationId}`);
        }
      }

      // Create new subdomain reservation
      console.log('🆕 Creating new subdomain reservation...');
      
      const newReservation = {
        subdomain,
        companyId: null,
        status: 'pending' as const,
        registrationId,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        ),
        updatedAt: serverTimestamp()
      };
      
      console.log('📝 New reservation data:', {
        subdomain: newReservation.subdomain,
        registrationId: newReservation.registrationId,
        status: newReservation.status
      });
      
      await setDoc(subdomainRef, newReservation);
      console.log('✅ Successfully created new subdomain reservation');
      
    } catch (error) {
      console.error('❌ Error in reserveSubdomain:', error);
      
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        throw new Error(`Failed to reserve subdomain: ${error.message}`);
      } else {
        console.error('❌ Unknown error type:', error);
        throw new Error('Failed to reserve subdomain: Unknown error');
      }
    }
  }

  // ✅ Activate subdomain when company is created
  static async activateSubdomain(subdomain: string, companyId: string): Promise<void> {
    try {
      console.log('🚀 Activating subdomain:', subdomain, 'for company:', companyId);
      
      const subdomainRef = doc(db, 'subdomains', subdomain);
      
      // Check if subdomain exists
      const existing = await getDoc(subdomainRef);
      if (!existing.exists()) {
        throw new Error(`Subdomain ${subdomain} not found for activation`);
      }
      
      await updateDoc(subdomainRef, {
        companyId,
        status: 'active',
        expiresAt: null,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Successfully activated subdomain');
      
    } catch (error) {
      console.error('❌ Error activating subdomain:', error);
      throw new Error('Failed to activate subdomain');
    }
  }

  // ✅ Cleanup expired reservations
  static async cleanupExpiredReservations(): Promise<number> {
    try {
      console.log('🧹 Starting cleanup of expired reservations...');
      
      const now = new Date();
      const expiredQuery = query(
        collection(db, 'subdomains'),
        where('status', '==', 'pending'),
        where('expiresAt', '<', Timestamp.fromDate(now))
      );
      
      const snapshot = await getDocs(expiredQuery);
      console.log('🧹 Found', snapshot.size, 'expired reservations');
      
      if (snapshot.empty) return 0;

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        console.log('🗑️ Deleting expired reservation:', doc.id);
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('✅ Cleanup completed, removed', snapshot.size, 'documents');
      return snapshot.size;
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      return 0;
    }
  }

  // ===== REGISTRATION FLOW METHODS =====

  // ✅ Generate unique registration ID
  static generateRegistrationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const id = `reg_${timestamp}_${random}`;
    console.log('🆔 Generated registration ID:', id);
    return id;
  }

  // ✅ Step 1: Save Company Information
  static async saveCompanyInfo(
    registrationId: string, 
    companyData: CompanyInfoFormData
  ): Promise<void> {
    try {
      console.log('💾 Saving company info for registration:', registrationId);
      console.log('🏢 Company data:', {
        companyName: companyData.companyName,
        industry: companyData.industry,
        address: companyData.address?.substring(0, 50) + '...'
      });
      
      const registrationRef = doc(db, 'draft_registrations', registrationId);
      
      const registrationDoc = {
        registrationId,
        companyInfo: companyData,
        currentStep: 1,
        completedSteps: [1],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      };
      
      await setDoc(registrationRef, registrationDoc, { merge: true });
      console.log('✅ Company info saved successfully');
      
    } catch (error) {
      console.error('❌ Error saving company info:', error);
      throw new Error('Failed to save company information');
    }
  }

  // ✅ Step 2: Save Admin Account with enhanced debugging
  static async saveAdminAccount(
    registrationId: string, 
    adminData: AdminAccountFormData
  ): Promise<void> {
    try {
      console.log('🔥 ===== STARTING ADMIN ACCOUNT SAVE =====');
      console.log('📝 Registration ID:', registrationId);
      console.log('👤 Admin data:', {
        fullName: adminData.fullName,
        email: adminData.email,
        phone: adminData.phone,
        subdomain: adminData.subdomain
      });
      
      // Step 1: Reserve subdomain
      console.log('🔐 Step 1: Attempting to reserve subdomain...');
      await this.reserveSubdomain(adminData.subdomain, registrationId);
      console.log('✅ Step 1: Subdomain reserved successfully');

      // Step 2: Save admin account data
      console.log('💾 Step 2: Saving admin data to draft registration...');
      const registrationRef = doc(db, 'draft_registrations', registrationId);
      
      const updateData = {
        adminAccount: adminData,
        currentStep: 2,
        completedSteps: [1, 2],
        updatedAt: serverTimestamp()
      };
      
      console.log('📝 Update data prepared:', {
        currentStep: updateData.currentStep,
        completedSteps: updateData.completedSteps,
        adminAccount: {
          fullName: updateData.adminAccount.fullName,
          email: updateData.adminAccount.email,
          subdomain: updateData.adminAccount.subdomain
        }
      });
      
      await updateDoc(registrationRef, updateData);
      console.log('✅ Step 2: Admin data saved successfully');
      
      console.log('🎉 ===== ADMIN ACCOUNT SAVE COMPLETED =====');

    } catch (error) {
      console.error('🔥 ===== ADMIN ACCOUNT SAVE FAILED =====');
      console.error('❌ Error type:', error?.constructor?.name);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ Full error:', error);
      
      if (error instanceof Error) {
        console.error('❌ Error stack:', error.stack);
      }
      
      // Re-throw with context
      throw new Error(`Failed to save admin account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ✅ Step 3: Activate Trial and Create Company
  static async activateTrialAndCreateCompany(
    registrationId: string,
    trialData: TrialActivationFormData
  ): Promise<string> {
    try {
      console.log('🚀 Starting trial activation for registration:', registrationId);
      console.log('📋 Trial data:', trialData);
      
      // Save trial activation data
      const registrationRef = doc(db, 'draft_registrations', registrationId);
      await updateDoc(registrationRef, {
        trialActivation: trialData,
        currentStep: 3,
        completedSteps: [1, 2, 3],
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Trial data saved, creating company...');

      // Create company from registration
      const result = await this.createCompanyFromRegistration(registrationId);
      console.log('✅ Company created successfully, subdomain:', result.subdomain);
      
      return result.subdomain;
      
    } catch (error) {
      console.error('❌ Error activating trial:', error);
      throw new Error('Failed to activate trial and create company');
    }
  }

  // ✅ Create Company from Registration Data
  static async createCompanyFromRegistration(
    registrationId: string
  ): Promise<{ companyId: string; subdomain: string }> {
    try {
      console.log('🏢 Creating company from registration:', registrationId);
      
      // Get registration data
      const registrationRef = doc(db, 'draft_registrations', registrationId);
      const registrationSnap = await getDoc(registrationRef);
      
      if (!registrationSnap.exists()) {
        throw new Error('Registration not found');
      }
      
      const registrationData = registrationSnap.data() as RegistrationData;
      const { companyInfo, adminAccount } = registrationData;
      
      console.log('📄 Registration data retrieved:', {
        hasCompanyInfo: !!companyInfo,
        hasAdminAccount: !!adminAccount,
        companyName: companyInfo?.companyName,
        subdomain: adminAccount?.subdomain
      });
      
      if (!companyInfo || !adminAccount) {
        throw new Error('Incomplete registration data - missing company info or admin account');
      }

      // Generate company ID
      const companyId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('🆔 Generated company ID:', companyId);
      
      // Create company document
      const companyRef = doc(db, 'companies', companyId);
      const companyDoc = {
        id: companyId,
        name: companyInfo.companyName,
        industry: companyInfo.industry,
        address: companyInfo.address,
        subdomain: adminAccount.subdomain,
        
        // Admin info
        adminName: adminAccount.fullName,
        adminEmail: adminAccount.email,
        adminPhone: adminAccount.phone,
        
        // Trial setup
        subscription: {
          plan: 'trial',
          status: 'trial',
          trialStartDate: serverTimestamp(),
          trialEndDate: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
        },
        
        // Setup progress for dashboard
        setupProgress: {
          companyInfo: true,      // ✅ Done in registration
          adminAccount: true,     // ✅ Done in registration
          businessDetails: false, // 🔲 Post-registration setup
          firstEmployee: false,   // 🔲 Post-registration setup
          paymentMethod: false,   // 🔲 Post-registration setup
          kioskSetup: false,      // 🔲 Post-registration setup
          bankIntegration: false  // 🔲 Post-registration setup
        },
        
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      console.log('📝 Creating company document...');
      await setDoc(companyRef, companyDoc);
      console.log('✅ Company document created');
      
      // Activate subdomain
      console.log('🚀 Activating subdomain...');
      await this.activateSubdomain(adminAccount.subdomain, companyId);
      console.log('✅ Subdomain activated');
      
      // Mark registration as completed
      console.log('✅ Marking registration as completed...');
      await updateDoc(registrationRef, {
        companyCreated: true,
        companyId,
        completedAt: serverTimestamp()
      });
      
      console.log('🎉 Company creation completed successfully');
      return { companyId, subdomain: adminAccount.subdomain };
      
    } catch (error) {
      console.error('❌ Error creating company:', error);
      throw new Error('Failed to create company from registration');
    }
  }

  // ===== UTILITY METHODS =====

  // ✅ Get registration data
  static async getRegistration(registrationId: string): Promise<RegistrationData | null> {
    try {
      console.log('📖 Getting registration:', registrationId);
      
      const registrationRef = doc(db, 'draft_registrations', registrationId);
      const registrationSnap = await getDoc(registrationRef);
      
      if (!registrationSnap.exists()) {
        console.log('❌ Registration not found');
        return null;
      }
      
      const data = registrationSnap.data() as RegistrationData;
      console.log('✅ Registration retrieved:', {
        currentStep: data.currentStep,
        completedSteps: data.completedSteps,
        hasCompanyInfo: !!data.companyInfo,
        hasAdminAccount: !!data.adminAccount
      });
      
      return data;
      
    } catch (error) {
      console.error('❌ Error getting registration:', error);
      return null;
    }
  }

  // ✅ Auto-saver utility
  static createAutoSaver(registrationId: string, getData: () => any, delay: number = 2000) {
    console.log('🔄 Creating auto-saver for registration:', registrationId);
    
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const data = getData();
          if (data) {
            console.log('💾 Auto-saving data...');
            const registrationRef = doc(db, 'draft_registrations', registrationId);
            await updateDoc(registrationRef, {
              ...data,
              updatedAt: serverTimestamp()
            });
            console.log('✅ Auto-save completed');
          }
        } catch (error) {
          console.error('❌ Auto-save failed:', error);
        }
      }, delay);
    };
  }
}