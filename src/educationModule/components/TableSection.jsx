import React from 'react'
import '../educationStyles/educationStyles.css'
import { SearchBar } from '../components/SearchBar'
import { ContentsTable } from '../components/ContentsTable'
import { TableNavigator } from '../components/TableNavigator'
import { useTable } from '../hooks/useTable'
import { useSelector } from 'react-redux'
import { CircularLoader } from './CircularLoader'
import { useLocation } from 'react-router'
import { convertPathToArray } from '../../helpers'

export const TableSection = ({title = ''}) => {

    const {tableSection} = useSelector(store => store.educationModule);
    const location = useLocation();
    let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
    pathCategories.shift();
    
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

    return (
        <>
            <div style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--lightGreen)",
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

                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px'}}>
                                <SearchBar onUpdateSearchParam={handleSetSearchParam}/>
                            </div>

                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px', fontWeight: 'bold'}}>
                                Búsqueda: <span style={{textDecorationLine: "underline", paddingLeft: '4px', paddingRight: '4px'}}>{searchParam}</span> | {allFilteredItems.length} items
                            </div>
                
                            <div style={{ marginLeft: '8%', marginRight: '8%', marginBottom: '20px'}}>
                                <ContentsTable 
                                    pageItems={pageItems}
                                    format={{tableFormat:['Nombre', 'Categoría', 'Subcategoría', 'Formato'], 
                                            dataFormat: ['name', 'category', 'subcategory', 'format']}}
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
        </>
    )
}
