import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireKyc?: boolean;
}

/**
 * Hook to require authentication on a page
 * Redirects to login if not authenticated
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', requireKyc = false } = options;
  const router = useRouter();
  const { user, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Not logged in - redirect
    if (!isLoggedIn) {
      const currentPath = router.asPath;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check KYC if required
    if (requireKyc && user?.kycStatus !== 'APPROVED') {
      router.push('/onboarding');
    }
  }, [isLoading, isLoggedIn, user, requireKyc, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated: isLoggedIn,
    isKycApproved: user?.kycStatus === 'APPROVED',
  };
}

export default useRequireAuth;

