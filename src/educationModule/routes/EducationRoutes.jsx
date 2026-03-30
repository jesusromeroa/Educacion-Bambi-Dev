import React from 'react'
import { MainPage } from '../pages/MainPage'
import { Navigate, Route, Routes } from 'react-router'
import { SubcategoriesPage } from '../pages/SubcategoriesPage'


export const EducationRoutes = () => {
  return (
    <Routes>

      <Route path="/inicio" element={<MainPage/>}/>

      <Route path="/subcategoria/*" element={<SubcategoriesPage/>}/>

      <Route path="/*" element={<Navigate to="/inicio"/>}/>

    </Routes>
  )
}

