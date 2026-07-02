import React, { useRef, useState, useEffect } from 'react'
import './styles/welcomingSlideshow.css'
import { useSelector, useDispatch } from 'react-redux'
import { truncateText } from '../../helpers'

import { SlideModal } from './SlideModal';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { 
    startSavingSlideShowItemComplete, 
    startUpdatingSlideShowItemComplete, 
    startDeletingSlideShowItemComplete 
} from '../../store/educationModule/thunks';

export const slideTypes = {
    imageSlide: 'imageSlide',
    textSlide: 'textSlide',
}

export const WelcomingSlideShow = () => {

    const slides = useSelector(store => store.educationModule.slideShowItems);
    
    // PEGAR ESTO ✅
    const { status, role } = useSelector(state => state.auth);
    const isSuperAdmin = status === 'authenticated' && role === 'admin';

    const dispatch = useDispatch();
    const [currentSlideId, setCurrentSlideId] = useState(0); 
    const totalSlides = slides.length; 
    const slideshowContainer = useRef();
    const leftButton = useRef();
    const rightButton = useRef();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slideToEdit, setSlideToEdit] = useState(null);

    // ========================================================
    // CORRECCIÓN: Limpieza del DOM al borrar o agregar slides
    // ========================================================
    useEffect(() => {
        // 1. Reseteamos el estado lógico al primer slide
        setCurrentSlideId(0);
        
        // 2. Limpiamos los estilos "fantasmas" que dejó la animación
        if (slideshowContainer.current) {
            const elements = slideshowContainer.current.querySelectorAll('.slide-element');
            elements.forEach((el, idx) => {
                el.style.transition = 'none'; // Cortamos cualquier animación trabada
                el.style.left = '0%';         // Regresamos la imagen a la pantalla
                el.style.display = idx === 0 ? 'block' : 'none'; // Mostramos solo la primera
            });
        }
    }, [slides.length]); // Se ejecuta cada vez que cambia la cantidad de slides
    
    const slideElementX = (element, startPosX, endPosX, durationSeconds) => {
        if (!element) return;
        element.style.transition = '';
        element.style.left = startPosX;
        element.style.display = 'block';
        element.offsetHeight; 
        element.style.transition = `left ${durationSeconds}`;
        element.offsetHeight; 
        element.style.left = endPosX;
    }

    const slideLeft = (event) => {
        if(totalSlides <= 1) return; 
        const nextSlideId = (currentSlideId-1 < 0) ? totalSlides-1 : currentSlideId-1;
        const currentSlideElement = slideshowContainer.current.querySelector(`[slide-id='${currentSlideId}']`);
        const nextSlideElement = slideshowContainer.current.querySelector(`[slide-id='${nextSlideId}']`);

        slideElementX(currentSlideElement, '0%', '100%', '1.5s');
        slideElementX(nextSlideElement, '-100%', '0%', '1.5s');
        leftButton.current.disabled = true; 
        rightButton.current.disabled = true; 

        setTimeout(() => {
            if(leftButton.current && rightButton.current) {
                leftButton.current.disabled = false; 
                rightButton.current.disabled = false; 
            }
        }, 1500);

        setCurrentSlideId(nextSlideId);
    }

    const slideRight = (event) => {
        if(totalSlides <= 1) return;
        const nextSlideId = (currentSlideId+1 === totalSlides) ? 0 : currentSlideId+1;
        const currentSlideElement = slideshowContainer.current.querySelector(`[slide-id='${currentSlideId}']`);
        const nextSlideElement = slideshowContainer.current.querySelector(`[slide-id='${nextSlideId}']`);

        slideElementX(currentSlideElement, '0%', '-100%', '1.5s');
        slideElementX(nextSlideElement, '100%', '0%', '1.5s');
        leftButton.current.disabled = true; 
        rightButton.current.disabled = true; 

        setTimeout(() => {
            if(leftButton.current && rightButton.current) {
                leftButton.current.disabled = false; 
                rightButton.current.disabled = false; 
            }
        }, 1500);

        setCurrentSlideId(nextSlideId);
    }

    const handleOpenNewSlide = () => {
        setSlideToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditSlide = (slide) => {
        setSlideToEdit(slide);
        setIsModalOpen(true);
    };

    const handleSaveModal = async (formData, imageFile) => {
        if (slideToEdit) {
            await dispatch(startUpdatingSlideShowItemComplete(slideToEdit.uid, formData, imageFile, slideToEdit));
        } else {
            await dispatch(startSavingSlideShowItemComplete(formData, imageFile));
        }
        setIsModalOpen(false);
    };

    const handleDeleteModal = async (slideUid, storagePath) => {
        await dispatch(startDeletingSlideShowItemComplete(slideUid, storagePath));
        setIsModalOpen(false);
    };

    const loadSlides = () => {
        return (slides.map((slide, index) => {
            const editButton = isSuperAdmin ? (
                <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenEditSlide(slide); }} 
                    style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 60, cursor: 'pointer', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', color: 'var(--darkGreen)' }} 
                    title="Editar Slide"
                >
                    <EditIcon fontSize="small" />
                </button>
            ) : null;

            return (
                <div key={slide.uid || index} className='slide-element' slide-id={String(index)} style={{display: (index === 0) ? 'block' : 'none'}}>
                    {editButton}
                    <img className="slide-photo" src={`${slide.imageUrl}`} alt={slide.alt || 'Hogar Bambi'} />
                </div>
            );
        }));
    }

  return (
    <div className="welcoming-container">
        <div className="welcome-text-container"><span className="bienvenido-text">Portal Educativo Hogar Bambi</span></div>
        
        <div ref={slideshowContainer} className="slideshow-container">
            {isSuperAdmin && (
                <button 
                    onClick={handleOpenNewSlide} 
                    style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 60, padding: '10px 20px', backgroundColor: 'var(--darkGreen)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}
                >
                    <AddCircleOutlineIcon /> Nuevo Slide
                </button>
            )}

            {totalSlides > 1 && (
                <>
                    <button ref={leftButton} className="left-arrow-button" onClick={slideLeft}>
                        <div className="left-arrow" ></div>
                    </button>
                    <button ref={rightButton} className="right-arrow-button" onClick={slideRight}>
                        <div className="right-arrow"></div>
                    </button>
                </>
            )}
            
            {slides.length > 0 ? loadSlides() : <div style={{ color: 'white', textAlign: 'center', marginTop: '40%' }}>No hay imágenes en la portada.</div>}
        </div>
        
        <SlideModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            initialData={slideToEdit} 
            onSave={handleSaveModal} 
            onDelete={handleDeleteModal} 
        />
    </div>
  )
}