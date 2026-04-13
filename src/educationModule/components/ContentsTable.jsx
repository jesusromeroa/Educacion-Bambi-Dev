import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startSavingNewResource, startLoadingResources, startDeletingResource, startUpdatingResource } from '../../store/educationModule/thunks';
import { AddResourceModal } from './AddResourceModal';
import './styles/contentsTable.css';
import CategoryIcon from '@mui/icons-material/Category';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';

const resourceIcons = {
  default: <CategoryIcon sx={{ color: 'var(--darkGray)' }}/>,
  pdf: <PictureAsPdfIcon sx={{ color: 'var(--red)' }}/>,
  doc: <DescriptionIcon sx={{ color: 'var(--bambiBlue)' }}/>,
  video: <MovieIcon sx={{ color: 'var(--orange)' }}/>,
  imagen: <ImageIcon sx={{ color: 'var(--purple)' }}/>,
}

export const ContentsTable = ({pageItems = [], format= {tableFormat: [], dataFormat: []}, categoryNamesArray = []}) => {

  const { status } = useSelector(state => state.auth);
  const isAdmin = status === 'authenticated';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null); // NUEVO: Guarda el recurso activo
  const dispatch = useDispatch();

  // Abrir Modal (Si recibe 'row', es para editar. Si no, es nuevo)
  const handleOpenModal = (row = null) => {
    setResourceToEdit(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setResourceToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveOrEditResource = async (resourceData) => {
    // 1. Tomamos la ruta exacta para la base de datos (con guiones)
    const exactFirebasePath = resourceData.category ? [resourceData.category] : categoryNamesArray; 

    if (resourceToEdit) {
      const targetId = resourceToEdit.uid || resourceToEdit.id;
      if(!targetId) return alert("Error: No se encontró el identificador del recurso.");
      
      await dispatch(startUpdatingResource(targetId, {
        name: resourceData.title, 
        format: resourceData.format,
        url: resourceData.url
      }, exactFirebasePath));

    } else {
      await dispatch(startSavingNewResource({
        name: resourceData.title, 
        format: resourceData.format,
        url: resourceData.url
      }, exactFirebasePath));
    }

    // 2. SIEMPRE recargamos la vista en la que está parado el usuario actualmente
    dispatch(startLoadingResources(categoryNamesArray));
    handleCloseModal();
  };

  const handleDelete = async (row) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el recurso "${row.name || 'seleccionado'}"?`);
    
    if (confirmDelete) {
      const targetId = row.uid || row.id;
      
      if(!targetId) {
        return alert("Error: No se puede eliminar, falta el identificador del documento.");
      }
      
      // MAGIA AQUÍ: Reconstruimos la ruta con guiones para que Firebase la encuentre
      let pathForDeletion = [];
      if (row.category) pathForDeletion.push(row.category.replace(/ /g, '-'));
      if (row.subcategory) pathForDeletion.push(row.subcategory.replace(/ /g, '-'));

      // Si estamos en la página principal (categoryNamesArray vacío), usamos la ruta de la fila
      const exactFirebasePath = categoryNamesArray.length > 0 ? categoryNamesArray : pathForDeletion;
      
      // Mandamos a borrar a la ruta correcta en Firebase
      await dispatch(startDeletingResource(targetId, exactFirebasePath));
      
      // Recargamos la tabla manteniéndonos en la vista donde estábamos
      dispatch(startLoadingResources(categoryNamesArray));
    }
  };

  return (
    <>
      <AddResourceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveOrEditResource}
        initialData={resourceToEdit} // Le pasamos los datos al modal para que los pre-cargue
      />

      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <button 
            onClick={() => handleOpenModal()}
            style={{ backgroundColor: 'var(--bambiBlue, #2e7d32)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            + Agregar Nuevo Recurso
          </button>
        </div>
      )}

      <div style={{borderRadius: '15px', overflow: 'hidden'}}>
        <div className='table-container'>
        <table className='contents-table'>
          <thead>
            <tr>
              {format.tableFormat.map((columnName, index) => (<th key={index}>{columnName}</th>))}
              {isAdmin && <th>Acciones</th>}
            </tr> 
          </thead>
          <tbody>
            {pageItems.map((row, index) => {
              return (<tr key={ row.id || index }>
                        {format.dataFormat.map((propertyName, index) => (
                          <td key={index}>
                            { 
                              (index === 0) ? 
                              (     
                                  <div className='link-column' style={{display: 'flex', justifyContent:'left', alignItems: 'center'}}>
                                    {
                                      (resourceIcons[ row['format']?.toLowerCase() ]) ?
                                      (resourceIcons[ row['format'].toLowerCase() ])
                                      :
                                      (resourceIcons[ 'default' ])
                                    }
                                    {
                                      <a href={row.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: '20px'}}>
                                        { (row[propertyName]) ? row[propertyName] : 'N/A' }
                                      </a>
                                    }
                                  </div>
                              )
                              : 
                              (
                                  (row[propertyName]) ? row[propertyName] : 'N/A'
                              )
                            }
                          </td>))}

                          {/* AQUÍ CONECTAMOS LOS BOTONES DE EDITAR Y ELIMINAR */}
                          {isAdmin && (
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem', marginRight: '10px' }} title="Editar">✏️</button>
                              <button onClick={() => handleDelete(row)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }} title="Eliminar">🗑️</button>
                            </td>
                          )}

                      </tr>)
            })}
          </tbody>
        </table>
      </div>
      {
          (pageItems.length === 0) ?
          (
            <div className='no-items-found-container'>
              <FindInPageRoundedIcon sx={{ fontSize: 120 }}/>
              <p>No se encontró ningún recurso...</p>
            </div>
          )
          :
          (
            null
          )
        }
      </div>
    </>
  )
}