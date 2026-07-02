import { slideTypes } from "../../educationModule/components";
import { 
    loadCategories, 
    loadResources, 
    loadSlideShowItems, 
    saveCategory, 
    saveResource, 
    saveSlideshowItem, 
    deleteResource, 
    updateResource, 
    updateCategory, 
    deleteCategory,
    uploadFileToStorage, // <-- Unificado aquí
    deleteFileFromStorage,
    updateSlideshowItem,   
    deleteSlideshowItem,
} from "../../firebase/educationModule/providers";
import { 
    calculateTotalPages, 
    categoriesLoadedSuccesfully, 
    determineAllFilteredItems, 
    loadCurrentPageItems, 
    setAllItems, 
    setCategoriesError, 
    setCategoriesLoadingState, 
    setLoadedCategories, 
    setNewPage, 
    setSlidesShowItems, 
    setTableError 
} from "./educationModuleSlice";

/**
 * Crea una Categoría y sube su imagen a Storage
 */
export const startSavingCategoryComplete = (formData, imageFile, categoryNamesArray = []) => {
    return async (dispatch) => {
        let categoryData = { ...formData };
        
        if (imageFile) {
            const folderPath = `categoryImages`; 
            const uploadResp = await uploadFileToStorage(imageFile, folderPath);
            if (!uploadResp.ok) return console.error("Error subiendo imagen:", uploadResp.errorMessage);
            
            categoryData.imageUrl = uploadResp.url;
            categoryData.storagePath = uploadResp.fullPath; // Clave para poder borrarla luego
        }

        const resp = await saveCategory(categoryData, categoryNamesArray);
        if ( !resp.ok ) return console.log(resp.errorMessage);
        console.log(`Categoría ${categoryData.title} guardada exitosamente!`);
        
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

/**
 * Actualiza la Categoría. Si hay imagen nueva, borra la vieja de Storage.
 */
export const startUpdatingCategoryInfoComplete = (categoryTitle, formData, imageFile, existingData, categoryNamesArray = []) => {
    return async (dispatch) => {
        let updatedData = {
            title: formData.title,
            description: formData.description
        };

        if (imageFile) {
            const folderPath = `categoryImages`;
            const uploadResp = await uploadFileToStorage(imageFile, folderPath);
            if (!uploadResp.ok) return console.error("Error subiendo nueva imagen:", uploadResp.errorMessage);
            
            updatedData.imageUrl = uploadResp.url;
            updatedData.storagePath = uploadResp.fullPath;

            // Limpieza: Borramos la imagen vieja SOLO si existe en nuestro Storage
            if (existingData.storagePath) {
                await deleteFileFromStorage(existingData.storagePath);
            }
        }

        const resp = await updateCategory(categoryTitle, updatedData, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        
        console.log(`Categoría ${categoryTitle} actualizada!`);
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

/**
 * Elimina la Categoría, sus subcategorías y TODOS sus recursos físicos.
 */
export const startDeletingCategoryFullComplete = (categoryTitle, storagePath, categoryNamesArray = []) => {
    return async (dispatch) => {
        
        // El borrado recursivo en providers se encarga de TODO el trabajo sucio
        const resp = await deleteCategory(categoryTitle, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        
        console.log(`¡Categoría y todo su contenido eliminados sin dejar rastro!`);
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

// ========================================================
// THUNKS PARA ADMINISTRAR LA PORTADA (SLIDESHOW)
// ========================================================

export const startSavingSlideShowItemComplete = (formData, imageFile) => {
    return async (dispatch) => {
        let newSlide = { type: slideTypes.imageSlide, alt: formData.alt || 'Hogar Bambi Slide' };
        
        // 1. Subimos la imagen del slide a Storage
        if (imageFile) {
            const folderPath = `slideshowImages`; 
            const uploadResp = await uploadFileToStorage(imageFile, folderPath);
            if (!uploadResp.ok) return console.error("Error subiendo imagen del slide:", uploadResp.errorMessage);
            
            newSlide.imageUrl = uploadResp.url;
            newSlide.storagePath = uploadResp.fullPath;
        }

        // 2. Guardamos en Firestore
        const resp = await saveSlideshowItem(newSlide);
        if (!resp.ok) return console.error(resp.errorMessage);
        
        console.log('Slide nuevo guardado existosamente!');
        
        // 3. SILENT RELOAD
        dispatch(startLoadingSlideShowItems());
    }
}

export const startUpdatingSlideShowItemComplete = (slideUid, formData, imageFile, existingData) => {
    return async (dispatch) => {
        let updatedData = { alt: formData.alt || 'Hogar Bambi Slide' };

        if (imageFile) {
            const folderPath = `slideshowImages`;
            const uploadResp = await uploadFileToStorage(imageFile, folderPath);
            if (!uploadResp.ok) return console.error("Error subiendo nueva imagen de slide:", uploadResp.errorMessage);
            
            updatedData.imageUrl = uploadResp.url;
            updatedData.storagePath = uploadResp.fullPath;

            // Borramos la imagen vieja del Storage
            if (existingData.storagePath) {
                await deleteFileFromStorage(existingData.storagePath);
            }
        }

        const resp = await updateSlideshowItem(slideUid, updatedData);
        if (!resp.ok) return console.error(resp.errorMessage);
        
        console.log(`Slide actualizado exitosamente!`);
        dispatch(startLoadingSlideShowItems());
    }
}

export const startDeletingSlideShowItemComplete = (slideUid, storagePath) => {
    return async (dispatch) => {
        // 1. Borrado físico
        if (storagePath) {
            await deleteFileFromStorage(storagePath);
        }
        
        // 2. Borrado lógico
        const resp = await deleteSlideshowItem(slideUid);
        if (!resp.ok) return console.error("Error borrando slide:", resp.errorMessage);
        
        console.log(`Slide eliminado completamente!`);
        dispatch(startLoadingSlideShowItems());
    }
}

export const startSavingNewResource = ({ name, format, url }, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await saveResource({ name, format, url }, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Recurso ${name} guardado exitosamente!`)
    }
}


/**
 * Elimina el registro de Firestore y destruye el archivo físico en Storage
 * para evitar archivos huérfanos.
 */
export const startDeletingResourceComplete = (resourceId, storagePath, deletePathArray = [], reloadPathArray = []) => {
    return async (dispatch, getState) => {
        
        // 1. Borrado físico en Firebase Storage
        if (storagePath) {
            const deleteStorageResp = await deleteFileFromStorage(storagePath);
            if (!deleteStorageResp.ok) {
                console.error("No se pudo borrar el archivo físico:", deleteStorageResp.errorMessage);
            }
        }

        // 2. Borrado lógico en Firestore (Usamos deletePathArray)
        const resp = await deleteResource(resourceId, deletePathArray);
        if (!resp.ok) return console.error("Error al borrar en Firestore:", resp.errorMessage);
        
        console.log(`Recurso eliminado completamente!`);

        // 3. SILENT RELOAD (Usamos reloadPathArray)
        const refreshResp = await loadResources(reloadPathArray);
        if (refreshResp.ok) {
            dispatch(setAllItems(refreshResp.resources));
            dispatch(determineAllFilteredItems());
            dispatch(calculateTotalPages());
            
            // 4. SOLUCIÓN A LA PÁGINA FANTASMA: Verificamos si nos salimos del límite
            const { currentPage, totalPages } = getState().educationModule.tableSection;

            // Si estábamos en la pág 2, y el total bajó a 1, retrocedemos automáticamente
            if (currentPage > totalPages && totalPages > 0) {
                dispatch(setNewPage(totalPages));
            } else if (totalPages === 0) {
                // Si borramos absolutamente todo, nos aseguramos de resetear a 1
                dispatch(setNewPage(1)); 
            } else {
                // Si todo está normal, solo refrescamos la página actual
                dispatch(loadCurrentPageItems()); 
            }
        }
    }
}

/**
 * Actualiza un recurso. Si se proporciona un nuevo archivo, lo sube a Storage
 * y reemplaza el anterior. Luego actualiza Firestore de forma segura.
 */
export const startUpdatingResourceComplete = (resourceId, formData, existingData, categoryNamesArray = []) => {
    return async (dispatch) => {
        
        // 1. Preparamos los datos de texto que siempre se actualizan
        let updatedData = {
            name: formData.title,
            format: formData.format
        };

        // 2. Si el usuario seleccionó un archivo nuevo en el modal de edición
        if (formData.file) {
            const folderPath = `resources/${categoryNamesArray.join('/')}`;
            const uploadResp = await uploadFileToStorage(formData.file, folderPath);
            
            if (!uploadResp.ok) {
                return console.error("Error al subir nuevo archivo:", uploadResp.errorMessage);
            }

            // Agregamos la nueva URL y el nuevo Path al objeto de actualización
            updatedData.url = uploadResp.url;
            updatedData.storagePath = uploadResp.fullPath;

            // Limpieza: Borramos el archivo físico viejo de Storage para no consumir espacio basura
            if (existingData.storagePath) {
                await deleteFileFromStorage(existingData.storagePath);
            }
        }

        // 3. Actualizamos en Firestore (ahora sin campos undefined)
        const resp = await updateResource(resourceId, updatedData, categoryNamesArray);
        if (!resp.ok) return console.error("Error en Firestore:", resp.errorMessage);

        console.log(`Recurso actualizado exitosamente!`);

        // 4. SILENT RELOAD
        const refreshResp = await loadResources(categoryNamesArray);
        if (refreshResp.ok) {
            dispatch(setAllItems(refreshResp.resources));
            dispatch(determineAllFilteredItems());
            dispatch(calculateTotalPages());
            dispatch(loadCurrentPageItems());
        }
    }
}

export const startUpdatingCategoryImage = (categoryTitle, newImageUrl, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await updateCategory(categoryTitle, { imageUrl: newImageUrl }, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`¡Imagen de ${categoryTitle} actualizada exitosamente!`);
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

export const startLoadingSlideShowItems = () => {
    return async (dispatch) => {
        const resp = await loadSlideShowItems();
        if(!resp.ok) return console.log(resp.errorMessage);
        dispatch(setSlidesShowItems(resp.slides));
    }
}

export const startLoadingCategories = (categoryNamesArray = []) => {
    return async (dispatch) => {
        dispatch(setCategoriesLoadingState());
        dispatch(setLoadedCategories([]));

        const resp = await loadCategories(categoryNamesArray);
        if(!resp.ok) return dispatch(setCategoriesError(resp.errorMessage));

        dispatch(setLoadedCategories(resp.categories))
        dispatch(categoriesLoadedSuccesfully());
    }
}

export const startLoadingResources = (categoryNamesArray = []) => {
    return async (dispatch, getState) => {
        // const {currentPage} = getState().educationModule.tableSection; // Se omitió si no se usa estrictamente
        const resp = await loadResources(categoryNamesArray);
        if(!resp.ok) return setTableError(resp.errorMessage); 

        dispatch(setAllItems(resp.resources));
        dispatch(determineAllFilteredItems());
        dispatch(calculateTotalPages());
        dispatch(loadCurrentPageItems());
    }
}

// Thunk para reorganizar (Actualiza silenciosamente a todas)
export const startReorderingCategories = (reorderedArray, categoryNamesArray = []) => {
    return async (dispatch) => {
        // 1. Guardamos el nuevo orden de TODAS las tarjetas en paralelo
        await Promise.all(
            reorderedArray.map(cat => updateCategory(cat.title, { index: cat.index }, categoryNamesArray))
        );

        // 2. RECARGA SILENCIOSA: Traemos los datos frescos de Firebase 
        const resp = await loadCategories(categoryNamesArray);
        if (resp.ok) {
            dispatch(setLoadedCategories(resp.categories));
        }
    }
}

/**
 * Orquesta la subida del archivo físico y el guardado de sus datos en Firestore.
 * Respeta el patrón "Silent Reload" recargando la tabla sin pantallas de carga globales.
 */
export const startUploadingAndSavingResource = (file, resourceName, resourceFormat, savePathArray, reloadPathArray = []) => {
    return async (dispatch, getState) => {
        
        // 1. Subimos el archivo a Firebase Storage usando la ruta de guardado
        const folderPath = `resources/${savePathArray.join('/')}`;
        const uploadResp = await uploadFileToStorage(file, folderPath);

        if (!uploadResp.ok) {
            console.error("Error al subir archivo a Storage:", uploadResp.errorMessage);
            return { ok: false, errorMessage: uploadResp.errorMessage };
        }

        // 2. Guardamos la referencia en Firestore
        const resourceData = {
            name: resourceName,
            format: resourceFormat,
            url: uploadResp.url,
            storagePath: uploadResp.fullPath 
        };

        const saveResp = await saveResource(resourceData, savePathArray);

        if (!saveResp.ok) {
             console.error("Error al guardar en Firestore:", saveResp.errorMessage);
             return { ok: false, errorMessage: saveResp.errorMessage };
        }

        // 3. SILENT RELOAD: Recargamos usando la ruta en la que el usuario está parado
        const refreshResp = await loadResources(reloadPathArray);
        if (refreshResp.ok) {
            dispatch(setAllItems(refreshResp.resources));
            dispatch(determineAllFilteredItems());
            dispatch(calculateTotalPages());
            dispatch(loadCurrentPageItems());
        }

        return { ok: true };
    };
};