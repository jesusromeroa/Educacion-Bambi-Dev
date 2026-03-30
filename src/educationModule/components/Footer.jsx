import React from 'react'
import './styles/footer.css'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

export const Footer = () => {
  return (
    <div className='footer-container'>
        <div className='footer-info'>
            <div className='footer-element'>
              <span className='footer-title'>ACERCA DE NOSOTROS</span>
              <p className='footer-text'>
                En Hogar Bambi brindamos atención integral con enfoque sistémico a niños y niñas de 0 a 18 años, en nuestras cinco casas ubicadas en San Bernardino.
              </p>
            </div>
            <div className='footer-element'>
              <span className='footer-title'>CONTACTO</span>
              <p className='footer-text'>
              Caracas - Venezuela <br/>
              Teléfonos: +58 (424) 239.9144 <br/>
              +58 (212) 550.5539 <br/>
              +58 (212) 550.5714 <br/>
              Email: <a className='hogarbambiLink' href='mailto:asis.voluntariado@hogarbambi.org'>asis.voluntariado@hogarbambi.org</a> <br/>
              RIF: J- 30251707-9 
              </p>
            </div>
            <div className='footer-element'>
              <span className='footer-title'>REDES SOCIALES</span>
              <div className='social-buttons-container'>
                <a target='_blank' tabIndex={-1} href="https://www.facebook.com/hogarbambivenezuela/"><button className='circular-button facebook-button' ><FacebookOutlinedIcon/><div className="tooltip">Hogar Bambi Venezuela en Facebook</div></button></a>
                <a target='_blank' tabIndex={-1} href="http://twitter.com/hogarbambi"><button className='circular-button x-button' ><XIcon/><div className="tooltip">Hogar Bambi Venezuela en X</div></button></a>
                <a target='_blank' tabIndex={-1} href="https://www.instagram.com/hogarbambi/"><button className='circular-button instagram-button' ><InstagramIcon/><div className="tooltip">Hogar Bambi Venezuela en Instagram</div></button></a>
                <a target='_blank' tabIndex={-1} href="https://www.youtube.com/channel/UC37FW4zsi8tHv7-tqkvUTZw"><button className='circular-button youtube-button' ><YouTubeIcon/><div className="tooltip">Hogar Bambi Venezuela en Youtube</div></button></a>
              </div>
            </div>
        </div>
        <div className='footer-bottom'>
            <p className='copyright-message'><span className='copyright-icon'>&copy;</span> {` ${String((new Date()).getFullYear())} Educación Bambi | Manejado por el Programa de Voluntariado de Hogar Bambi`}</p>
        </div>
    </div>
  )
}
