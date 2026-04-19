import React from 'react'
import './styles/footer.css'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
// NUEVOS ICONOS PARA CONTACTO
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export const Footer = () => {
  return (
    <footer className='footer-container'>
        <div className='footer-info'>
            <div className='footer-element'>
              <h3 className='footer-title'>Hogar Bambi</h3>
              <p className='footer-text'>
                Brindamos atención integral con un enfoque sistémico a niños, niñas y adolescentes de 0 a 18 años, en nuestras cinco casas ubicadas en San Bernardino.
              </p>
            </div>
            
            <div className='footer-element'>
              <h3 className='footer-title'>Contacto</h3>
              <ul className='footer-contact-list'>
                  <li>
                    <LocationOnIcon fontSize="small" className="contact-icon"/> 
                    <span>Caracas - Venezuela</span>
                  </li>
                  <li>
                    <PhoneIcon fontSize="small" className="contact-icon"/> 
                    <span>+58 (424) 239.9144 <br/> +58 (212) 550.5539</span>
                  </li>
                  <li>
                    <EmailIcon fontSize="small" className="contact-icon"/> 
                    <a className='hogarbambiLink' href='mailto:asis.voluntariado@hogarbambi.org'>voluntariado@hogarbambi.org</a>
                  </li>
                  <li style={{marginTop: '10px', fontSize: '0.85rem', color: '#a0cfa0'}}>
                    RIF: J-30251707-9
                  </li>
              </ul>
            </div>

            <div className='footer-element'>
              <h3 className='footer-title'>Síguenos</h3>
              <div className='social-buttons-container'>
                <a target='_blank' rel="noreferrer" tabIndex={-1} href="https://www.facebook.com/hogarbambivenezuela/">
                  <button className='circular-button' title="Facebook"><FacebookOutlinedIcon/></button>
                </a>
                <a target='_blank' rel="noreferrer" tabIndex={-1} href="http://twitter.com/hogarbambi">
                  <button className='circular-button' title="X (Twitter)"><XIcon/></button>
                </a>
                <a target='_blank' rel="noreferrer" tabIndex={-1} href="https://www.instagram.com/hogarbambi/">
                  <button className='circular-button' title="Instagram"><InstagramIcon/></button>
                </a>
                <a target='_blank' rel="noreferrer" tabIndex={-1} href="https://www.youtube.com/channel/UC37FW4zsi8tHv7-tqkvUTZw">
                  <button className='circular-button' title="YouTube"><YouTubeIcon/></button>
                </a>
              </div>
            </div>
        </div>
        
        <div className='footer-bottom'>
            <p className='copyright-message'>
              &copy; {new Date().getFullYear()} Educación Bambi | Manejado por el Programa de Voluntariado de Hogar Bambi
            </p>
        </div>
    </footer>
  )
}