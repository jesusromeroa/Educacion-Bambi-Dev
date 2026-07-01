import React, { useState, useEffect } from 'react';
import { loadCategories } from '../../firebase/educationModule/providers';
import './styles/addResourceModal.css';

const initialFormData = {
  title: ''
};

export const AddResourceModal = ({ isOpen, onClose, onSave, initialData, currentPath = [] }) => {
  const [optionsByLevel, setOptionsByLevel] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);
  const [formState, setFormState] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Evitamos el bucle infinito convirtiendo el arreglo de la URL en un String estable para las dependencias
  const currentPathString = currentPath.join('/');

  // 1. Cargar la configuración inicial de niveles bloqueados según la URL de navegación actual
  useEffect(() => {
    if (!isOpen) return;

    const loadAllNeededOptions = async () => {
      // Siempre cargamos las categorías principales (Nivel 0) de la raíz
      const resp0 = await loadCategories([]);
      const newOptions = { 0: resp0.ok ? resp0.categories : [] };
      const newPath = [];

      // Si estamos dentro de alguna categoría/subcategoría, seguimos su ruta para bloquear los dropdowns
      let currentBuildPath = [];
      for (let i = 0; i < currentPath.length; i++) {
        const segment = currentPath[i];
        currentBuildPath.push(segment);

        // Convertimos el identificador con guiones a texto limpio (ej: 'Direccion-Sociolegal' -> 'Direccion Sociolegal')
        const title = segment.replace(/-/g, ' ');
        newPath.push(title);

        // Cargamos de Firebase las subcategorías que pertenezcan a este nivel para el siguiente selector
        const respNext = await loadCategories(currentBuildPath);
        if (respNext.ok) {
          newOptions[i + 1] = respNext.categories;
        }
      }

      setOptionsByLevel(newOptions);
      setSelectedPath(newPath);
    };

    loadAllNeededOptions();
  }, [isOpen, currentPathString]);

  // 2. Controlar la edición de recursos existentes
  useEffect(() => {
    if (initialData) {
      setFormState({ title: initialData.name || '' });
      setSelectedFile(null);
    } else {
      setFormState(initialFormData);
      setSelectedFile(null);
    }
    setIsUploading(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const { title } = formState;

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({ ...formState, [name]: value });
  };

  // 3. LA MAGIA: Manejar el cambio manual de los dropdowns libres en cascada infinita
  const handleLevelChange = async (levelIndex, value) => {
    // Cortamos la ruta seleccionada hasta el nivel alterado e introducemos el nuevo valor
    const newPath = selectedPath.slice(0, levelIndex);
    if (value !== '') {
      newPath.push(value);
    }
    setSelectedPath(newPath);

    // Destruimos las opciones de todos los selectores inferiores ya que la ruta padre cambió
    const newOptions = { ...optionsByLevel };
    Object.keys(newOptions).forEach(key => {
      if (parseInt(key) > levelIndex) {
        delete newOptions[key];
      }
    });

    // Si el usuario seleccionó "Ninguna/Guardar aquí", nos detenemos
    if (value === '') {
      setOptionsByLevel(newOptions);
      return;
    }

    // Convertimos la ruta construida a formato con guiones para consultar a Firebase si tiene hijos
    const firebasePath = newPath.map(title => title.trim().replace(/ /g, '-'));

    const resp = await loadCategories(firebasePath);
    // Si la carpeta seleccionada posee subcarpetas, inicializamos de inmediato el nivel siguiente (N+1)
    if (resp.ok && resp.categories.length > 0) {
      newOptions[levelIndex + 1] = resp.categories;
    }
    setOptionsByLevel(newOptions);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
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
    
    if (title.trim().length === 0 || selectedPath.length === 0) {
        alert("Por favor, completa el título y selecciona la categoría.");
        return;
    }
    if (!initialData && !selectedFile) {
        alert("Por favor, selecciona un archivo para subir.");
        return;
    }

    setIsUploading(true);
    let finalFormat = initialData ? initialData.format : 'default'; 
    if (selectedFile) finalFormat = detectFormat(selectedFile);
    
    // Devolvemos al componente padre la data del archivo y el Arreglo de Rutas Exacto elegido
    await onSave({ 
      title, 
      format: finalFormat, 
      file: selectedFile,
      selectedPath 
    });
    
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
            type="text" className="modal-input" placeholder="Título del documento o video" name="title"
            value={title} onChange={onInputChange} required disabled={isUploading} style={{ marginBottom: '15px' }}
          />

          {/* RENDERIZADOR DINÁMICO EN CASCADA INFINITA */}
          {Array.from({ length: selectedPath.length + 1 }).map((_, index) => {
            // El nivel 0 (raíz) siempre sale. Los siguientes niveles solo si el padre tiene subcarpetas
            if (index > 0 && (!optionsByLevel[index] || optionsByLevel[index].length === 0)) return null;

            const isLocked = index < currentPath.length; // Bloqueado si el usuario ya está parado en esa URL
            const options = optionsByLevel[index] || [];
            const currentValue = selectedPath[index] || '';

            return (
              <div key={index} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>
                  {index === 0 ? 'Categoría Principal' : `Subcategoría Nivel ${index}`}
                </label>
                <select 
                  className="modal-select" 
                  value={currentValue}
                  onChange={(e) => handleLevelChange(index, e.target.value)}
                  required={index === 0}
                  disabled={isLocked || isUploading}
                >
                  <option value="" disabled={index === 0}>
                    {index === 0 ? '-- Selecciona la Categoría --' : '-- Ninguna (Guardar en este nivel principal) --'}
                  </option>
                  {options.map(cat => (
                      <option key={cat.uid || cat.title} value={cat.title}>{cat.title}</option>
                  ))}
                </select>
              </div>
            );
          })}

          <div style={{ marginBottom: '15px' }}>
              <input type="file" className="modal-input" onChange={handleFileChange} required={!initialData} disabled={isUploading} style={{ marginBottom: '5px' }} />
              {selectedFile && <div style={{ color: 'var(--darkGreen)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '5px' }}>📄 Archivo listo: {selectedFile.name}</div>}
          </div>

          {initialData && !selectedFile && <small style={{ display: 'block', marginBottom: '15px', color: '#666', fontSize: '0.85rem' }}>Deja este campo vacío si no deseas cambiar el archivo actual.</small>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={isUploading}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={isUploading}>{isUploading ? 'Subiendo...' : (initialData ? 'Actualizar' : 'Guardar Recurso')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};