/**
 * Maintenance script for cleaning up expired data
 * Can be run manually or via Cloud Functions
 */

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { RegistrationService } from './registration';

export class CleanupService {
  
  /**
   * Clean up expired subdomain reservations
   */
  static async cleanupExpiredSubdomains(): Promise<{
    cleaned: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let cleaned = 0;

    try {
      console.log('🧹 Starting expired subdomain cleanup...');
      
      const cleanedCount = await RegistrationService.cleanupExpiredReservations();
      cleaned += cleanedCount;
      
      console.log(`✅ Cleaned up ${cleanedCount} expired subdomain reservations`);
      
    } catch (error) {
      const errorMsg = `Failed to cleanup expired subdomains: ${error}`;
      console.error('❌', errorMsg);
      errors.push(errorMsg);
    }

    return { cleaned, errors };
  }

  /**
   * Clean up expired draft registrations
   */
  static async cleanupExpiredRegistrations(): Promise<{
    cleaned: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let cleaned = 0;

    try {
      console.log('🧹 Starting expired registration cleanup...');
      
      const now = Timestamp.fromDate(new Date());
      const expiredQuery = query(
        collection(db, 'draft_registrations'),
        where('expiresAt', '<', now)
      );
      
      const snapshot = await getDocs(expiredQuery);
      
      if (snapshot.empty) {
        console.log('✅ No expired registrations found');
        return { cleaned: 0, errors: [] };
      }

      // Use batch delete for better performance
      const batches = [];
      let currentBatch = writeBatch(db);
      let operationCount = 0;

      for (const doc of snapshot.docs) {
        currentBatch.delete(doc.ref);
        operationCount++;

        // Firestore batch limit is 500 operations
        if (operationCount === 500) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Add the last batch if it has operations
      if (operationCount > 0) {
        batches.push(currentBatch);
      }

      // Execute all batches
      await Promise.all(batches.map(batch => batch.commit()));
      
      cleaned = snapshot.size;
      console.log(`✅ Cleaned up ${cleaned} expired draft registrations`);
      
    } catch (error) {
      const errorMsg = `Failed to cleanup expired registrations: ${error}`;
      console.error('❌', errorMsg);
      errors.push(errorMsg);
    }

    return { cleaned, errors };
  }

  /**
   * Run full cleanup process
   */
  static async runFullCleanup(): Promise<{
    totalCleaned: number;
    results: {
      subdomains: { cleaned: number; errors: string[] };
      registrations: { cleaned: number; errors: string[] };
    };
  }> {
    console.log('🚀 Starting full cleanup process...');
    
    const subdomainResults = await this.cleanupExpiredSubdomains();
    const registrationResults = await this.cleanupExpiredRegistrations();
    
    const totalCleaned = subdomainResults.cleaned + registrationResults.cleaned;
    const totalErrors = [...subdomainResults.errors, ...registrationResults.errors];
    
    console.log(`🎉 Cleanup complete! Total items cleaned: ${totalCleaned}`);
    
    if (totalErrors.length > 0) {
      console.log('⚠️ Errors encountered:', totalErrors);
    }

    return {
      totalCleaned,
      results: {
        subdomains: subdomainResults,
        registrations: registrationResults
      }
    };
  }

  /**
   * Get cleanup statistics without performing cleanup
   */
  static async getCleanupStats(): Promise<{
    expiredSubdomains: number;
    expiredRegistrations: number;
    totalExpired: number;
  }> {
    try {
      const now = Timestamp.fromDate(new Date());
      
      // Count expired subdomains
      const expiredSubdomainsQuery = query(
        collection(db, 'subdomains'),
        where('status', '==', 'pending'),
        where('expiresAt', '<', now)
      );
      const expiredSubdomainsSnap = await getDocs(expiredSubdomainsQuery);
      
      // Count expired registrations
      const expiredRegistrationsQuery = query(
        collection(db, 'draft_registrations'),
        where('expiresAt', '<', now)
      );
      const expiredRegistrationsSnap = await getDocs(expiredRegistrationsQuery);
      
      const stats = {
        expiredSubdomains: expiredSubdomainsSnap.size,
        expiredRegistrations: expiredRegistrationsSnap.size,
        totalExpired: expiredSubdomainsSnap.size + expiredRegistrationsSnap.size
      };
      
      console.log('📊 Cleanup Statistics:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Failed to get cleanup stats:', error);
      return {
        expiredSubdomains: 0,
        expiredRegistrations: 0,
        totalExpired: 0
      };
    }
  }
}

// Export convenience functions for direct use
export const cleanupExpiredData = CleanupService.runFullCleanup;
export const getCleanupStats = CleanupService.getCleanupStats;