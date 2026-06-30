import React, { useState } from 'react';
import { EducationPageLayout } from '../layouts/EducationPageLayout';
import '../components/styles/landingPage.css';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import { saveContactMessage } from '../../firebase/educationModule/providers'; // <-- Importamos la función
import emailjs from '@emailjs/browser';

export const LandingPage = () => {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // 1. Guardamos en nuestra Base de Datos (Firestore)
    const resp = await saveContactMessage(formData);
    
    if (resp.ok) {
        // 2. Enviamos la notificación por correo (EmailJS)
        try {
            await emailjs.send(
                'service_q7jl8qj',   // Reemplaza con tu Service ID
                'template_2hfrhn8',  // Reemplaza con tu Template ID
                {
                    name: formData.name,
                    company: formData.company,
                    email: formData.email,
                    message: formData.message,
                },
                '3huac-p_YzyvAauhW'    // Reemplaza con tu Public Key
            );
            console.log("Notificación por correo enviada al equipo.");
        } catch (error) {
            console.error("El mensaje se guardó en BD, pero falló el envío de correo:", error);
        }

        // 3. Mostramos éxito al usuario y limpiamos
        setSendSuccess(true);
        setFormData({ name: '', company: '', email: '', message: '' });
        setTimeout(() => setSendSuccess(false), 5000); 
    } else {
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
    }
    
    setIsSending(false);
  };

  const scrollToContact = (e) => {
      e.preventDefault();
      document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <EducationPageLayout>
      <div className="landing-container">
        <section className="hero-section">
          <h1 className="hero-title">Transformando el futuro a través de la educación</h1>
          <p className="hero-subtitle">
            Nuestra plataforma digital centraliza recursos pedagógicos y sociolegales para brindar una atención integral y de excelencia a los niños, niñas y jóvenes de Hogar Bambi.
          </p>
          <a href="#contacto" onClick={scrollToContact} className="hero-cta-btn">
            Conviértete en Empresa Aliada
          </a>
        </section>

        <section className="metrics-section">
          <div className="metric-card">
            <SchoolIcon style={{ fontSize: '3rem', color: 'var(--lightGreen)' }} />
            <div className="metric-number">+120</div>
            <div className="metric-label">Niños Atendidos</div>
          </div>
          <div className="metric-card">
            <MenuBookIcon style={{ fontSize: '3rem', color: 'var(--lightGreen)' }} />
            <div className="metric-number">+500</div>
            <div className="metric-label">Recursos Educativos</div>
          </div>
          <div className="metric-card">
            <PeopleIcon style={{ fontSize: '3rem', color: 'var(--lightGreen)' }} />
            <div className="metric-number">5</div>
            <div className="metric-label">Casas Hogar</div>
          </div>
        </section>

        <section className="info-section">
          <div className="info-text">
            <h2>Transparencia y Tecnología</h2>
            <p>
              En Hogar Bambi creemos que la innovación tecnológica es clave para el cuidado infantil. Nuestra biblioteca virtual, <strong>"Educación Bambi"</strong>, permite a nuestro equipo de educadores y psicólogos acceder instantáneamente a protocolos, guías y material audiovisual estructurado.
            </p>
            <p>
              Gracias al apoyo de nuestras <strong>empresas donantes</strong>, mantenemos y expandimos esta infraestructura digital, garantizando que cada recurso aportado se traduzca en una mejor atención para nuestros jóvenes.
            </p>
            <div style={{ marginTop: '30px' }}>
                <Link to="/biblioteca" style={{ color: 'var(--darkGreen)', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem', borderBottom: '2px solid var(--lightGreen)', paddingBottom: '5px' }}>
                    Explorar nuestro portal educativo &rarr;
                </Link>
            </div>
          </div>
          <div className="info-image">
            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" alt="Educación en Hogar Bambi" />
          </div>
        </section>

        <section className="testimonial-section">
          <div className="testimonial-quote">
            "La plataforma nos ha permitido estandarizar nuestros procesos educativos y enfocar nuestro tiempo en lo que realmente importa: acompañar a nuestros niños en su desarrollo."
          </div>
          <div className="testimonial-author">— Equipo de Dirección Sociolegal, Hogar Bambi</div>
        </section>

        {/* NUEVA SECCIÓN DE CONTACTO */}
        <section id="contacto" className="contact-section">
          <h2 style={{ color: 'var(--darkGreen)', fontSize: '2.5rem', marginBottom: '10px' }}>Únete a nuestra misión</h2>
          <p style={{ color: '#555', fontSize: '1.1rem', maxWidth: '600px' }}>
              Déjanos los datos de tu empresa y nuestro equipo de alianzas estratégicas se comunicará contigo para presentarte nuestro modelo de patrocinio.
          </p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu Nombre Completo" className="contact-input" required />
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Nombre de tu Empresa u Organización" className="contact-input" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo de Contacto" className="contact-input" required />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="¿Cómo te gustaría colaborar?" rows="4" className="contact-textarea" required></textarea>
              
              {sendSuccess && <div style={{ color: 'var(--darkGreen)', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'var(--superLightGreen)', padding: '10px', borderRadius: '8px' }}>¡Mensaje enviado con éxito! Te contactaremos pronto.</div>}
              
              <button type="submit" className="contact-submit-btn" disabled={isSending}>
                  {isSending ? 'Enviando mensaje...' : 'Enviar Propuesta'}
              </button>
          </form>
        </section>

      </div>
    </EducationPageLayout>
  );
};