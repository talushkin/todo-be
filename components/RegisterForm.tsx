import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  width: 50vw;
  max-width: 400px;
  min-width: 300px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  @media (max-width: 900px) {
    width: 90vw;
    min-width: 0;
    max-width: none;
    padding: 1rem;
    box-shadow: none;
  }
`;

const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        username,
        email,
        password,
        role: 'USER',
      });
      if (response.data.success) {
        setSuccess('Registration successful! You can now login.');
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push(`/login?username=${encodeURIComponent(username)}`);
        }, 1200);
      } else {
        setError(response.data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      {error && <Error>{error}</Error>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
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
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </Container>
  );
};

export default RegisterForm;
