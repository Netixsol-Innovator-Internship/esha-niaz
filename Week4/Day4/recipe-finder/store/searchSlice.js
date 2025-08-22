import { createSlice } from '@reduxjs/toolkit'

// Load saved term from localStorage (if available)
const initialState = {
  term:
    typeof window !== 'undefined' && localStorage.getItem('searchTerm')
      ? localStorage.getItem('searchTerm')
      : 'chicken',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.term = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchTerm', action.payload)
      }
    },
  },
})

export const { setSearchTerm } = searchSlice.actions
export default searchSlice.reducer
