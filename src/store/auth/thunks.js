import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { firebaseAuth } from '../../firebase/config'; 
import { checkingCredentials, login, logout } from './authSlice';
import { checkIsEmailWhitelisted } from '../../firebase/educationModule/providers'; 

export const startLoginWithEmailPassword = ({ email, password }) => {
    return async (dispatch) => {
        dispatch(checkingCredentials());

        try {
            const result = await signInWithEmailAndPassword(firebaseAuth, email, password); 
            const { uid, displayName } = result.user;
            dispatch(login({ uid, displayName, email }));

        } catch (error) {
            console.error('Error en login:', error.message);
            let errorMessage = 'Hubo un error en la autenticación.';
            if(error.code === 'auth/invalid-credential') errorMessage = 'El correo o la contraseña son incorrectos.';
            dispatch(logout({ errorMessage }));
        }
    };
};

// ========================================================
// NUEVO: REGISTRO DE PROFESORES CON LISTA BLANCA
// ========================================================
export const startRegisterWithEmailPassword = ({ email, password, displayName }) => {
    return async (dispatch) => {
        dispatch(checkingCredentials()); 

        try {
            // 1. PRIMERO: Verificamos si el Super Admin lo invitó
            const checkResp = await checkIsEmailWhitelisted(email);
            
            if (!checkResp.ok) {
                throw new Error(checkResp.errorMessage);
            }

            // 2. SEGUNDO: Si está invitado, le creamos la cuenta en Firebase
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const { uid } = result.user;
            
            // 3. Lo logueamos en Redux para que entre a la app
            dispatch(login({ uid, displayName, email }));

        } catch (error) {
            console.error('Error en registro:', error.message);
            
            let errorMessage = error.message; 
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo ya tiene una cuenta creada.';
            if (error.code === 'auth/weak-password') errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            
            dispatch(logout({ errorMessage }));
        }
    };
};