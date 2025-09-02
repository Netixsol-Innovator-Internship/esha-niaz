'use client';
import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

const initial = { user: null, token: null };

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload || {};
      state.user = user || null;
      state.token = access_token || null;
      if (typeof window !== 'undefined') {
        if (access_token) localStorage.setItem('token', access_token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      // api.util.resetApiState(); // <-- clears all cached RTK Query data
    },
    hydrateFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        state.token = token || null;
        state.user = user ? JSON.parse(user) : null;
      }
    },
  },
});

export const { setCredentials, logout, hydrateFromStorage } = slice.actions;
export default slice.reducer;
