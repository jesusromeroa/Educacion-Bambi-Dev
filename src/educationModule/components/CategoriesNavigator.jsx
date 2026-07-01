import React from 'react'
import './styles/categoriesNavigator.css'
import { Link } from 'react-router-dom'; 

export const CategoriesNavigator = ({ pathCategories = [] }) => {

  return (
    <div className="categories-navigator-container">
      
      {/* 1. Botón Raíz: Biblioteca */}
      <div className="btn-inicio-container">
        <Link to="/biblioteca" className="link-full-area">
          Biblioteca {pathCategories.length > 0 && <span className="arrow-separator"> &gt; </span>}
        </Link>
      </div>

      {/* 2. Botones Intermedios y Final */}
      {pathCategories.map((category, index) => {
        const isLast = index === pathCategories.length - 1;
        const categoryName = category.replace(/-/g, ' ');

        // Construimos la URL hasta este nivel específico
        // Ej: si index es 0, la ruta es /subcategoria/Educacion-Juvenil
        const currentPathUrl = `/subcategoria/${pathCategories.slice(0, index + 1).join('/')}`;

        // Si es el último elemento, lo mostramos como texto fijo (la carpeta actual)
        if (isLast) {
          return (
            <div key={index} className="selected-category">
              {categoryName}
            </div>
          );
        }

        // Si es un nivel intermedio, lo mostramos como un enlace para poder retroceder
        return (
          <div key={index} className="intermediate-container">
            <Link to={currentPathUrl} className="link-full-area">
              {categoryName} <span className="arrow-separator"> &gt; </span>
            </Link>
          </div>
        );
      })}

    </div>
  )
}