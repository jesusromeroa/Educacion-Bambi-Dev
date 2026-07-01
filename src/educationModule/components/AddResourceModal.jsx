import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // <-- 1. Importamos useSelector
import './styles/addResourceModal.css';

const initialFormData = {
  title: '',
  category: '',
  subcategory: '' // <-- 2. Nuevo campo
};

export const AddResourceModal = ({ isOpen, onClose, onSave, initialData }) => {
  // 3. Traemos las categorías reales de la Base de Datos
  const { categories } = useSelector(state => state.educationModule);

  const [formState, setFormState] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormState({
        title: initialData.name || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || ''
      });
      setSelectedFile(null); 
    } else {
      setFormState(initialFormData);
      setSelectedFile(null);
    }
    setIsUploading(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const { title, category, subcategory } = formState;

  // 4. Lógica para detectar las subcategorías disponibles según la categoría seleccionada
  const selectedCategoryObj = categories.find(cat => cat.title === category);
  const availableSubcategories = selectedCategoryObj?.subcategories || [];

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    
    // Si el usuario cambia la categoría principal, blanqueamos la subcategoría
    if (name === 'category') {
        setFormState({ ...formState, category: value, subcategory: '' });
    } else {
        setFormState({ ...formState, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const detectFormat = (file) => {
    if (!file) return 'default';
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('image')) return 'imagen';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    return 'default'; 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (title.trim().length === 0 || category.trim().length === 0) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    if (!initialData && !selectedFile) {
        alert("Por favor, selecciona un archivo para subir.");
        return;
    }

    setIsUploading(true);
    
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
            style={{ marginBottom: '15px' }}
          />

          {/* MENÚ DINÁMICO DE CATEGORÍAS */}
          <select 
            className="modal-select" 
            name="category"
            value={category}
            onChange={onInputChange}
            required
            disabled={isUploading}
            style={{ marginBottom: '15px' }}
          >
            <option value="" disabled>-- Selecciona la Categoría --</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.title}>
                    {cat.title}
                </option>
            ))}
          </select>

          {/* MENÚ CONDICIONAL DE SUBCATEGORÍAS */}
          {availableSubcategories.length > 0 && (
            <select 
              className="modal-select" 
              name="subcategory"
              value={subcategory}
              onChange={onInputChange}
              disabled={isUploading}
              style={{ marginBottom: '15px' }}
              required /* Lo hacemos obligatorio si existen subcategorías */
            >
              <option value="" disabled>-- Selecciona una Subcategoría --</option>
              {availableSubcategories.map((sub, index) => (
                  <option key={index} value={sub}>
                      {sub}
                  </option>
              ))}
            </select>
          )}

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