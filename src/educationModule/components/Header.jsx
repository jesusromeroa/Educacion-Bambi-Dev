import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice'; 
import { signOut } from 'firebase/auth'; // Asegurando el cierre de sesión real
import { firebaseAuth } from '../../firebase/config';

// Importamos íconos modernos para los botones
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // NUEVO: Ícono para el panel
import './styles/header.css';

export const Header = () => {
    // NUEVO: Extraemos también el 'email' de Redux
    const { status, displayName, email } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ==========================================
    // NUEVO: LÓGICA DE SUPER ADMIN
    // ==========================================
    const superAdmins = ['admin@admin.com']; 
    const isSuperAdmin = status === 'authenticated' && 
                         email && 
                         superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

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

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);
    // --------------------------------

    // Mantenemos el cierre de sesión robusto que hicimos antes
    const onLogout = async () => {
        try {
            await signOut(firebaseAuth); 
            dispatch( logout() ); 
            navigate('/', { replace: true }); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
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
                        <div className="admin-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            
                            {/* NUEVO: BOTÓN EXCLUSIVO DEL PANEL DE CONTROL */}
                            {isSuperAdmin && (
                                <Link 
                                    to="/panel-control" 
                                    className="modern-btn" 
                                    style={{ 
                                        backgroundColor: '#e8f5e9', 
                                        color: '#2e7d32', 
                                        border: '1px solid #2e7d32' 
                                    }}
                                >
                                    <AdminPanelSettingsIcon fontSize="small" />
                                    Acceso de Usuarios
                                </Link>
                            )}

                            <span className="admin-badge">
                                <AccountCircleIcon fontSize="small" />
                                { isSuperAdmin ? 'Admin' : 'Profesor' }
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
                            Acceso de Personal
                        </Link>
                    )
                }
            </nav>

        </header>
    );
};