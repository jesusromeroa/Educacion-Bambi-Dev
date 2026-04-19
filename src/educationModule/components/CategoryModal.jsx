import React, { useState, useEffect } from 'react';
import './styles/categoryModal.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export const CategoryModal = ({ isOpen, onClose, initialData, onSave, onDelete }) => {
    // Estado local para los datos del formulario
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });

    // Cuando el modal se abre, revisamos si trae datos (Edición) o viene vacío (Nueva Categoría)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ title: '', description: '', imageUrl: '' });
        }
    }, [initialData, isOpen]);

    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleDeleteClick = () => {
        const confirm = window.confirm(`⚠️ ADVERTENCIA ⚠️\n¿Estás seguro de eliminar la categoría "${initialData.title}"?\n\nSi tiene recursos adentro, podrían perderse.`);
        if (confirm) {
            onDelete(initialData.title); // O el ID que manejes en tu BD
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                
                <div className="modal-header">
                    <h2>{initialData ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                    <button onClick={onClose} className="btn-close-icon"><CloseIcon /></button>
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
                            disabled={!!initialData} // Usualmente no se cambia el título porque rompe la URL, pero si quieres permitirlo, quita esta línea
                        />
                    </div>

                    <div className="form-group">
                        <label>URL de la Imagen (Portada)</label>
                        <input 
                            type="url" 
                            name="imageUrl" 
                            value={formData.imageUrl} 
                            onChange={handleChange} 
                            placeholder="https://...(Opcional)"
                        />
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
                        />
                    </div>

                    <div className="modal-actions">
                        {/* Botón de eliminar solo aparece si estamos editando (initialData existe) */}
                        {initialData ? (
                            <button type="button" className="btn-delete" onClick={handleDeleteClick}>
                                <DeleteForeverIcon fontSize="small"/> Eliminar
                            </button>
                        ) : (
                            <div></div> // Espaciador para empujar los otros botones a la derecha
                        )}
                        
                        <div className="right-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn-save">
                                <SaveIcon fontSize="small"/> Guardar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};