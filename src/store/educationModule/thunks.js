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
    deleteFileFromStorage
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

export const startSavingCategory = ({title, description, imageUrl}, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await saveCategory({title, description, imageUrl}, categoryNamesArray);
        if ( !resp.ok ) return console.log(resp.errorMessage);
        console.log(`Categoría ${title} guardada exitosamente!`);
        // Recargamos las categorías para que aparezca la nueva inmediatamente
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

// Thunk para actualizar TODA la información de la categoría (título, desc, imagen)
export const startUpdatingCategoryInfo = (categoryTitle, updatedData, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await updateCategory(categoryTitle, updatedData, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Categoría ${categoryTitle} actualizada exitosamente!`);
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

// Thunk para eliminar la categoría
export const startDeletingCategoryFull = (categoryTitle, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await deleteCategory(categoryTitle, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Categoría eliminada exitosamente!`);
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

export const startSavingSlideShowItem = ({type, imageUrl, alt, title, content}) => {
    return async (dispatch) => {
        let newSlide = {};
        switch (type) {
            case slideTypes.imageSlide:
                newSlide =  { type, imageUrl, alt };
            break;
            case slideTypes.textSlide:
                newSlide =  { type, title, content };
            break;
            default:
                throw new Error({errorMessage:'Tried to save a non-existent slide type for SlideShow'});
        };
        const resp = await saveSlideshowItem(newSlide)
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log('Slide nuevo guardado existosamente!');
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
export const startDeletingResourceComplete = (resourceId, storagePath, categoryNamesArray = []) => {
    return async (dispatch) => {
        
        // 1. Borrado físico en Firebase Storage
        if (storagePath) {
            const deleteStorageResp = await deleteFileFromStorage(storagePath);
            if (!deleteStorageResp.ok) {
                console.error("No se pudo borrar el archivo físico:", deleteStorageResp.errorMessage);
                // Decisión arquitectónica: Continuamos con el borrado en BD aunque falle el físico
            }
        }

        // 2. Borrado lógico en Firestore
        const resp = await deleteResource(resourceId, categoryNamesArray);
        if (!resp.ok) return console.error("Error al borrar en Firestore:", resp.errorMessage);
        
        console.log(`Recurso eliminado completamente!`);

        // 3. SILENT RELOAD
        const refreshResp = await loadResources(categoryNamesArray);
        if (refreshResp.ok) {
            dispatch(setAllItems(refreshResp.resources));
            dispatch(determineAllFilteredItems());
            dispatch(calculateTotalPages());
            
            // Si al borrar vaciamos la página actual, retrocedemos una página por UX
            dispatch(loadCurrentPageItems()); 
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
export const startUploadingAndSavingResource = (file, resourceName, resourceFormat, categoryPathArray) => {
    return async (dispatch, getState) => {
        
        // 1. Subimos el archivo a Firebase Storage
        const folderPath = `resources/${categoryPathArray.join('/')}`;
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

        const saveResp = await saveResource(resourceData, categoryPathArray);

        if (!saveResp.ok) {
             console.error("Error al guardar en Firestore:", saveResp.errorMessage);
             return { ok: false, errorMessage: saveResp.errorMessage };
        }

        // 3. SILENT RELOAD: Volvemos a cargar los recursos de esta categoría 
        // Descomentado y usando la función loadResources importada arriba.
        const refreshResp = await loadResources(categoryPathArray);
        if (refreshResp.ok) {
            dispatch(setAllItems(refreshResp.resources));
            dispatch(determineAllFilteredItems());
            dispatch(calculateTotalPages());
            dispatch(loadCurrentPageItems());
        }

        return { ok: true };
    };
};