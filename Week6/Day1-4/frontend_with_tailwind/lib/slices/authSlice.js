
'use client';
import { createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api';

const initialToken = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;

const slice = createSlice({
  name: 'auth',
  initialState: { token: initialToken, me: null },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) localStorage.setItem('token', action.payload);
        else localStorage.removeItem('token');
      }
    },
    setMeFromToken: (state, action) => {
      state.me = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.me = null;
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getMe.matchFulfilled, (state, { payload }) => {
      state.me = payload;
    });
  }
});

export const { setToken, setMeFromToken, logout } = slice.actions;
export const selectAuth = (state) => state.auth;
export default slice.reducer;
