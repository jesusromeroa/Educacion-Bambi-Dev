import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startSavingNewResource, startLoadingResources } from '../../store/educationModule/thunks';
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
  const dispatch = useDispatch();

  const handleSaveNewResource = async (newResourceData) => {
    
    // 1. LA MAGIA: Tomamos la categoría que el usuario eligió en el Modal
    // La envolvemos en un arreglo porque así lo requiere Firebase
    const exactFirebasePath = [newResourceData.category]; 

    // 2. Guardamos enviando esa ruta exacta
    await dispatch(startSavingNewResource({
      name: newResourceData.title, 
      format: newResourceData.format,
      url: newResourceData.url
    }, exactFirebasePath));

    // 3. Recargamos la tabla (Nota: recargamos la categoría en la que estamos viendo la tabla)
    // Si estás viendo Dirección Sociolegal, quieres ver que el archivo apareció ahí.
    const pathParaRecargar = categoryNamesArray.length > 0 ? categoryNamesArray : exactFirebasePath;
    dispatch(startLoadingResources(pathParaRecargar));
  };

  return (
    <>
      <AddResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveNewResource}
      />

      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
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
              return (<tr key={ index }>
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
                              <button style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem', marginRight: '10px' }} title="Editar">✏️</button>
                              <button style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }} title="Eliminar">🗑️</button>
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