// ========================================
// FILE: src/components/layouts/CompanyLayout.tsx (FIXED IMPORTS)
// ========================================
'use client';

import { useTenant } from '@/hooks/useTenant';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CompanyNotFound } from '@/components/CompanyNotFound';

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export function CompanyLayout({ children }: CompanyLayoutProps) {
  const { companyId, companyName, loading, error } = useTenant();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-3 text-gray-600">Loading company data...</p>
      </div>
    );
  }
  
  if (error || !companyId) {
    return <CompanyNotFound />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              {companyName} - Payroll Portal
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
