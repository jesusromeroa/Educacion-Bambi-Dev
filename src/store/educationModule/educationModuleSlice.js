import { createSlice } from '@reduxjs/toolkit';

export const educationModuleSlice = createSlice({
   name: 'educationModule',
   initialState: {
      slideShowItems: [], 
      
      categories: {
         loadedCategories: [], 
         isLoading: true,
         hasError: false,
         error: null
      },
      
      tableSection: {
         maxrows: 10, 
         searchParam: '', 
         searchParamTarget: 'name', 
         allItems: [],
         allFilteredItems: [], 
         pageItems: [],
         totalPages: 1, 
         currentPage: 1, 
         isLoading: true, 
         hasError: false,
         error: null
      }
   },
   reducers: {
      
      setSlidesShowItems: (state, {payload}) => { //payload is an array of slides
         state.slideShowItems = payload;
      },
      setLoadedCategories: (state, {payload}) => { //payload is an array with the loaded categories
         state.categories.loadedCategories = payload;
      },
      setSearchParam: (state, {payload}) => { //payload is newSearchParam
         state.tableSection.searchParam = payload; 
      },
      setAllItems: (state, {payload}) => { //payload is an array with all the loaded items
         state.tableSection.allItems = payload;
      },
      determineAllFilteredItems: (state) => {
         state.tableSection.allFilteredItems = state.tableSection.allItems.filter((resource) => {
            return resource[state.tableSection.searchParamTarget].toLowerCase().includes(state.tableSection.searchParam);
         });
      },
      calculateTotalPages: (state) => { //
         const totalPages = Math.ceil(state.tableSection.allFilteredItems.length/state.tableSection.maxrows);
         if (totalPages === 0 ){
            state.tableSection.totalPages = 1;
         }else{
            state.tableSection.totalPages = totalPages;
         }
          
      },
      setNewPage: (state, {payload}) => { //payload is newPage
         if ((payload > state.tableSection.totalPages) || (payload < 1)) return;
         state.tableSection.currentPage = payload;
      },
      loadCurrentPageItems: (state) => {

         let lastItemIndex = (state.tableSection.currentPage*state.tableSection.maxrows) - 1; //indice del ultimo elemento de la pag seleccionada
         let firstItemIndex = lastItemIndex - state.tableSection.maxrows + 1; //indice del primer elemento de la pag seleccionada

         if ((state.tableSection.allFilteredItems.length-1) < lastItemIndex){
            lastItemIndex = state.tableSection.allFilteredItems.length-1;
         }

         const pageItemsToBeShown = [];

         for (let i = firstItemIndex;i<=lastItemIndex;i++){
            //poner un if de seguridad
            pageItemsToBeShown.push(state.tableSection.allFilteredItems[i]);
         }

         state.tableSection.pageItems = pageItemsToBeShown;

         state.tableSection.hasError = false;
         state.tableSection.isLoading = false;
         
      },
      resetTable: (state) => {
         state.tableSection = {
            maxrows: 10, 
            searchParam: '', 
            searchParamTarget: 'name', 
            allItems: [],
            allFilteredItems: [], 
            pageItems: [],
            totalPages: 1, 
            currentPage: 1, 
            isLoading: true, 
            hasError: false,
            error: null
         }
      },
      setTableLoadingState: (state) => {
         state.tableSection.isLoading = true;
      },
      setTableError: (state, {payload}) => { //payload is an error message
         state.tableSection.isLoading = false;
         state.tableSection.hasError = true;
         state.tableSection.error = payload;
      },
      setCategoriesLoadingState: (state) => {
         state.categories.isLoading = true,
         state.categories.hasError = false,
         state.categories.error = null;
      },
      setCategoriesError: (state, {payload}) => { //payload is an error message
         state.categories.isLoading = false,
         state.categories.hasError = true;
         state.categories.error = payload; 
      },
      categoriesLoadedSuccesfully: (state) => {
         state.categories.isLoading = false;
         state.categories.hasError = false;
         state.categories.error = null; 
      },
   }
});

export const { setSlidesShowItems, 
               setLoadedCategories,
               setSearchParam, 
               setAllItems,
               calculateTotalPages, 
               setNewPage, 
               loadCurrentPageItems, 
               setTableLoadingState,
               resetTable,
               setTableError,
               setCategoriesLoadingState,
               setCategoriesError,
               categoriesLoadedSuccesfully,
               determineAllFilteredItems } = educationModuleSlice.actions;