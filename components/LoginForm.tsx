// LoginForm: login form for user authentication.
// Handles input, validation, and Redux login logic.
// 2025-09-08
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loginUser } from '../features/authSlice';
import Link from 'next/link';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth as any);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.username && typeof router.query.username === 'string') {
      setUsername(router.query.username);
    }
  }, [router.query.username]);
  useEffect(() => {
    if (token) {
      toast.success('Logged in successfully!');
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username);
      // Save email if available (if you get it from backend)
      // localStorage.setItem('email', email);
    }
  };

  // Responsive style state
  const [responsiveStyle, setResponsiveStyle] = React.useState({
    width: '50vw',
    maxWidth: 400,
    minWidth: 300,
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 900;
      setResponsiveStyle(
        isMobile
          ? {
              width: '90vw',
              minWidth: 0,
              maxWidth: 9999,
              padding: '1rem',
              boxShadow: 'none',
            }
          : {
              width: '50vw',
              maxWidth: 400,
              minWidth: 300,
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }
      );
    }
  }, []);

  return (
    <div
      style={{
        margin: '0 auto',
        background: '#fff',
        borderRadius: 8,
        ...responsiveStyle,
      }}
    >
      <h2>Login</h2>
      {error && <Error>{error}</Error>}
      {/* Toast handled globally by react-toastify */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>
        <div style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="Password"
            style={{ width: '100%', boxSizing: 'border-box', paddingRight: '2.5rem' }}
          />
          <span
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute',
              right: '1rem',
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              cursor: 'pointer',
              fontSize: '1.3rem',
              color: showPassword ? '#d32f2f' : '#888',
              userSelect: 'none',
              background: 'transparent',
              padding: 0,
            }}
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁'}
          </span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginForm;
