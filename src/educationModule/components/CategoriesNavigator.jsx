import React from 'react'
import './styles/categoriesNavigator.css'
import { Link } from 'react-router-dom'; 

export const CategoriesNavigator = ({ pathCategories = [] }) => {

  const categoryName = pathCategories.length > 0 
    ? pathCategories[pathCategories.length - 1].replace(/-/g, ' ') 
    : '';

  return (
    <div className="categories-navigator-container">
      
      <div className="btn-inicio-container">
        {/* CAMBIO: Ahora dice "Biblioteca" y dirige a "/biblioteca" */}
        <Link to="/biblioteca" className="link-full-area">
          Biblioteca <span className="arrow-separator"> &gt; </span>
        </Link>
      </div>

      <div className="selected-category">
        { categoryName }
      </div>

    </div>
  )
}