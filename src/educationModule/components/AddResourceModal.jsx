import React, { useState, useEffect } from 'react';
import './styles/addResourceModal.css';

const initialFormData = {
  title: '',
  category: '' 
  // Eliminamos 'format' de aquí, ahora lo detectaremos automáticamente
};

export const AddResourceModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formState, setFormState] = useState(initialFormData);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const formattedCategory = initialData.category ? initialData.category.replace(/ /g, '-') : '';
      
      setFormState({
        title: initialData.name || '',
        category: formattedCategory
      });
      setSelectedFile(null); 
    } else {
      setFormState(initialFormData);
      setSelectedFile(null);
    }
    setIsUploading(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const { title, category } = formState;

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // ========================================================
  // NUEVO: Función para autodetectar el formato del archivo
  // ========================================================
  const detectFormat = (file) => {
    if (!file) return 'default';
    
    // Leemos el tipo MIME del archivo (ej: 'application/pdf', 'video/mp4')
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('image')) return 'imagen';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    
    return 'default'; // Si es excel, ppt u otro desconocido
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (title.trim().length === 0 || category.trim().length === 0) {
        alert("Por favor, completa todos los campos y selecciona una categoría.");
        return;
    }

    if (!initialData && !selectedFile) {
        alert("Por favor, selecciona un archivo para subir.");
        return;
    }

    setIsUploading(true);
    
    // Asignamos el formato de forma inteligente
    // Si estamos editando y no subió archivo nuevo, conservamos el viejo. 
    // Si subió un archivo, lo detectamos.
    let finalFormat = initialData ? initialData.format : 'default'; 
    if (selectedFile) {
        finalFormat = detectFormat(selectedFile);
    }
    
    await onSave({ ...formState, format: finalFormat, file: selectedFile });
    
    setIsUploading(false);
    setFormState(initialFormData); 
    setSelectedFile(null);
  };

  const handleClose = () => {
    setFormState(initialFormData);
    setSelectedFile(null);
    setIsUploading(false);
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
            disabled={isUploading}
          />

          <select 
            className="modal-select" 
            name="category"
            value={category}
            onChange={onInputChange}
            required
            disabled={isUploading}
          >
            <option value="" disabled>-- Selecciona el Área / Categoría --</option>
            <option value="Dirección-Sociolegal">Dirección Sociolegal</option>
            <option value="Educación-Infantil">Educación Infantil</option>
            <option value="Educación-Juvenil">Educación Juvenil</option>
            <option value="Recursos-Humanos">Recursos Humanos</option>
          </select>

          {/* INPUT DE ARCHIVO FÍSICO */}
          <div style={{ marginBottom: '15px' }}>
              <input 
                type="file" 
                className="modal-input" 
                onChange={handleFileChange}
                required={!initialData} 
                disabled={isUploading}
                style={{ marginBottom: '5px' }}
              />
              
              {/* ======================================================== */}
              {/* NUEVO: Feedback visual del nombre del archivo              */}
              {/* ======================================================== */}
              {selectedFile && (
                  <div style={{ color: 'var(--bambiBlue, #2e7d32)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '5px' }}>
                      📄 Archivo listo: {selectedFile.name}
                  </div>
              )}
          </div>

          {initialData && !selectedFile && (
            <small style={{ display: 'block', marginBottom: '15px', color: '#666', fontSize: '0.85rem' }}>
              Deja este campo vacío si no deseas cambiar el archivo actual.
            </small>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={isUploading}>
              Cancelar
            </button>
            
            <button type="submit" className="btn-save" disabled={isUploading}>
              {isUploading ? 'Subiendo...' : (initialData ? 'Actualizar' : 'Guardar Recurso')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};