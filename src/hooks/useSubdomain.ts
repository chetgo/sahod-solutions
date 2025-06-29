import { useState, useEffect, useCallback } from 'react';
import { RegistrationService } from '../lib/firebase/registration';
import type { SubdomainValidationState } from '../types/subdomain';

export function useSubdomain(
  subdomain: string,
  registrationId?: string,
  debounceMs: number = 1000
) {
  const [state, setState] = useState<SubdomainValidationState>({
    checking: false,
    available: false
  });

  const checkAvailability = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setState({
        checking: false,
        available: false,
        status: 'too_short'
      });
      return;
    }

    setState(prev => ({ ...prev, checking: true }));

    try {
      const result = await RegistrationService.checkSubdomainAvailability(
        value, 
        registrationId
      );

      setState({
        checking: false,
        available: result.available,
        status: result.status
      });

    } catch (error) {
      setState({
        checking: false,
        available: false,
        error: 'Failed to check availability',
        status: 'error'
      });
    }
  }, [registrationId]);

  useEffect(() => {
    if (!subdomain) {
      setState({ checking: false, available: false });
      return;
    }

    const timeoutId = setTimeout(() => {
      checkAvailability(subdomain);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [subdomain, checkAvailability, debounceMs]);

  return {
    ...state,
    recheck: () => checkAvailability(subdomain)
  };
}

// Utility hook for subdomain formatting
export function useSubdomainFormatter() {
  const formatSubdomain = useCallback((value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Only alphanumeric and hyphens
      .replace(/--+/g, '-')       // No consecutive hyphens
      .replace(/^-|-$/g, '')      // No leading/trailing hyphens
      .substring(0, 30);          // Max 30 characters
  }, []);

  return { formatSubdomain };
}