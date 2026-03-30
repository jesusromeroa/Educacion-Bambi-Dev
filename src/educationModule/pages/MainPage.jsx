import React, { useEffect } from 'react'
import '../educationStyles/educationStyles.css'
import { EducationPageLayout } from '../layouts/EducationPageLayout'
import { WelcomingSlideShow } from '../components/WelcomingSlideShow'
import { CardsGrid } from '../components/CardsGrid'
import { startLoadingCategories, startLoadingSlideShowItems, startSavingCategory, startSavingNewResource } from '../../store/educationModule/thunks'
import { useDispatch } from 'react-redux'
import { TableSection } from '../components/TableSection'

export const MainPage = () => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(startLoadingSlideShowItems());
    dispatch(startLoadingCategories());

    /*
    dispatch(startSavingNewResource({
      name: 'Qué es la Ochoa',
      format: 'Power Point',
      url: 'https://docs.google.com/presentation/d/1g7XidVqc45lgDQm2BqXCGK06jEbSl2_p/edit?usp=sharing&ouid=107844741750362539679&rtpof=true&sd=true'
    }, ['Dirección-Sociolegal']));
    */
  }, [])
  

  
  return (
    <>
      <EducationPageLayout>

        <WelcomingSlideShow />

        <h1 className='section-title'>Categorías</h1>

        <CardsGrid/>
        
        <div style={{marginTop: "6vh"}}><TableSection title='Búsqueda Rápida'/></div>
        
      </EducationPageLayout>
    </>
  )
}
