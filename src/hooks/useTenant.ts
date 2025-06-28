// ========================================
// FILE: src/hooks/useTenant.ts (FIXED IMPORTS)
// ========================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TenantData {
  companyId: string;
  subdomain: string;
  companyName: string;
  loading: boolean;
  error: string | null;
}

export function useTenant(): TenantData {
  const [tenant, setTenant] = useState<TenantData>({
    companyId: '',
    subdomain: '',
    companyName: '',
    loading: true,
    error: null
  });
  
  const router = useRouter();
  
  useEffect(() => {
    const resolveTenant = async () => {
      try {
        const subdomain = getSubdomainFromEnvironment();
        
        if (!subdomain) {
          setTenant(prev => ({ ...prev, loading: false }));
          return;
        }
        
        const companyData = await fetchCompanyBySubdomain(subdomain);
        
        if (!companyData) {
          setTenant(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Company not found' 
          }));
          router.push('/company-not-found');
          return;
        }
        
        setTenant({
          companyId: companyData.id,
          subdomain: subdomain,
          companyName: companyData.name,
          loading: false,
          error: null
        });
        
      } catch (error) {
        console.error('Error resolving tenant:', error);
        setTenant(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load company data' 
        }));
      }
    };
    
    resolveTenant();
  }, [router]);
  
  return tenant;
}

function extractSubdomain(hostname: string): string | null {
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null;
  }
  
  const parts = hostname.split('.');
  
  if (parts.length >= 3) {
    const subdomain = parts[0];
    
    if (subdomain === 'www' || isReservedSubdomain(subdomain)) {
      return null;
    }
    
    return subdomain;
  }
  
  return null;
}

function isReservedSubdomain(subdomain: string): boolean {
  const reserved = [
    'www', 'api', 'admin', 'support', 'help', 'mail', 'email',
    'app', 'dashboard', 'portal', 'staging', 'dev', 'test'
  ];
  return reserved.includes(subdomain.toLowerCase());
}

function getSubdomainFromEnvironment(): string | null {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return extractSubdomain(hostname);
  }
  
  return null;
}

async function fetchCompanyBySubdomain(subdomain: string) {
  try {
    // Check if subdomain exists and get company ID
    const subdomainDoc = await getDoc(doc(db, 'subdomains', subdomain));
    
    if (!subdomainDoc.exists() || subdomainDoc.data()?.status !== 'active') {
      return null;
    }
    
    const companyId = subdomainDoc.data()?.companyId;
    if (!companyId) return null;
    
    const companyDoc = await getDoc(doc(db, 'companies', companyId));
    
    if (!companyDoc.exists()) return null;
    
    const companyData = companyDoc.data();
    return { 
      id: companyId, 
      name: companyData?.name || 'Unknown Company',
      ...companyData 
    };
    
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}