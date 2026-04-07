import { addDoc, collection, doc, getDocs, limit, orderBy, query, setDoc, deleteDoc, updateDoc } from "firebase/firestore/lite"
import { firebaseDB } from "../../firebase/config"
import { convertToHyphenatedFormat } from "../../helpers/convertToHyphenatedFormat";
import { convertToSpacedFormat, insertBetweenElements } from "../../helpers";

//ESTA FUNCION NI SIQUIERA PERTENECE AL MODULO DE EDUCACION
export const saveCategory = async ({title, description, imageUrl}, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
            firestoreRoute.push('subcategories');
        }
        const collectionRef = collection(firebaseDB, 'categories', ...firestoreRoute);
        await setDoc(doc(collectionRef, convertToHyphenatedFormat(title)), { title, description, imageUrl });
        return { ok: true }
    } catch (error) {
        return { ok: false, errorMessage: error.message }
    }
}

//ESTA FUNCION NI SIQUIERA PERTENECE AL MODULO DE EDUCACION
export const saveSlideshowItem = async (newSlide) => {
    try{
        const collectionRef = collection(firebaseDB, 'slideShowItems');
        const q = query(collectionRef, orderBy("index", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        let newSlideIndex = 0;

        if (!querySnapshot.empty){
            console.log(querySnapshot.docs[0].data().index)
            newSlideIndex = querySnapshot.docs[0].data().index + 1;
        }
        
        newSlide = {...newSlide, index: newSlideIndex};
        const docRef = await addDoc(collectionRef, newSlide);
        const newSlideUid = docRef.id;

        return { ok: true, newSlideUid }
    }catch(error){
        return { ok: false, errorMessage: error.message }
    }
}

//ESTA FUNCION NI SIQUIERA PERTENECE AL MODULO DE EDUCACION
export const saveResource = async ({ name, format, url }, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
        }
        const collectionRef = collection(firebaseDB, 'categories', ...firestoreRoute, 'resources');
        const docRef =  await addDoc(collectionRef, { name, format, url});
        const resourceUid = docRef.id;
        return { ok: true, resourceUid }
    } catch (error) {
        return { ok: false, errorMessage: error.message }
    }
}

// ========================================================
// NUEVAS FUNCIONES PARA ELIMINAR Y ACTUALIZAR (ENTREGABLE 2)
// ========================================================
export const deleteResource = async (resourceUid, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
        }
        const docRef = doc(firebaseDB, 'categories', ...firestoreRoute, 'resources', resourceUid);
        await deleteDoc(docRef);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

export const updateResource = async (resourceUid, updatedData, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
        }
        const docRef = doc(firebaseDB, 'categories', ...firestoreRoute, 'resources', resourceUid);
        await updateDoc(docRef, updatedData);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}
// ========================================================

export const loadCategories = async (categoryNamesArray = []) => {
    try{
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
            firestoreRoute.push('subcategories');
        }
        const collectionRef = collection(firebaseDB, 'categories', ...firestoreRoute);
        const querySnapshot = await getDocs(collectionRef);
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({uid: doc.id, ...doc.data()});
        })

        if (categories.length === 0 ) return { ok: false, errorMessage: 'No se encontró ninguna categoria' }
        return { ok: true, categories }
    }catch(error){
        return { ok: false, errorMessage: error.message }
    }
}

export const loadSlideShowItems = async () => {
    try{
        const collectionRef = collection(firebaseDB, 'slideShowItems');
        const querySnapshot = await getDocs(collectionRef);
        const slides = [];
        querySnapshot.forEach((doc) => {
            slides.push({uid: doc.id, ...doc.data()});
        });
        slides.sort((a, b) => a.index - b.index);
        return { ok: true, slides }
    }catch(error){
        return { ok: false, errorMessage: error.message }
    }
}

export const loadResources = async (categoryNamesArray = []) => {
    try {
        let resources = [];
        let resourcesNext = [];

        if (categoryNamesArray.length !== 0) {
            const firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
            const collectionRefSubcategories = collection(firebaseDB, 'categories', ...firestoreRoute, 'subcategories');
            const collectionRefResources = collection(firebaseDB, 'categories', ...firestoreRoute, 'resources');

            const subcategoriesRef = await getDocs(collectionRefSubcategories);
            const resourcesRef = await getDocs(collectionRefResources);

            if (categoryNamesArray.length-1 <= 0){
                resourcesRef.forEach((resourceDoc) => {
                    resources.push({ uid: resourceDoc.id, ...resourceDoc.data(), category: convertToSpacedFormat(categoryNamesArray[0]) });
                });
            }else{
                resourcesRef.forEach((resourceDoc) => {
                    resources.push({ uid: resourceDoc.id, ...resourceDoc.data(), category: convertToSpacedFormat(categoryNamesArray[0]), subcategory: categoryNamesArray[categoryNamesArray.length-1] });
                });
            }

            for (const subcategoryDoc of subcategoriesRef.docs) {
                const nextCategoryNamesArray = [...categoryNamesArray];
                nextCategoryNamesArray.push(subcategoryDoc.id);
                let resp = await loadResources(nextCategoryNamesArray);
                if (resp.ok) {
                    resourcesNext = [...resourcesNext, ...resp.resources];
                } else {
                    return { ok: false, errorMessage: resp.errorMessage };
                }
            }
        } else {
            const categoriesSnapshot = await getDocs(collection(firebaseDB, 'categories'));
            for (const categoryDoc of categoriesSnapshot.docs) {
                const nextCategoryNamesArray = [categoryDoc.id];
                let resp = await loadResources(nextCategoryNamesArray);
                if (resp.ok) {
                    resourcesNext = [...resourcesNext, ...resp.resources];
                }
            }
        }
        return { ok: true, resources: [...resources, ...resourcesNext] };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
};