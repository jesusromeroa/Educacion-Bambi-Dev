import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice'; 

// Importamos íconos modernos para los botones
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './styles/header.css';

export const Header = () => {
    const { status, displayName } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- LÓGICA DEL SMART HEADER ---
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Si scrolleamos hacia abajo y pasamos los primeros 50px de la página
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false); // Ocultamos el header
            } else {
                setIsVisible(true);  // Mostramos el header al subir
            }

            setLastScrollY(currentScrollY);
        };

        // Agregamos el event listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Limpiamos el event listener al desmontar el componente
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);
    // --------------------------------

    const onLogout = () => {
        dispatch( logout() ); 
        navigate('/login', { replace: true });
    }

    return (
        // Aplicamos la clase dinámicamente dependiendo del estado isVisible
        <header className={`header-container ${isVisible ? '' : 'header-hidden'}`}>
            
            <div className="logo-section">
                <Link to="/" tabIndex={0} className="link-to-inicio">
                    <img 
                      src="/HBV_logo_2022_verde.png" 
                      alt="Bambi Logo" 
                      className="header-logo"
                    />
                </Link>
            </div>
            
            <nav className="header-nav">
                {
                    (status === 'authenticated')
                    ? (
                        <div className="admin-menu">
                            <span className="admin-badge">
                                <AccountCircleIcon fontSize="small" />
                                { displayName || 'Admin' }
                            </span>
                            <button onClick={onLogout} className="modern-btn logout-btn">
                                <LogoutIcon fontSize="small" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )
                    : (
                        <Link to="/login" className="modern-btn login-btn">
                            <LoginIcon fontSize="small" />
                            Iniciar Sesión
                        </Link>
                    )
                }
            </nav>

        </header>
    );
};