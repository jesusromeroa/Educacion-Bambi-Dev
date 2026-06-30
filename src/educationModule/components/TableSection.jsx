import React, { useState } from 'react'
import '../educationStyles/educationStyles.css'
import { SearchBar } from '../components/SearchBar'
import { ContentsTable } from '../components/ContentsTable'
import { TableNavigator } from '../components/TableNavigator'
import { useTable } from '../hooks/useTable'
import { useSelector, useDispatch } from 'react-redux' // Importamos useDispatch
import { CircularLoader } from './CircularLoader'
import { useLocation } from 'react-router'
import { convertPathToArray } from '../../helpers'

// 1. Nuevas Importaciones para el Modal y el Thunk
import { AddResourceModal } from '../components/AddResourceModal'
import { startUploadingAndSavingResource } from '../../store/educationModule/thunks'

export const TableSection = ({title = ''}) => {

    const {tableSection} = useSelector(store => store.educationModule);
    const { status } = useSelector(state => state.auth);
    const isAdmin = status === 'authenticated';
    const dispatch = useDispatch(); // Inicializamos el dispatch
    const location = useLocation();
    let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
    pathCategories.shift();
    
    // 2. Estado local para controlar si el modal está abierto o cerrado
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

   // 3. Función que se dispara cuando el modal nos devuelve los datos listos
    const handleSaveResource = async (formData) => {
        
        // Creamos el arreglo con la categoría que el usuario seleccionó en el Modal
        const categoryPathArray = [formData.category]; 

        await dispatch(
            startUploadingAndSavingResource(
                formData.file,         // El archivo físico
                formData.title,        // El nombre
                formData.format,       // El formato (pdf, video, etc.)
                categoryPathArray      // ¡AQUÍ PASAMOS EL ARREGLO CORRECTO!
            )
        );
        setIsModalOpen(false); // Cerramos el modal al terminar
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
                            {/* 4. Modificamos este div para poner la barra de búsqueda y el botón en la misma línea */}
                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div style={{ flexGrow: 1, marginRight: '20px' }}>
                                    <SearchBar onUpdateSearchParam={handleSetSearchParam}/>
                                </div>

                                {/* BOTÓN DE AGREGAR RECURSO */}
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

            {/* 5. Insertamos el Modal fuera del flujo de la tabla para que se sobreponga correctamente */}
            <AddResourceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveResource} 
                initialData={null} // Es null porque estamos creando, no editando
            />
        </>
    )
}