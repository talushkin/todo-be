// Home page: immediately redirects to /login for unauthenticated entry.
// Keeps root route clean and focused on authentication flow.
// 2025-09-08
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomeRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  return null;
};

export default HomeRedirect;
