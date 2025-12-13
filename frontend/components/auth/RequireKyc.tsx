'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Skeleton, theme } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { getKycStatus } from '@/services/api/onboarding';

const { useToken } = theme;

interface RequireKycProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that checks if user has completed KYC
 * Redirects to onboarding if not approved
 */
const RequireKyc: React.FC<RequireKycProps> = ({ children, fallback }) => {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading: authLoading } = useAuth();
  const [kycApproved, setKycApproved] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // Not logged in - redirect to login
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    // Check KYC status
    const checkKyc = async () => {
      try {
        const status = await getKycStatus();
        
        if (status.status === 'APPROVED') {
          setKycApproved(true);
        } else {
          // Redirect to appropriate onboarding step
          if (status.currentStep === 0 || !status.hasPersonalDetails) {
            router.push('/onboarding');
          } else if (!status.hasAddress) {
            router.push('/onboarding/address');
          } else if (!status.hasVeriffSession) {
            router.push('/onboarding/verify');
          } else {
            router.push('/onboarding/status');
          }
        }
      } catch {
        // If API fails, redirect to onboarding start
        router.push('/onboarding');
      } finally {
        setChecking(false);
      }
    };

    checkKyc();
  }, [user, authLoading, router]);

  // Show loading while checking
  if (authLoading || checking || kycApproved === null) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div
        style={{
          padding: token.paddingXL,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  // KYC approved - render children
  if (kycApproved) {
    return <>{children}</>;
  }

  // Will redirect, show nothing
  return null;
};

export default RequireKyc;

