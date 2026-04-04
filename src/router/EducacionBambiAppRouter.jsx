import { Navigate, Route, Routes } from 'react-router-dom';
import { EducationRoutes } from '../educationModule/routes/EducationRoutes';
import { LoginPage } from '../auth/pages/LoginPage';

export const EducacionBambiAppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública para el panel de administración/login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas principales (Biblioteca pública) */}
      <Route path="/*" element={<EducationRoutes />} />
    </Routes>
  );
};