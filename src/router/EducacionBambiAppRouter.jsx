import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { EducationRoutes } from '../educationModule/routes/EducationRoutes'

export const EducacionBambiAppRouter = () => {
  return (
    <Routes>

      <Route path="/*" element={<EducationRoutes/>}/>
        
    </Routes>
  )
}
