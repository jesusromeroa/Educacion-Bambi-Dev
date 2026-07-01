import React, { useState, useEffect } from 'react';
import './styles/categoryModal.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export const CategoryModal = ({ isOpen, onClose, initialData, onSave, onDelete }) => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({ title: initialData.title, description: initialData.description });
        } else {
            setFormData({ title: '', description: '' });
        }
        setSelectedImage(null);
        setIsUploading(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        
        const finalDataToSave = {
            title: formData.title,
            description: formData.description,
            // Mantenemos intactas las subcategorías ocultas para que no se borren al editar
            subcategories: initialData && initialData.subcategories ? initialData.subcategories : []
        };

        await onSave(finalDataToSave, selectedImage);
        setIsUploading(false);
    };

    const handleDeleteClick = () => {
        const confirm = window.confirm(`⚠️ ADVERTENCIA ⚠️\n¿Estás seguro de eliminar la categoría "${initialData.title}"?\n\nSi tiene recursos adentro, podrían perderse.`);
        if (confirm) {
            onDelete(initialData.title, initialData.storagePath); 
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                
                <div className="modal-header">
                    <h2>{initialData ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                    <button onClick={onClose} disabled={isUploading} className="btn-close-icon"><CloseIcon /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    
                    <div className="form-group">
                        <label>Título de la Categoría</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="Ej. Dirección Sociolegal"
                            required 
                            disabled={!!initialData || isUploading} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Imagen de Portada</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading}
                            className="modal-input"
                        />
                        {selectedImage && (
                            <div style={{ color: 'var(--bambiBlue, #2e7d32)', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '5px' }}>
                                🖼️ Imagen lista: {selectedImage.name}
                            </div>
                        )}
                        {initialData && !selectedImage && (
                            <small style={{ color: '#666', fontSize: '0.8rem' }}>
                                Deja este campo vacío para conservar la imagen actual.
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows="4" 
                            placeholder="Breve descripción de los recursos que contiene esta categoría..."
                            required 
                            disabled={isUploading}
                        />
                    </div>

                    <div className="modal-actions">
                        {initialData ? (
                            <button type="button" className="btn-delete" onClick={handleDeleteClick} disabled={isUploading}>
                                <DeleteForeverIcon fontSize="small"/> Eliminar
                            </button>
                        ) : <div></div>}
                        
                        <div className="right-actions">
                            <button type="button" className="btn-cancel" onClick={onClose} disabled={isUploading}>Cancelar</button>
                            <button type="submit" className="btn-save" disabled={isUploading}>
                                <SaveIcon fontSize="small"/> {isUploading ? 'Procesando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};