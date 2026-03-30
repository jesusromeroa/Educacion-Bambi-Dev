import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { EducacionBambiApp } from './EducacionBambiApp'
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <EducacionBambiApp/>
    </Provider>
  </StrictMode>
)
