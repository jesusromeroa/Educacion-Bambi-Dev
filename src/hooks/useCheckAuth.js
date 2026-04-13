import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from '../firebase/config';
import { login, logout } from '../store/auth/authSlice'; 

export const useCheckAuth = () => {
    // Traemos el estado actual desde Redux
    const { status } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    // ==========================================
    // 1. RECUPERAR SESIÓN AL RECARGAR (F5)
    // ==========================================
    useEffect(() => {
        // Este "listener" de Firebase se dispara nada más abrir la página
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (!user) {
                return dispatch(logout()); // Si no hay nadie, asegúrate de limpiar Redux
            }

            // Si Firebase dice que sí hay sesión, volvemos a meter los datos a Redux
            const { uid, email, displayName } = user;
            dispatch(login({ uid, email, displayName }));
        });

        return () => unsubscribe(); // Limpiamos la escucha si cerramos la app
    }, [dispatch]);

    // ==========================================
    // 2. AUTO-CIERRE POR INACTIVIDAD (30 MIN)
    // ==========================================
    useEffect(() => {
        // Solo activamos el temporizador si el usuario está logueado como Admin
        if (status !== 'authenticated') return;

        let timeoutId;
        const TIME_OUT_MS = 30 * 60 * 1000; // 30 minutos exactos en milisegundos

        const handleInactivity = async () => {
            alert("Tu sesión ha expirado por inactividad (30 minutos).");
            await signOut(firebaseAuth); // Matamos la sesión real en Firebase
            dispatch(logout());          // Limpiamos la pantalla en Redux
        };

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            // Volvemos a empezar la cuenta regresiva de 30 minutos
            timeoutId = setTimeout(handleInactivity, TIME_OUT_MS);
        };

        // Lista de eventos que demuestran que el usuario "sigue vivo" y trabajando
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        
        // Le pegamos el reinicio del timer a todos esos movimientos
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Arrancamos el cronómetro por primera vez al entrar
        resetTimer();

        // Limpiamos los eventos si el usuario decide darle al botón de cerrar sesión manual
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [status, dispatch]);

    // Retornamos el status para que las rutas sepan qué mostrar
    return status;
}