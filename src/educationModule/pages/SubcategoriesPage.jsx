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
  }, []);

  return (
    <>
      <EducationPageLayout>
        <CategoriesNavigator pathCategories={pathCategories}/>
        {
            (!categories.hasError) ?
            (<div style={{width: '100%', height: '100%', marginTop: "6vh"}}><CardsGrid/></div>)
            :
            (
              <TableSection title={pathCategories[pathCategories.length-1]}/>
            )
        }
      </EducationPageLayout>
    </>
  )
}
