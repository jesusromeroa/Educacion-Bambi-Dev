import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, deleteDoc, updateDoc } from "firebase/firestore/lite"
import { firebaseDB } from "../../firebase/config"
import { convertToHyphenatedFormat } from "../../helpers/convertToHyphenatedFormat";
import { convertToSpacedFormat, insertBetweenElements } from "../../helpers";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { FirebaseStorage } from "../config";

export const saveCategory = async (categoryData, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
            firestoreRoute.push('subcategories');
        }
        const collectionRef = collection(firebaseDB, 'categories', ...firestoreRoute);
        // Guardamos el objeto completo
        await setDoc(doc(collectionRef, convertToHyphenatedFormat(categoryData.title)), categoryData);
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

// ========================================================
// NUEVAS FUNCIONES PARA EDITAR Y ELIMINAR SLIDESHOW
// ========================================================
export const updateSlideshowItem = async (slideUid, updatedData) => {
    try {
        const docRef = doc(firebaseDB, 'slideShowItems', slideUid);
        await updateDoc(docRef, updatedData);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

export const deleteSlideshowItem = async (slideUid) => {
    try {
        const docRef = doc(firebaseDB, 'slideShowItems', slideUid);
        await deleteDoc(docRef);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

// ========================================================
// CORRECCIÓN CRÍTICA: Eliminado el destructuring
// Recibe "resourceData" entero para no perder el storagePath
// ========================================================
export const saveResource = async (resourceData, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
        }
        const collectionRef = collection(firebaseDB, 'categories', ...firestoreRoute, 'resources');
        
        // Pasamos resourceData tal cual, preservando la url y el storagePath
        const docRef =  await addDoc(collectionRef, resourceData);
        
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
    try {
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
        });

        if (categories.length === 0 ) return { ok: false, errorMessage: 'No se encontró ninguna categoria' }
        
        // ==========================================
        // NUEVO: Ordenamos las tarjetas por su campo 'index'
        // ==========================================
        categories.sort((a, b) => {
            const indexA = a.index !== undefined ? a.index : 999; // 999 manda las nuevas al final
            const indexB = b.index !== undefined ? b.index : 999;
            return indexA - indexB;
        });

        return { ok: true, categories }
    } catch(error) {
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

// ========================================================
// NUEVA FUNCION: Actualizar Imagen de Categoría (Super Admin)
// ========================================================
export const updateCategory = async (categoryTitle, updatedData, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
            firestoreRoute.push('subcategories');
        }
        const docRef = doc(firebaseDB, 'categories', ...firestoreRoute, convertToHyphenatedFormat(categoryTitle));
        await updateDoc(docRef, updatedData);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

// ========================================================
// NUEVA FUNCION: Eliminar Categoría (Super Admin)
// ========================================================
export const deleteCategory = async (categoryTitle, categoryNamesArray = []) => {
    try {
        let firestoreRoute = [];
        if (categoryNamesArray.length !== 0){
            firestoreRoute = insertBetweenElements(categoryNamesArray, 'subcategories');
            firestoreRoute.push('subcategories');
        }
        const docRef = doc(firebaseDB, 'categories', ...firestoreRoute, convertToHyphenatedFormat(categoryTitle));
        await deleteDoc(docRef);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

// ========================================================
// NUEVO: PANEL DE ADMINISTRADOR (LISTA BLANCA DE PROFESORES)
// ========================================================
export const loadWhitelistedUsers = async () => {
    try {
        const collectionRef = collection(firebaseDB, 'userRoles');
        const querySnapshot = await getDocs(collectionRef);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ email: doc.id, ...doc.data() });
        });
        return { ok: true, users };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

export const addWhitelistedUser = async (email, role = 'profesor') => {
    try {
        const safeEmail = email.toLowerCase().trim();
        const docRef = doc(firebaseDB, 'userRoles', safeEmail);
        await setDoc(docRef, { role, createdAt: new Date().getTime() });
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

export const removeWhitelistedUser = async (email) => {
    try {
        const docRef = doc(firebaseDB, 'userRoles', email.toLowerCase().trim());
        await deleteDoc(docRef);
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

// ========================================================
// NUEVO: VERIFICAR SI UN CORREO ESTÁ EN LA LISTA BLANCA
// ========================================================
export const checkIsEmailWhitelisted = async (email) => {
    try {
        const docRef = doc(firebaseDB, 'userRoles', email.toLowerCase().trim());
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { ok: true, role: docSnap.data().role };
        } else {
            return { ok: false, errorMessage: 'Tu correo no está autorizado. Contacta a la administración.' };
        }
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}

/**
 * Sube un archivo a Firebase Storage y devuelve su URL pública.
 */
export const uploadFileToStorage = async (file, folderPath) => {
    try {
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${new Date().getTime()}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
        const storageRef = ref(FirebaseStorage, `${folderPath}/${uniqueFileName}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(uploadResult.ref);

        return { 
            ok: true, 
            url: downloadUrl, 
            fullPath: storageRef.fullPath 
        };
    } catch (error) {
        console.error("Error subiendo archivo:", error);
        return { ok: false, errorMessage: error.message };
    }
};

/**
 * Elimina un archivo físico de Firebase Storage usando su ruta completa.
 */
export const deleteFileFromStorage = async (fullPath) => {
    try {
        const storageRef = ref(FirebaseStorage, fullPath);
        await deleteObject(storageRef);
        return { ok: true };
    } catch (error) {
        console.error("Error eliminando archivo:", error);
        return { ok: false, errorMessage: error.message };
    }
};

// ========================================================
// NUEVO: GUARDAR MENSAJE DE CONTACTO (LANDING PAGE)
// ========================================================
export const saveContactMessage = async (messageData) => {
    try {
        const collectionRef = collection(firebaseDB, 'contactMessages');
        // Agregamos un timestamp para saber exactamente cuándo enviaron el mensaje
        await addDoc(collectionRef, { ...messageData, createdAt: new Date().getTime() });
        return { ok: true };
    } catch (error) {
        return { ok: false, errorMessage: error.message };
    }
}