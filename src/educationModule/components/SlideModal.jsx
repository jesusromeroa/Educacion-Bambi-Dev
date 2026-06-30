import React, { useState, useEffect } from 'react';
import './styles/categoryModal.css'; // Usamos el mismo diseño moderno
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export const SlideModal = ({ isOpen, onClose, initialData, onSave, onDelete }) => {
    const [formData, setFormData] = useState({ alt: '' });
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({ alt: initialData.alt || '' });
        } else {
            setFormData({ alt: '' });
        }
        setSelectedImage(null);
        setIsUploading(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        if (e.target.files[0]) setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!initialData && !selectedImage) {
            return alert("Por favor selecciona una imagen para la portada.");
        }
        setIsUploading(true);
        await onSave(formData, selectedImage);
        setIsUploading(false);
    };

    const handleDeleteClick = () => {
        const confirm = window.confirm(`⚠️ ADVERTENCIA ⚠️\n¿Estás seguro de eliminar esta imagen de la portada permanentemente?`);
        if (confirm) onDelete(initialData.uid, initialData.storagePath);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Editar Imagen de Portada' : 'Nueva Imagen de Portada'}</h2>
                    <button onClick={onClose} disabled={isUploading} className="btn-close-icon"><CloseIcon /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Imagen del Slide</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            disabled={isUploading}
                            className="modal-input"
                        />
                        {selectedImage && (
                            <div style={{ color: 'var(--darkGreen)', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '5px' }}>
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
                        <label>Texto Alternativo (Opcional - Para accesibilidad)</label>
                        <input 
                            type="text" 
                            name="alt" 
                            value={formData.alt} 
                            onChange={handleChange} 
                            placeholder="Ej. Niños de Hogar Bambi sonriendo"
                            disabled={isUploading}
                            className="modal-input"
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
                                <SaveIcon fontSize="small"/> {isUploading ? 'Subiendo...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};