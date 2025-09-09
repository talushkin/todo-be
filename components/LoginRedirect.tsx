// LoginRedirect: wrapper to redirect authenticated users away from login.
// Ensures only unauthenticated users see login/register forms.
// 2025-09-08
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Props {
  children: React.ReactNode;
}

const LoginRedirect: React.FC<Props> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace('/tasks');
    }
  }, [token, router]);

  return <>{children}</>;
};

export default LoginRedirect;
