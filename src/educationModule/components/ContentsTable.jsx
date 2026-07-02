import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  startSavingNewResource, 
  startLoadingResources, 
  startDeletingResourceComplete, 
  startUpdatingResourceComplete 
} from '../../store/educationModule/thunks';
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
  const [resourceToEdit, setResourceToEdit] = useState(null); 
  const dispatch = useDispatch();

  const handleOpenModal = (row = null) => {
    setResourceToEdit(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setResourceToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveOrEditResource = async (resourceData) => {
    const exactFirebasePath = resourceData.category ? [resourceData.category] : categoryNamesArray; 

    if (resourceToEdit) {
      const targetId = resourceToEdit.uid || resourceToEdit.id;
      if(!targetId) return alert("Error: No se encontró el identificador del recurso.");
      
      await dispatch(startUpdatingResourceComplete(
          targetId, 
          resourceData, 
          resourceToEdit, 
          exactFirebasePath
      ));

    } else {
       console.log("Creación de recurso delegada al componente padre.");
    }

    handleCloseModal();
  };

  const handleDelete = async (row) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el recurso "${row.name || 'seleccionado'}"?`);
    
    if (confirmDelete) {
      const targetId = row.uid || row.id;
      
      if(!targetId) {
        return alert("Error: No se puede eliminar, falta el identificador del documento.");
      }
      
      // 1. ¿DÓNDE VIVE EL ARCHIVO EN LA BD? (Para el borrado)
      let deletePathArray = [];
      if (row.category) deletePathArray.push(row.category.replace(/ /g, '-'));
      if (row.subcategory) deletePathArray.push(row.subcategory.replace(/ /g, '-'));

      // 2. ¿DÓNDE ESTAMOS PARADOS? (Para la recarga visual)
      const reloadPathArray = categoryNamesArray;
      
      // Le pasamos ambas rutas por separado al thunk
      await dispatch(startDeletingResourceComplete(targetId, row.storagePath, deletePathArray, reloadPathArray));
    }
  };

  return (
    <>
      <AddResourceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveOrEditResource}
        initialData={resourceToEdit} 
      />

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