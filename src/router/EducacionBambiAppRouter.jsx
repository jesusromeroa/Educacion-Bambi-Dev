import { Navigate, Route, Routes } from 'react-router-dom';
import { EducationRoutes } from '../educationModule/routes/EducationRoutes';
import { LoginPage } from '../auth/pages/LoginPage';
import { useCheckAuth } from '../hooks/useCheckAuth'; // 1. IMPORTA EL HOOK AQUÍ
import { CircularLoader } from '../educationModule/components/CircularLoader'; // Importa tu loader si lo tienes
import { RegisterPage } from '../auth/pages/RegisterPage';

export const EducacionBambiAppRouter = () => {
    
    // 2. EJECUTA EL HOOK. Esto activa todo (persistencia y timer)
    const status = useCheckAuth(); 

    // 3. MIENTRAS FIREBASE REVISA, MUESTRA CARGANDO
    // Esto es CLAVE para que al darle F5 no te bote inmediatamente
    if ( status === 'checking' ) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularLoader /> 
            </div>
        )
    }

    return (
        <Routes>
      {/* Ruta pública para el panel de administración/login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas principales (Biblioteca pública) */}
      <Route path="/*" element={<EducationRoutes />} />

      <Route path="/registro" element={<RegisterPage />} />

    </Routes>
    )
}