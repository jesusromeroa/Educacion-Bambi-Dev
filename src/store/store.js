import { configureStore } from '@reduxjs/toolkit'
import { educationModuleSlice } from './educationModule/educationModuleSlice';


export const store = configureStore({
  reducer: {
    educationModule: educationModuleSlice.reducer,
  },
});