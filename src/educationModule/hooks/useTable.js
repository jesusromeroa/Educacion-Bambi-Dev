import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotalPages, determineAllFilteredItems, loadCurrentPageItems, resetTable, setNewPage, setSearchParam, setTableLoadingState } from '../../store/educationModule/educationModuleSlice'
import { startLoadingResources } from "../../store/educationModule/thunks";

export const useTable = (categoryNamesArray = []) => {
  
    const [firstLoad, setFirstLoad] = useState(true);
    const {tableSection} = useSelector(store => store.educationModule);
    const dispatch = useDispatch();

    const {
        searchParam,
        currentPage,
    } = tableSection;

    useEffect(() => {
      if (!firstLoad) return;
      dispatch(resetTable());
      dispatch(startLoadingResources(categoryNamesArray));
      setFirstLoad(false);
    }, [])
    useEffect(() => {
      if (firstLoad) return;
      dispatch(setTableLoadingState());
      dispatch(determineAllFilteredItems());
      dispatch(calculateTotalPages());
      if ((currentPage === 1)){
        dispatch(loadCurrentPageItems());
      }else{
          dispatch(setNewPage(1));
      }
    }, [searchParam])

    useEffect(() => {
      if (firstLoad) return;
      dispatch(setTableLoadingState());
      dispatch(loadCurrentPageItems());
    }, [currentPage]);
    
    const handleSetSearchParam = (newSearchParam) => {
        dispatch(setSearchParam(newSearchParam));
    }

    const handleSetNewPage = (newPage) => {
        dispatch(setNewPage(newPage));
    }

    return {
      handleSetSearchParam,
      handleSetNewPage
    };
}