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

  // 1. Extraemos las categorías y el estado de carga desde Redux
  const { loadedCategories, isLoading } = useSelector(store => store.educationModule.categories);
  
  // 2. Extraemos la información del usuario para saber si es Super Admin
  const { status, email } = useSelector(state => state.auth);
  const superAdmins = ['admin@admin.com'];
  const isSuperAdmin = status === 'authenticated' && email && superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

  // 3. LA MAGIA CONDICIONAL: 
  // Mostrar si está cargando (para ver el loader), si hay datos, o si es Admin (para poder agregar)
  const showSubcategoriesSection = isLoading || loadedCategories.length > 0 || isSuperAdmin;

  useEffect(() => {
    dispatch(startLoadingCategories(pathCategories));
  }, [location.pathname]); 

  return (
    <EducationPageLayout>
      <CategoriesNavigator pathCategories={pathCategories}/>
      
      {/* SECCIÓN 1: SUBCATEGORÍAS (Se oculta para usuarios normales si está vacía) */}
      {showSubcategoriesSection && (
        <div style={{width: '100%', height: '100%', marginTop: "2vh"}}>
          <h2 className='section-title' style={{marginLeft: '8%', fontSize: '1.8rem'}}>Subcategorías</h2>
          <CardsGrid/>
        </div>
      )}

      {/* SECCIÓN 2: RECURSOS (Tabla) */}
      <div style={{marginTop: "6vh"}}>
        <TableSection title="Recursos"/>
      </div>
    </EducationPageLayout>
  )
}