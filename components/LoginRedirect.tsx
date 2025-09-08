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
