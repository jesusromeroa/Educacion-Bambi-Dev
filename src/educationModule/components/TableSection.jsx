import React, { useState } from 'react'
import '../educationStyles/educationStyles.css'
import { SearchBar } from '../components/SearchBar'
import { ContentsTable } from '../components/ContentsTable'
import { TableNavigator } from '../components/TableNavigator'
import { useTable } from '../hooks/useTable'
import { useSelector, useDispatch } from 'react-redux'
import { CircularLoader } from './CircularLoader'
import { useLocation } from 'react-router'
import { convertPathToArray } from '../../helpers'

import { AddResourceModal } from '../components/AddResourceModal'
import { startUploadingAndSavingResource } from '../../store/educationModule/thunks'

export const TableSection = ({title = ''}) => {

    const {tableSection} = useSelector(store => store.educationModule);
    const { status } = useSelector(state => state.auth);
    const isAdmin = status === 'authenticated';
    const dispatch = useDispatch(); 
    const location = useLocation();
    let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
    pathCategories.shift();
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        searchParam,
        allFilteredItems,
        allItems,
        totalPages,
        currentPage,
        pageItems,
        isLoading,
        hasError,
        error
    } = tableSection;

    const {handleSetSearchParam, handleSetNewPage} = useTable(pathCategories);

    const handleSaveResource = async (formData) => {
        // CORRECCIÓN A: Convertimos el arreglo dinámico de nombres seleccionados a formato con guiones para Firebase
        const savePathArray = formData.selectedPath.map(segment => segment.trim().replace(/ /g, '-'));

        // CORRECCIÓN B: Almacenamos la URL en la que estamos parados para que el Silent Reload actualice la vista exacta
        const reloadPathArray = pathCategories; 

        await dispatch(
            startUploadingAndSavingResource(
                formData.file,         
                formData.title,        
                formData.format,       
                savePathArray,         // Destino de guardado físico en la BD
                reloadPathArray        // Destino visual para refrescar la tabla
            )
        );
        setIsModalOpen(false); 
    };

    return (
        <>
            <div style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#2e7d32",
                }}>
    
                <h1 className='section-title' style={{ color: "var(--white)", marginBottom: "60px"}}>
                    {title}
                </h1>

                {
                    (isLoading) ?
                    ( 
                        <div style={{ marginLeft: '8%', marginRight: '8%', marginTop: '100px', marginBottom: '200px', display: 'flex', justifyContent: 'center'}}>
                            <CircularLoader/>
                        </div>
                    )
                    :
                    (
                        <>
                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div style={{ flexGrow: 1, marginRight: '20px' }}>
                                    <SearchBar onUpdateSearchParam={handleSetSearchParam}/>
                                </div>

                                {isAdmin && (
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        style={{
                                            padding: '12px 24px',
                                            backgroundColor: '#f57c00', 
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '16px'
                                        }}
                                    >
                                        + Agregar Recurso
                                    </button>
                                )}
                            </div>

                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px', fontWeight: 'bold'}}>
                                Búsqueda: <span style={{textDecorationLine: "underline", paddingLeft: '4px', paddingRight: '4px'}}>{searchParam}</span> | {allFilteredItems.length} items
                            </div>
                
                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px'}}>
                                <ContentsTable 
                                    pageItems={pageItems}
                                    format={{tableFormat:['Nombre', 'Categoría', 'Subcategoría', 'Formato'], 
                                            dataFormat: ['name', 'category', 'subcategory', 'format']}}
                                    categoryNamesArray={pathCategories} 
                                    />
                            </div>
                
                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '90px', display: 'flex', justifyContent: 'center'}}>
                                <TableNavigator 
                                    totalPages={totalPages} 
                                    currentPage={currentPage} 
                                    onSetNewPage={handleSetNewPage}
                                    />
                            </div> 
                        </>
                    )
                }
                
            </div>

            {/* CORRECCIÓN C: Inyectamos el path actual de la URL para que el modal se auto-configure al abrirse */}
            <AddResourceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveResource} 
                initialData={null} 
                currentPath={pathCategories} 
            />
        </>
    )
}