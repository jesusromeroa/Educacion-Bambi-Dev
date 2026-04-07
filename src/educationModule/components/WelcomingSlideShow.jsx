import React, { useMemo, useRef, useState } from 'react'
import './styles/welcomingSlideshow.css'
import { useSelector } from 'react-redux'
import { truncateText } from '../../helpers'

/*
//Aqui aparecen los datos que se cargan desde de la base de datos
//-------------------------------------------------------------
//1.- cartas del slideshow
//solo hay dos tipos: imageSlide (muestra una imagen) y textSlide (muestra un titulo y un texto)
//el orden de los slides importa (es el mismo orden en el que se muestran, y el slide de posicion
//0 en el arreglo siempre es el primero).
//el tipo textslide está medio bugueado. Intenté arreglarlo con @query pero quedó muy enrevesado
//pido perdon si alguien tiene que arreglar eso. El problema es que a veces el texto no se ve cuando
//cambias el tamaño de pantalla o se ve raro. Se debería poder correjir con css para no tener que estar
//cambiando el margin o el padding en los @query, pero deberia ser suficiente con no escribir mensajes muy largos.
//Se agregó la funcion truncateText.js en los helpers para evitar que los textos grandes de pasen de una cierta
//cantidad de caracteres
const slides = [{
  type: 'imageSlide',
  imageUrl: 'https://drive.google.com/thumbnail?id=12XY9zqppXyZrXe7UeVjc1ZC9eGGvoOxO&sz=s4000',
  alt: 'Image of a smiling kid',
  index: 0
},
{
  type: 'textSlide',
  title: '¿Quienes Somos?',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  index: 1
}];

*/

export const  slideTypes = {
    imageSlide: 'imageSlide',
    textSlide: 'textSlide',
}

export const WelcomingSlideShow = () => {

    const slides = useSelector(store => store.educationModule.slideShowItems);

    const [currentSlideId, setCurrentSlideId] = useState(0); 
    const totalSlides = slides.length; 
    const slideshowContainer = useRef();
    const leftButton = useRef();
    const rightButton = useRef();
    
    const slideElementX = (element, startPosX, endPosX, durationSeconds) => {
        if (!element) return;
        element.style.transition = '';
        element.style.left = startPosX;
        element.style.display = 'block';
        element.offsetHeight; //force refresh
        element.style.transition = `left ${durationSeconds}`;
        element.offsetHeight; //force refresh
        element.style.left = endPosX;

    }

    const slideLeft = (event) => {

        const nextSlideId = (currentSlideId-1 < 0) ? totalSlides-1 : currentSlideId-1;
        const currentSlideElement = slideshowContainer.current.querySelector(`[slide-id='${currentSlideId}']`);
        const nextSlideElement = slideshowContainer.current.querySelector(`[slide-id='${nextSlideId}']`);

        slideElementX(currentSlideElement, '0%', '100%', '1.5s');
        slideElementX(nextSlideElement, '-100%', '0%', '1.5s');
        leftButton.current.disabled = true; 
        rightButton.current.disabled = true; 

        setTimeout(() => {
            leftButton.current.disabled = false; 
            rightButton.current.disabled = false; 
        }, 1500);

        setCurrentSlideId(nextSlideId);
    }

    const slideRight = (event) => {

        const nextSlideId = (currentSlideId+1 === totalSlides) ? 0 : currentSlideId+1;
        const currentSlideElement = slideshowContainer.current.querySelector(`[slide-id='${currentSlideId}']`);
        const nextSlideElement = slideshowContainer.current.querySelector(`[slide-id='${nextSlideId}']`);

        slideElementX(currentSlideElement, '0%', '-100%', '1.5s');
        slideElementX(nextSlideElement, '100%', '0%', '1.5s');
        leftButton.current.disabled = true; 
        rightButton.current.disabled = true; 

        setTimeout(() => {
            leftButton.current.disabled = false; 
            rightButton.current.disabled = false; 
        }, 1500);

        setCurrentSlideId(nextSlideId);
    }

    const loadSlides = () => {
        return (slides.map((slide, index) => {
            switch (slide.type) {
                case slideTypes.imageSlide:
                    return (<div key={index} className='slide-element' slide-id={String(index)} style={{display: (index === 0) ? 'block' : 'none'}}>
                                <img className="slide-photo" src={`${slide.imageUrl}`} alt={slide.alt} />
                            </div>);
                case slideTypes.textSlide:
                    return (<div key={index} className='slide-element' slide-id={String(index)} style={{display: (index === 0) ? 'block' : 'none'}}>
                                <p className="slide-title">{truncateText({text: slide.title, maxlength: 25})}</p>
                                <p className="slide-info">{truncateText({text: slide.content, maxlength: 440})}</p> 
                            </div>);
                default:
                    throw new Error('Unrecognized slide type on SlideShow Component')
            }
        }));
    }

  return (
    <div className="welcoming-container">

        <div className="welcome-text-container"><span className="bienvenido-text">Portal Educativo Hogar Bambi</span></div>
        
        <div ref={slideshowContainer} className="slideshow-container">
            <button ref={leftButton} className="left-arrow-button" onClick={slideLeft}>
                <div className="left-arrow" ></div>
            </button>
            <button ref={rightButton} className="right-arrow-button" onClick={slideRight}>
                <div className="right-arrow"></div>
            </button>
            {loadSlides()}
        </div>
        
    </div>
  )
}
