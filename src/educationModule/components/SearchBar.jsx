import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import './styles/searchBar.css'
import { useForm } from '../../hooks/useForm'

export const SearchBar = ({onUpdateSearchParam = () => {}}) => {

  const {formState, onInputChange, onResetForm} = useForm({
    searchtext: ''
  });
  const {searchtext} = formState;

  const onNewSearch = (event) => {
    event.preventDefault();
    onUpdateSearchParam(searchtext.trim().toLowerCase());
  }

  return (
        <form onSubmit={onNewSearch}>
            <div className='searchbar-container'>
                <button type='submit'  className='search-icon-button'><SearchIcon fontSize='medium'/></button>
                <input className='search-input' type="search" name='searchtext' value={searchtext} autoComplete='off' onChange={onInputChange} placeholder='Búsqueda'/>
            </div>
        </form>
  )
}
