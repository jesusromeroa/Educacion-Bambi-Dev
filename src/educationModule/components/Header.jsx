import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice'; 
import { signOut } from 'firebase/auth'; 
import { firebaseAuth } from '../../firebase/config';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; 
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './styles/header.css';

export const Header = () => {
    const { status, email } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const superAdmins = ['admin@admin.com']; 
    const isSuperAdmin = status === 'authenticated' && email && superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileOpen, setIsMobileOpen] = useState(false); // ESTADO PARA EL MENÚ

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
                setIsMobileOpen(false); // Cierra el menú móvil al bajar
            } else {
                setIsVisible(true);  
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const onLogout = async () => {
        try {
            await signOut(firebaseAuth); 
            dispatch( logout() ); 
            navigate('/', { replace: true }); 
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <header className={`header-container ${isVisible ? '' : 'header-hidden'}`}>
            
            <div className="logo-section">
                <Link to="/" tabIndex={0} className="link-to-inicio">
                    <img src="/HBV_logo_2022_verde.png" alt="Bambi Logo" className="header-logo" />
                </Link>
            </div>
            
            {/* BOTÓN HAMBURGUESA */}
            <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                {isMobileOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
            </button>

            {/* NAV QUE RESPONDE A CLASES */}
            <nav className={`header-nav ${isMobileOpen ? 'nav-open' : ''}`}>
                {
                    (status === 'authenticated')
                    ? (
                        <div className="admin-menu">
                            {isSuperAdmin && (
                                <Link to="/panel-control" className="modern-btn" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #2e7d32' }}>
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