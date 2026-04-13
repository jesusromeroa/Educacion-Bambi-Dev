import React from 'react'
import './styles/categoriesNavigator.css'
import { Link } from 'react-router-dom'; 

export const CategoriesNavigator = ({ pathCategories = [] }) => {

  // Obtenemos el último elemento del arreglo (que es la categoría actual)
  // Si el arreglo está vacío, ponemos un texto por defecto
  const categoryName = pathCategories.length > 0 
    ? pathCategories[pathCategories.length - 1].replace(/-/g, ' ') 
    : '';

  return (
    <div className="categories-navigator-container">
      
      {/* SECCIÓN INICIO: Toda el área verde es clickable */}
      <div className="btn-inicio-container">
        <Link to="/" className="link-full-area">
          Inicio <span className="arrow-separator"> &gt; </span>
        </Link>
      </div>

      {/* SECCIÓN NOMBRE DE CATEGORÍA: Ahora sí existe la variable */}
      <div className="selected-category">
        { categoryName }
      </div>

    </div>
  )
}