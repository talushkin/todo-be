// Login page: wraps LoginForm with redirect logic for authenticated users.
// Ensures only unauthenticated users see the login form.
// 2025-09-08
import React from 'react';
import LoginForm from '../components/LoginForm';
import LoginRedirect from '../components/LoginRedirect';

const LoginPage: React.FC = () => {
  return (
    <LoginRedirect>
      <LoginForm />
    </LoginRedirect>
  );
};

export default LoginPage;
