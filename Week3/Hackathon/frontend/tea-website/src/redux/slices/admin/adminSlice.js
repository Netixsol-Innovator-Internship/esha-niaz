import { createSlice } from "@reduxjs/toolkit"

const defaultState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
}

const adminSlice = createSlice({
    name: "admin",
    initialState: defaultState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        updateUserInList: (state, action) => {
            const updatedUser = action.payload
            const index = state.users.findIndex((user) => user._id === updatedUser._id)
            if (index !== -1) {
                state.users[index] = updatedUser
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
    },
})

export default adminSlice.reducer

export const actions = adminSlice.actions

// Selectors
export const getUsers = (state) => state.admin.users
export const getSelectedUser = (state) => state.admin.selectedUser
export const getLoading = (state) => state.admin.loading
export const getError = (state) => state.admin.error
