'use client';
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, auth: authReducer },
  middleware: (getDefault) => getDefault().concat(api.middleware),
  devTools: true,
});

export default store;
