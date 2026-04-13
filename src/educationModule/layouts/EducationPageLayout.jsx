import React from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const EducationPageLayout = ({children}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header/>
      
      {/* Añadimos un padding top dinámico para que nada quede debajo del header */}
      <main style={{ flexGrow: 1, paddingTop: '0px' }}> 
        {children}
      </main>

      <Footer/>
    </div>
  )
}