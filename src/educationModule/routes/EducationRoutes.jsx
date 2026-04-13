import React from 'react'
import { MainPage } from '../pages/MainPage'
import { Navigate, Route, Routes } from 'react-router'
import { SubcategoriesPage } from '../pages/SubcategoriesPage'
import { AdminPanelPage } from '../pages/AdminPanelPage'; // Importa la página del panel de administración


export const EducationRoutes = () => {
  return (
    <Routes>

      <Route path="/inicio" element={<MainPage/>}/>

      <Route path="/subcategoria/*" element={<SubcategoriesPage/>}/>

      <Route path="/*" element={<Navigate to="/inicio"/>}/>

      <Route path="panel-control" element={<AdminPanelPage />} />

    </Routes>
  )
}

