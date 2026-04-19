import React from 'react';
import { useSelector } from 'react-redux'; 
import './styles/cardElement.css';
import EditIcon from '@mui/icons-material/Edit'; 
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // NUEVO
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // NUEVO
import { useLocation, useNavigate } from 'react-router-dom';
import { convertPathToArray, convertToHyphenatedFormat, truncateText } from '../../helpers';

// Recibimos las nuevas propiedades (onMoveUp, isFirst, etc)
export const CardElement = ({ title = '', description = '', imageUrl = '', onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const { status, email } = useSelector(state => state.auth);
  const superAdmins = ['admin@admin.com']; 
  const isSuperAdmin = status === 'authenticated' && email && superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

  const navigateInsideCategory = () => {
    let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
    pathCategories.shift();
    let path = `/subcategoria/${pathCategories.join('/')}${pathCategories.length > 0 ? '/' : ''}${convertToHyphenatedFormat(title)}`;
    navigate(path, {replace: true});
    window.location.reload();
  }

  // Si no hay imagen, usamos el logo de Bambi por defecto
  const finalImageUrl = imageUrl && imageUrl.trim() !== '' ? imageUrl : '/HBV_logo_2022_verde.png';

  return (
    <div className="card-container" onClick={navigateInsideCategory}> 
        
        {/* PANEL DE CONTROL SUPER ADMIN */}
        {isSuperAdmin && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '8px', zIndex: 10 }}>
                {/* Flecha Arriba (Se oculta si es la primera tarjeta) */}
                {!isFirst && (
                    <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="super-admin-edit-btn" title="Mover Arriba">
                        <ArrowUpwardIcon fontSize="small" />
                    </button>
                )}
                
                {/* Flecha Abajo (Se oculta si es la última tarjeta) */}
                {!isLast && (
                    <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="super-admin-edit-btn" title="Mover Abajo">
                        <ArrowDownwardIcon fontSize="small" />
                    </button>
                )}

                {/* Botón de Editar */}
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="super-admin-edit-btn" title="Editar Categoría">
                    <EditIcon fontSize="small" />
                </button>
            </div>
        )}

        <div className="card-info-content">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{truncateText({text: description, maxlength: 200})}</p>
        </div>

        <div className="card-image-wrapper">
            {/* Usamos finalImageUrl en lugar de imageUrl */}
            <img className="card-picture" alt={title} src={finalImageUrl} style={{ objectFit: imageUrl ? 'cover' : 'contain' }} />
        </div>
    </div>
  )
}