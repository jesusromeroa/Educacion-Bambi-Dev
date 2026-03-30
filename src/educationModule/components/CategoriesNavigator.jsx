import React from 'react'
import './styles/categoriesNavigator.css'
import { convertToSpacedFormat } from '../../helpers'
import { useNavigate } from 'react-router'

export const CategoriesNavigator = ({pathCategories = []}) => {

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  }

  return (
    <div className='categories-navigator-container'>
        <div className='unselected-category'>
          <span onClick={() => handleNavigation('/inicio')} className='category-link'>Inicio</span>
          </div>
        <div className='category-separator'>
          {'>'}
          </div>
        <div className='selected-category'>
          <span>{convertToSpacedFormat(pathCategories[pathCategories.length-1])}</span>
          </div>
    </div>
    
  )
}
