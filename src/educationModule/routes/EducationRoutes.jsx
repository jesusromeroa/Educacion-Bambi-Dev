import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'; 
import { MainPage } from '../pages/MainPage';
import { SubcategoriesPage } from '../pages/SubcategoriesPage';
import { AdminPanelPage } from '../pages/AdminPanelPage';
import { LandingPage } from '../pages/LandingPage'; // NUEVO IMPORT

export const EducationRoutes = () => {
  return (
    <Routes>

      {/* 1. LA NUEVA CARA PÚBLICA DE LA FUNDACIÓN */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. EL PORTAL EDUCATIVO INTERNO (Antes era /inicio) */}
      <Route path="/biblioteca" element={<MainPage />} />
      
      {/* 3. SUB-RUTAS DE LA BIBLIOTECA */}
      <Route path="/subcategoria/*" element={<SubcategoriesPage />} />
      <Route path="/panel-control" element={<AdminPanelPage />} />

      {/* Si alguien escribe una URL que no existe, lo regresamos al inicio */}
      <Route path="/*" element={<Navigate to="/" />} />

    </Routes>
  );
};