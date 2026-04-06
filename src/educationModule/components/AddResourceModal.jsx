import React from 'react';
import { useForm } from '../../hooks/useForm';
import './styles/addResourceModal.css';

// 1. Agregamos el campo 'category' vacío por defecto
const formData = {
  title: '',
  url: '',
  format: 'pdf',
  category: '' 
};

export const AddResourceModal = ({ isOpen, onClose, onSave }) => {
  const { formState, onInputChange, onResetForm } = useForm(formData);
  
  // 2. Extraemos el nuevo campo category
  const { title = '', url = '', format = 'pdf', category = '' } = formState || formData;

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // 3. Validamos que el usuario HAYA seleccionado una categoría
    if (title.trim().length === 0 || url.trim().length === 0 || category.trim().length === 0) {
        alert("Por favor, completa todos los campos y selecciona una categoría.");
        return;
    }

    onSave(formState);
    
    onResetForm();
    onClose();
  };

  const handleClose = () => {
    onResetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Agregar Nuevo Recurso</h2>
        
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

          {/* 4. EL NUEVO SELECTOR DE CATEGORÍA QUE PENSASTE */}
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
            {/* Puedes agregar más opciones aquí si lo necesitas */}
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
              Guardar Recurso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};