import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import favoritesReducer from './favoritesSlice'
import searchReducer from './searchSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    favorites: favoritesReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
