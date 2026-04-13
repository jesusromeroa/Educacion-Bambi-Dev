import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { startRegisterWithEmailPassword } from '../../store/auth/thunks';
import './styles/loginPage.css'; // Reciclamos los estilos del Login

const logoPath = '/HBV_logo_2022_verde.png';

const formData = {
  displayName: '',
  email: '',
  password: ''
};

export const RegisterPage = () => {
    const { formState, onInputChange } = useForm(formData);
    const { displayName, email, password } = formState || formData;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, errorMessage } = useSelector(state => state.auth);
  
  const isAuthenticating = status === 'checking';

  const onSubmit = (event) => {
    event.preventDefault();
    if (isAuthenticating) return;
    dispatch(startRegisterWithEmailPassword({ email, password, displayName }));
  };

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="login-container">
      <div className="login-card" style={{ position: 'relative' }}>
        
        <div className="back-btn-wrapper">
          <Link to="/login" className="back-btn">
            &larr; Volver al Login
          </Link>
        </div>

        <img src={logoPath} alt="Hogar Bambi Logo" className="login-logo" />
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">Exclusivo para profesores autorizados</p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              className="login-input" 
              placeholder="Tu Nombre" 
              name="displayName"
              value={displayName}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="email" 
              className="login-input" 
              placeholder="Correo autorizado" 
              name="email"
              value={email}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              className="login-input" 
              placeholder="Crea una contraseña" 
              name="password"
              value={password}
              onChange={onInputChange}
              required
            />
          </div>

          {errorMessage && (
            <div style={{color: '#d32f2f', backgroundColor: '#fdecea', padding: '10px', borderRadius: '5px', fontSize: '0.9rem'}}>
              {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? 'Comprobando permisos...' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
};