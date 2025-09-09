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
