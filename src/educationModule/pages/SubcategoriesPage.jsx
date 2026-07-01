import React, { useEffect } from 'react'
import '../educationStyles/educationStyles.css'
import { EducationPageLayout } from '../layouts/EducationPageLayout'
import { CardsGrid, TableSection } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { startLoadingCategories } from '../../store/educationModule/thunks'
import { useLocation } from 'react-router'
import { convertPathToArray } from '../../helpers'
import { CategoriesNavigator } from '../components/CategoriesNavigator'

export const SubcategoriesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
  pathCategories.shift();

  const { categories } = useSelector(store => store.educationModule);

  useEffect(() => {
    dispatch(startLoadingCategories(pathCategories));
  }, [location.pathname]); // CLAVE: Agregamos location.pathname para que recargue si entramos a una subcarpeta

  return (
    <EducationPageLayout>
      <CategoriesNavigator pathCategories={pathCategories}/>
      
      {/* SECCIÓN 1: SUBCATEGORÍAS (Tarjetas) */}
      <div style={{width: '100%', height: '100%', marginTop: "2vh"}}>
        <h2 className='section-title' style={{marginLeft: '8%', fontSize: '1.8rem'}}>Subcategorías</h2>
        <CardsGrid/>
      </div>

      {/* SECCIÓN 2: RECURSOS (Tabla) */}
      <div style={{marginTop: "6vh"}}>
        <TableSection title="Recursos"/>
      </div>
    </EducationPageLayout>
  )
}