import React from 'react'
import { EducacionBambiAppRouter } from './router/EducacionBambiAppRouter'
import { BrowserRouter } from 'react-router'

export const EducacionBambiApp = () => {
  return (
    <BrowserRouter>
      <EducacionBambiAppRouter/>
    </BrowserRouter>
  )
}
