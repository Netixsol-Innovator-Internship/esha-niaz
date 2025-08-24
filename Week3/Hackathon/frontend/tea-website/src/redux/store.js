import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/product/productsSlice.js";
import { productsApi } from "./slices/product/productsApi.js";
import { authApi } from "./slices/auth/authApi.js";
import authReducer from "./slices/auth/authSlice.js";
import { adminApi } from "./slices/admin/adminApi.js"
import adminReducer from "./slices/admin/adminSlice.js"
import cartReducer from "./slices/cart/cartSlice.js"

export const store = configureStore({
    reducer:{
        products: productsReducer,
        auth: authReducer,
        admin: adminReducer,
        cart: cartReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [authApi.reducerPath]:authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware, authApi.middleware, adminApi.middleware)
})

export default store