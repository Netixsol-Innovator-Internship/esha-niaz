// src/redux/slices/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit"

const defaultState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
}

const slice = createSlice({
    name: "auth",
    initialState: defaultState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            localStorage.setItem("token", action.payload.token)
            localStorage.setItem("user", JSON.stringify(action.payload.user))
        },
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem("token")
            localStorage.removeItem("user")
        },
        setUser: (state, action) => {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
    },
})

export default slice.reducer

export const actions = slice.actions

// selectors
export const getUser = (state) => state.auth.user
export const getToken = (state) => state.auth.token
export const isAuthenticated = (state) => !!state.auth.token






// import { createSlice } from "@reduxjs/toolkit"

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// }

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.loading = true
//       state.error = null
//     },
//     loginSuccess: (state, action) => {
//       state.loading = false
//       state.isAuthenticated = true
//       state.user = action.payload
//       state.error = null
//     },
//     loginFailure: (state, action) => {
//       state.loading = false
//       state.isAuthenticated = false
//       state.user = null
//       state.error = action.payload
//     },
//     logout: (state) => {
//       state.user = null
//       state.isAuthenticated = false
//       state.loading = false
//       state.error = null
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//   },
// })

// // Actions
// export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions

// // Selectors
// export const getUser = (state) => state.auth.user
// export const getIsAuthenticated = (state) => state.auth.isAuthenticated
// export const getAuthLoading = (state) => state.auth.loading
// export const getAuthError = (state) => state.auth.error

// // Reducer
// export default authSlice.reducer
