import { configureStore } from '@reduxjs/toolkit';
import institutionReducer from './slice/institution.slice';
import authReducer from './slice/auth.slice';

export const store = configureStore({
  reducer: {
    institution: institutionReducer,
    auth: authReducer,
  },
});
