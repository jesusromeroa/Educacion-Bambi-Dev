import { slideTypes } from "../../educationModule/components";
// NUEVO: Agregamos deleteCategory a las importaciones de tu provider
import { loadCategories, loadResources, loadSlideShowItems, saveCategory, saveResource, saveSlideshowItem, deleteResource, updateResource, updateCategory, deleteCategory } from "../../firebase/educationModule/providers"
import { calculateTotalPages, categoriesLoadedSuccesfully, determineAllFilteredItems, loadCurrentPageItems, setAllItems, setCategoriesError, setCategoriesLoadingState, setLoadedCategories, setNewPage, setSlidesShowItems, setTableError } from "./educationModuleSlice";

export const startSavingCategory = ({title, description, imageUrl}, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await saveCategory({title, description, imageUrl}, categoryNamesArray);
        if ( !resp.ok ) return console.log(resp.errorMessage);
        console.log(`Categoría ${title} guardada exitosamente!`);
        // NUEVO: Recargamos las categorías para que aparezca la nueva inmediatamente
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

// NUEVO: Thunk para actualizar TODA la información de la categoría (título, desc, imagen)
export const startUpdatingCategoryInfo = (categoryTitle, updatedData, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await updateCategory(categoryTitle, updatedData, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Categoría ${categoryTitle} actualizada exitosamente!`);
        dispatch(startLoadingCategories(categoryNamesArray));
    }
}

// NUEVO: Thunk para eliminar la categoría
export const startDeletingCategoryFull = (categoryTitle, categoryNamesArray = []) => {
    return async (dispatch) => {
        // Asegúrate de tener la función deleteCategory creada en tus providers
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

export const startDeletingResource = (resourceId, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await deleteResource(resourceId, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Recurso eliminado exitosamente!`);
    }
}

export const startUpdatingResource = (resourceId, updatedData, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await updateResource(resourceId, updatedData, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Recurso actualizado exitosamente!`);
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
        const {currentPage} = getState().educationModule.tableSection;
        const resp = await loadResources(categoryNamesArray);
        if(!resp.ok) return setTableError(resp.errorMessage); 

        dispatch(setAllItems(resp.resources));
        dispatch(determineAllFilteredItems());
        dispatch(calculateTotalPages());
        dispatch(loadCurrentPageItems());
    }
}

// NUEVO: Thunk para reorganizar (Actualiza silenciosamente a todas)
export const startReorderingCategories = (reorderedArray, categoryNamesArray = []) => {
    return async (dispatch) => {
        // 1. Guardamos el nuevo orden de TODAS las tarjetas en paralelo (es súper rápido)
        await Promise.all(
            reorderedArray.map(cat => updateCategory(cat.title, { index: cat.index }, categoryNamesArray))
        );

        // 2. RECARGA SILENCIOSA: Traemos los datos frescos de Firebase 
        // ¡PERO NO disparamos el loading state! Así evitamos que la pantalla salte a la tabla.
        const resp = await loadCategories(categoryNamesArray);
        if (resp.ok) {
            dispatch(setLoadedCategories(resp.categories));
        }
    }
}