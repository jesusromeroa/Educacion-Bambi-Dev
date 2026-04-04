import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { startLoginWithEmailPassword } from '../../store/auth/thunks';
import './styles/loginPage.css';

const logoPath = '/HBV_logo_2022_verde.png';

const formData = {
  email: '',
  password: ''
};

export const LoginPage = () => {
  const { email, password, onInputChange } = useForm(formData);
  
  // Herramientas de Redux y React Router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Leemos el estado global de auth
  const { status, errorMessage } = useSelector(state => state.auth);
  
  const isAuthenticating = status === 'checking';

  const onSubmit = (event) => {
    event.preventDefault();
    if (isAuthenticating) return;
    
    // Disparamos la acción a Firebase
    dispatch(startLoginWithEmailPassword({ email, password }));
  };

  // Si el usuario se autenticó correctamente, lo enviamos de vuelta a la biblioteca (modo admin)
  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logoPath} alt="Hogar Bambi Logo" className="login-logo" />
        <h1 className="login-title">Acceso Restringido</h1>
        <p className="login-subtitle">Modo de edición para personal autorizado</p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="email" 
              className="login-input" 
              placeholder="Correo electrónico" 
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
              placeholder="Contraseña" 
              name="password"
              value={password}
              onChange={onInputChange}
              required
            />
          </div>

          {/* Mostrar mensaje de error si existe */}
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
            {isAuthenticating ? 'Comprobando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};