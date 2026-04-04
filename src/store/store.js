import { configureStore } from '@reduxjs/toolkit'
import { educationModuleSlice } from './educationModule/educationModuleSlice';
import { authSlice } from './auth/authSlice';


export const store = configureStore({
  reducer: {
    educationModule: educationModuleSlice.reducer,
    auth: authSlice.reducer,
  },
});