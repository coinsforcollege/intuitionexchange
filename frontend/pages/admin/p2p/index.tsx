import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Admin P2P index page - redirects to disputes page
 */
export default function AdminP2PIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/p2p/disputes');
  }, [router]);

  return null;
}


