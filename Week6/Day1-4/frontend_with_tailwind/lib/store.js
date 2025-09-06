
'use client';
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from './slices/authSlice';
import { uploadApi } from './services/uploadApi';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware, uploadApi.middleware),
  devTools: true,
});

export default store;
