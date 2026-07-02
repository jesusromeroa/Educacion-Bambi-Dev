import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from '../firebase/config';
import { login, logout } from '../store/auth/authSlice'; 
import { checkIsEmailWhitelisted } from '../firebase/educationModule/providers'; // <-- NUEVO IMPORT

export const useCheckAuth = () => {
    const { status } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (!user) return dispatch(logout()); 

            const { uid, email, displayName } = user;
            
            // RECUPERAMOS EL ROL CUANDO EL USUARIO RECARGA LA PÁGINA
            const roleResp = await checkIsEmailWhitelisted(email);
            const userRole = roleResp.ok ? roleResp.role : 'profesor';

            dispatch(login({ uid, email, displayName, role: userRole }));
        });

        return () => unsubscribe(); 
    }, [dispatch]);

    useEffect(() => {
        if (status !== 'authenticated') return;

        let timeoutId;
        const TIME_OUT_MS = 30 * 60 * 1000; 

        const handleInactivity = async () => {
            alert("Tu sesión ha expirado por inactividad (30 minutos).");
            await signOut(firebaseAuth); 
            dispatch(logout());          
        };

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(handleInactivity, TIME_OUT_MS);
        };

        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [status, dispatch]);

    return status;
}