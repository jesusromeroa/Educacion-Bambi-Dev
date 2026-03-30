import React, { useRef } from 'react'
import './styles/cardElement.css'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLocation, useNavigate } from 'react-router';
import { convertPathToArray, convertToHyphenatedFormat, truncateText } from '../../helpers';

export const CardElement = ({ title = '', description = '', imageUrl = ''}) => {

  const location = useLocation();
  const navigate = useNavigate();
  const showHideButton = useRef();
  const toogleShowHideDescription = () => {
    const button = showHideButton.current;
    const cardInfoOverlay = button.parentElement;

    if (cardInfoOverlay.classList.contains('show-description')){
      cardInfoOverlay.classList.remove('show-description');
      button.children[0].classList.remove('rotate-arrow-image');
    }else{
      cardInfoOverlay.classList.add('show-description');
      button.children[0].classList.add('rotate-arrow-image');
    }
  }

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

  return (
    <div className="card-container">
        <button onClick={() => navigateInsideCategory()} style={{height: '100%', width: '100%', border: 'none', padding: '0'}}><img className="card-picture" alt="Image" src={imageUrl} /></button>
        
        <div className="card-info-overlay">
            <button ref={showHideButton} onClick={() => toogleShowHideDescription()} className='show-description-button'><KeyboardArrowUpIcon fontSize='large' className='arrow-up-icon'/></button>
            <div className="card-title">
                {title}
            </div>
            <div className="card-description">
                {truncateText({text: description, maxlength: 440})}
            </div>
        </div>

    </div>
  )
}
