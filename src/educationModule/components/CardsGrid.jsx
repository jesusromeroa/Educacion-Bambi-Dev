import React, { useState } from 'react'
import './styles/cardsGrid.css'
import { CardElement } from './CardElement'
import { useSelector, useDispatch } from 'react-redux'
import { CircularLoader } from './CircularLoader'

// IMPORTACIONES NUEVAS
import { CategoryModal } from './CategoryModal'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLocation } from 'react-router-dom';
import { convertPathToArray } from '../../helpers';
import { startSavingCategory, startUpdatingCategoryInfo, startDeletingCategoryFull, startReorderingCategories } from '../../store/educationModule/thunks';
export const CardsGrid = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const { loadedCategories, isLoading } = useSelector(store => store.educationModule.categories);
  
  // Validación de Super Admin
  const { status, email } = useSelector(state => state.auth);
  const superAdmins = ['admin@admin.com']; 
  const isSuperAdmin = status === 'authenticated' && email && superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  // Obtener la ruta actual (para saber en qué nivel estamos guardando)
  const getCategoryNamesArray = () => {
    let pathCategories = convertPathToArray(decodeURIComponent(location.pathname));
    pathCategories.shift(); 
    return pathCategories;
  }

  // Controles del Modal
  const handleOpenNewCategory = () => {
      setCategoryToEdit(null);
      setIsModalOpen(true);
  };

  const handleOpenEditCategory = (catData) => {
      setCategoryToEdit(catData);
      setIsModalOpen(true);
  };

  const handleSaveModal = async (formData) => {
      const pathArray = getCategoryNamesArray();
      if (categoryToEdit) {
          // Si estamos editando
          await dispatch(startUpdatingCategoryInfo(categoryToEdit.title, formData, pathArray));
      } else {
          // Si estamos creando una nueva
          await dispatch(startSavingCategory(formData, pathArray));
      }
      setIsModalOpen(false);
  };

  const handleDeleteModal = async (title) => {
      const pathArray = getCategoryNamesArray();
      await dispatch(startDeletingCategoryFull(title, pathArray));
      setIsModalOpen(false);
  };

  const handleMoveCategory = async (index, direction) => {
      // 1. Hacemos una copia exacta del arreglo visual actual
      let newOrder = [...loadedCategories];

      // 2. Calculamos con quién se va a intercambiar
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      // 3. Intercambiamos de lugar las dos tarjetas en nuestra lista
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;

      // 4. LA MAGIA: Forzamos a que TODAS tengan un índice perfecto (0, 1, 2...)
      // Esto arregla para siempre cualquier categoría vieja que no tuviera número
      newOrder = newOrder.map((cat, i) => ({ ...cat, index: i }));

      // 5. Enviamos la lista completa a guardar silenciosamente
      const pathArray = getCategoryNamesArray();
      await dispatch(startReorderingCategories(newOrder, pathArray));
  };

  return (
    (isLoading) ?(
      <div style={{ marginLeft: '8%', marginRight: '8%', marginTop: '200px', marginBottom: '200px', display: 'flex', justifyContent: 'center'}}>
        <CircularLoader/>
      </div>
    )
    :
    (
      <>
        <div className='cards-grid'>
          {/* Tarjetas Normales. NUEVO: le pasamos la prop onEdit */}
          {loadedCategories.map((card, index) => (
              <CardElement 
                  key={index+card.title} 
                  {...card} 
                  onEdit={() => handleOpenEditCategory(card)} 
                  onMoveUp={() => handleMoveCategory(index, 'up')}
                  onMoveDown={() => handleMoveCategory(index, 'down')}
                  isFirst={index === 0}
                  isLast={index === loadedCategories.length - 1}
              />
          ))}

          {/* Tarjeta de Agregar Categoría (Solo Admin) */}
          {isSuperAdmin && (
              <div 
                  onClick={handleOpenNewCategory}
                  style={{
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                      height: '220px', border: '2px dashed var(--lightGreen)', borderRadius: '12px',
                      cursor: 'pointer', color: 'var(--darkGreen)', backgroundColor: 'rgba(47, 172, 102, 0.05)',
                      transition: 'all 0.3s ease', minWidth: '200px', width: '100%'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(47, 172, 102, 0.1)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(47, 172, 102, 0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                  <AddCircleOutlineIcon style={{ fontSize: '3rem', marginBottom: '10px' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase' }}>Nueva Categoría</h3>
              </div>
          )}
        </div>

        {/* El Modal Oculto */}
        <CategoryModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={categoryToEdit}
            onSave={handleSaveModal}
            onDelete={handleDeleteModal}
        />
      </>
    )
  )
}