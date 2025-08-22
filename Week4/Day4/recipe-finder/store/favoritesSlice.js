import { createSlice } from '@reduxjs/toolkit'

const initialState =
  typeof window !== 'undefined' && localStorage.getItem('favorites')
    ? JSON.parse(localStorage.getItem('favorites'))
    : []

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (!state.find((r) => r.idMeal === action.payload.idMeal)) {
        state.push(action.payload)
      }
      localStorage.setItem('favorites', JSON.stringify(state))
    },
    removeFavorite: (state, action) => {
      const newState = state.filter((r) => r.idMeal !== action.payload)
      localStorage.setItem('favorites', JSON.stringify(newState))
      return newState
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
