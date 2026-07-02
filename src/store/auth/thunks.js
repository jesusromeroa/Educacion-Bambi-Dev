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
            
            // BUSCAMOS EL ROL EN LA BASE DE DATOS
            const roleResp = await checkIsEmailWhitelisted(email);
            const userRole = roleResp.ok ? roleResp.role : 'profesor';

            // LO GUARDAMOS EN REDUX
            dispatch(login({ uid, displayName, email, role: userRole }));

        } catch (error) {
            console.error('Error en login:', error.message);
            let errorMessage = 'Hubo un error en la autenticación.';
            if(error.code === 'auth/invalid-credential') errorMessage = 'El correo o la contraseña son incorrectos.';
            dispatch(logout({ errorMessage }));
        }
    };
};

export const startRegisterWithEmailPassword = ({ email, password, displayName }) => {
    return async (dispatch) => {
        dispatch(checkingCredentials()); 

        try {
            const checkResp = await checkIsEmailWhitelisted(email);
            if (!checkResp.ok) throw new Error(checkResp.errorMessage);

            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const { uid } = result.user;
            
            dispatch(login({ uid, displayName, email, role: checkResp.role }));

        } catch (error) {
            console.error('Error en registro:', error.message);
            let errorMessage = error.message; 
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo ya tiene una cuenta creada.';
            if (error.code === 'auth/weak-password') errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            dispatch(logout({ errorMessage }));
        }
    };
};