'use client';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = (() => {
  if (typeof window === 'undefined') return { token: null, user: null };
  const token = Cookies.get('token') || null;
  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  return { token, user };
})();

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        Cookies.set('token', state.token || '', { expires: 7 });
        Cookies.set('user', JSON.stringify(state.user || {}), { expires: 7 });
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
  }
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
