import React, { useState, useEffect } from 'react';
import './styles/addResourceModal.css';

const initialFormData = {
  title: '',
  url: '',
  format: 'pdf',
  category: '' 
};

// Le agregamos la propiedad initialData
export const AddResourceModal = ({ isOpen, onClose, onSave, initialData }) => {
  // Usamos useState en lugar de useForm para poder forzar la carga de datos al editar
  const [formState, setFormState] = useState(initialFormData);

  useEffect(() => {
    if (initialData) {
      // Firebase devuelve las categorías con espacios ("Educación Infantil")
      // Pero nuestro <select> requiere guiones ("Educación-Infantil") para hacer match.
      const formattedCategory = initialData.category ? initialData.category.replace(/ /g, '-') : '';
      
      setFormState({
        title: initialData.name || '',
        url: initialData.url || '',
        format: initialData.format || 'pdf',
        category: formattedCategory
      });
    } else {
      setFormState(initialFormData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const { title, url, format, category } = formState;

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (title.trim().length === 0 || url.trim().length === 0 || category.trim().length === 0) {
        alert("Por favor, completa todos los campos y selecciona una categoría.");
        return;
    }

    onSave(formState);
    setFormState(initialFormData); // Limpiamos tras guardar
  };

  const handleClose = () => {
    setFormState(initialFormData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{initialData ? 'Editar Recurso' : 'Agregar Nuevo Recurso'}</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            type="text" 
            className="modal-input" 
            placeholder="Título del documento o video" 
            name="title"
            value={title}
            onChange={onInputChange}
            required
          />

          <input 
            type="url" 
            className="modal-input" 
            placeholder="Enlace (URL de Google Drive, YouTube, etc.)" 
            name="url"
            value={url}
            onChange={onInputChange}
            required
          />

          <select 
            className="modal-select" 
            name="category"
            value={category}
            onChange={onInputChange}
            required
          >
            <option value="" disabled>-- Selecciona el Área / Categoría --</option>
            <option value="Dirección-Sociolegal">Dirección Sociolegal</option>
            <option value="Educación-Infantil">Educación Infantil</option>
            <option value="Educación-Juvenil">Educación Juvenil</option>
            <option value="Recursos-Humanos">Recursos Humanos</option>
          </select>

          <select 
            className="modal-select" 
            name="format"
            value={format}
            onChange={onInputChange}
          >
            <option value="pdf">Documento PDF</option>
            <option value="doc">Documento Word</option>
            <option value="video">Video</option>
            <option value="imagen">Imagen</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {initialData ? 'Actualizar' : 'Guardar Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};