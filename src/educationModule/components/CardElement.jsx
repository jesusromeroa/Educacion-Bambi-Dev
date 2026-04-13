import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import './styles/cardElement.css';
import EditIcon from '@mui/icons-material/Edit'; 
import { useLocation, useNavigate } from 'react-router';
import { convertPathToArray, convertToHyphenatedFormat, truncateText } from '../../helpers';
import { startUpdatingCategoryImage } from '../../store/educationModule/thunks'; 

export const CardElement = ({ title = '', description = '', imageUrl = ''}) => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, email } = useSelector(state => state.auth);
  const superAdmins = ['admin@admin.com']; 
  const isSuperAdmin = status === 'authenticated' && 
                       email && 
                       superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

  const navigateInsideCategory = () => {
    let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
    pathCategories.shift();
    let path = '';
    if (pathCategories.length === 0){
      path = '/subcategoria/'+pathCategories.join('/')+convertToHyphenatedFormat(title); 
    }else{
      path = `/subcategoria/${pathCategories.join('/')}/${convertToHyphenatedFormat(title)}`
    }
    navigate(path, {replace: true});
    window.location.reload();
  }

  const handleEditImage = async (e) => {
    e.stopPropagation(); 
    const newImageUrl = window.prompt(`Ingresa la nueva URL de la imagen para la categoría "${title}":`, imageUrl);
    
    if (newImageUrl && newImageUrl.trim() !== '' && newImageUrl !== imageUrl) {
        let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
        pathCategories.shift(); 
        await dispatch(startUpdatingCategoryImage(title, newImageUrl.trim(), pathCategories));
    }
  }

  return (
    <div className="card-container" onClick={navigateInsideCategory}> 
        
        {isSuperAdmin && (
            <button 
                onClick={handleEditImage} 
                className="super-admin-edit-btn"
                title="Cambiar imagen de categoría"
            >
                <EditIcon fontSize="small" />
            </button>
        )}

        {/* TEXTO A LA IZQUIERDA */}
        <div className="card-info-content">
            <h3 className="card-title">
                {title}
            </h3>
            <p className="card-description">
                {truncateText({text: description, maxlength: 150})}
            </p>
        </div>

        {/* IMAGEN A LA DERECHA */}
        <div className="card-image-wrapper">
            <img className="card-picture" alt={title} src={imageUrl} />
        </div>

    </div>
  )
}