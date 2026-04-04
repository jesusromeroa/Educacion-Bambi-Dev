import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseAuth } from '../../firebase/config';
import { checkingCredentials, login, logout } from './authSlice';

export const startLoginWithEmailPassword = ({ email, password }) => {
    return async (dispatch) => {
        // 1. Ponemos la app en estado de "cargando"
        dispatch(checkingCredentials());

        try {
            // 2. Intentamos iniciar sesión en Firebase
            const result = await signInWithEmailAndPassword(FirebaseAuth, email, password);
            const { uid, displayName } = result.user;

            // 3. Si es exitoso, guardamos el usuario en Redux
            dispatch(login({ uid, displayName, email }));

        } catch (error) {
            // 4. Si falla (clave incorrecta, etc), cerramos sesión y guardamos el error
            console.error('Error en login:', error.message);
            
            // Firebase devuelve errores en inglés, vamos a poner uno amigable
            let errorMessage = 'Hubo un error en la autenticación.';
            if(error.code === 'auth/invalid-credential') errorMessage = 'El correo o la contraseña son incorrectos.';
            
            dispatch(logout({ errorMessage }));
        }
    };
};