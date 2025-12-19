import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Admin index page - redirects to users page
 */
export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/users');
  }, [router]);

  return null;
}

