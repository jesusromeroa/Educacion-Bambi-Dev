import { slideTypes } from "../../educationModule/components";
// IMPORTANTE: Se agregaron updateResource y deleteResource
import { loadCategories, loadResources, loadSlideShowItems, saveCategory, saveResource, saveSlideshowItem, deleteResource, updateResource } from "../../firebase/educationModule/providers"
import { calculateTotalPages, categoriesLoadedSuccesfully, determineAllFilteredItems, loadCurrentPageItems, setAllItems, setCategoriesError, setCategoriesLoadingState, setLoadedCategories, setNewPage, setSlidesShowItems, setTableError } from "./educationModuleSlice";

export const startSavingCategory = ({title, description, imageUrl}, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await saveCategory({title, description, imageUrl}, categoryNamesArray);
        if ( !resp.ok ) return console.log(resp.errorMessage);
        console.log(`Categoría ${title} guardada exitosamente!`);
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

// === NUEVO: Lógica para Eliminar Recurso ===
export const startDeletingResource = (resourceId, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await deleteResource(resourceId, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Recurso eliminado exitosamente!`);
    }
}

// === NUEVO: Lógica para Actualizar Recurso ===
export const startUpdatingResource = (resourceId, updatedData, categoryNamesArray = []) => {
    return async (dispatch) => {
        const resp = await updateResource(resourceId, updatedData, categoryNamesArray);
        if (!resp.ok) return console.log(resp.errorMessage);
        console.log(`Recurso actualizado exitosamente!`);
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