import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice';

// Importamos íconos modernos para los botones
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import './styles/header.css'; 

export const Header = () => {
  const { status, displayName } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <header className="header-container">
      <div className="logo-section">
        <Link to="/">
          <img src="/HBV_logo_2022_verde.png" alt="Logo Bambi" className="header-logo" />
        </Link>
      </div>

      <nav className="header-nav">
        {status === 'authenticated' ? (
          <div className="admin-menu">
            <div className="admin-badge">
              <AccountCircleIcon sx={{ fontSize: 20 }} />
              <span>Modo Edición</span>
            </div>
            
            <button onClick={onLogout} className="modern-btn logout-btn">
              <LogoutIcon sx={{ fontSize: 18 }} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <Link to="/login" className="modern-btn login-btn">
            <LoginIcon sx={{ fontSize: 18 }} />
            <span>Acceso Personal</span>
          </Link>
        )}
      </nav>
    </header>
  );
};