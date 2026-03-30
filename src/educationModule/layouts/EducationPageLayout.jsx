import React from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const EducationPageLayout = ({children}) => {
  return (
    <>
      <Header/>
      {children}
      <Footer/>
    </>
  )
}
