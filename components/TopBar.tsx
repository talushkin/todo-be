import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { RootState } from '../store';

const Bar = styled.div`
  width: 100vw;
  min-width: 0;
  height: 3rem;
  background: #f6f8fa;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  @media (max-width: 900px) {
    padding: 0 1rem;
    height: 3.2rem;
  }
`;

const LogoutBtn = styled.button`
  background: #fff;
  border: 2px solid #d32f2f;
  color: #d32f2f;
  border-radius: 6px;
  font-size: 1.1rem;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  z-index: 3100;
  left: -50px;
`;

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    window.location.href = '/login';
  };
  return (
    <Bar>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: 0, overflow: 'hidden' }}>
        {mounted && username && (
          <span style={{ fontWeight: 500, color: '#222', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            User: {username}
          </span>
        )}
      </div>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', minWidth: 0, marginLeft: '2rem' }}>
          <LogoutBtn onClick={handleLogout} title="Logout" aria-label="Logout">
          <span role="img" aria-label="door">🚪</span> Logout
        </LogoutBtn>
          </div>
    </Bar>
  );
};

export default TopBar;
