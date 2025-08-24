// import { createSlice } from "@reduxjs/toolkit"

// const defaultState = {
//     list: [],
//     cartItems: [],
//     loading: false,
//     error: null,
//     currentFilters: {},
//     collections: [],
// }

// const slice = createSlice({
//     name: "products",
//     initialState: defaultState,
//     reducers: {
//         setList(state, action) {
//             state.list = action.payload
//             state.loading = false
//             state.error = null
//         },
//         updateList(state, action) {
//             state.list = [...state.list, action.payload]
//         },
//         setLoading(state, action) {
//             state.loading = action.payload
//         },
//         setError(state, action) {
//             state.error = action.payload
//             state.loading = false
//         },
//         setCurrentFilters(state, action) {
//             state.currentFilters = action.payload
//         },
//         clearFilters(state) {
//             state.currentFilters = {}
//         },
//         setCollections(state, action) {
//             state.collections = action.payload
//         },
//         addToCart(state, action) {
//             const existingItem = state.cartItems.find((item) => item._id === action.payload._id)
//             if (existingItem) {
//                 existingItem.quantity += 1
//             } else {
//                 state.cartItems = [...state.cartItems, { ...action.payload, quantity: 1 }]
//             }
//         },
//         deleteFromCart(state, action) {
//             const filteredProducts = state.cartItems.filter((product) => product._id !== action.payload)
//             state.cartItems = filteredProducts
//         },
//         increaseQuantity(state, action) {
//             const product = state.cartItems.find((product) => product._id === action.payload)
//             if (product) {
//                 product.quantity += 1
//             }
//         },
//         decreaseQuantity(state, action) {
//             const product = state.cartItems.find((product) => product._id === action.payload)
//             if (product && product.quantity > 1) {
//                 product.quantity -= 1
//             }
//         },
//         clearCartItems: (state) => {
//             state.cartItems = []
//         },
//         resetProductState: () => defaultState,
//     },
// })

// // reducer
// export default slice.reducer

// export const actions = slice.actions

// // selectors
// export const getProductsList = (state) => state.products.list
// export const getCartItems = (state) => state.products.cartItems
// export const getProductsLoading = (state) => state.products.loading
// export const getProductsError = (state) => state.products.error
// export const getCurrentFilters = (state) => state.products.currentFilters
// export const getCollections = (state) => state.products.collections
// export const getCartItemsCount = (state) => state.products.cartItems.reduce((total, item) => total + item.quantity, 0)
// export const getCartTotal = (state) =>
//     state.products.cartItems.reduce((total, item) => {
//         const variant = item.variants?.[0] || { price: 0 }
//         return total + variant.price * item.quantity
//     }, 0)









import { createSlice } from "@reduxjs/toolkit"

const defaultState = {
  list: [],
  cartItems: [],
  loading: false,
  error: null,
  currentFilters: {},
  collections: [],
}

const slice = createSlice({
  name: "products",
  initialState: defaultState,
  reducers: {
    setList(state, action) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    updateList(state, action) {
      state.list = [...state.list, action.payload]
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    setCurrentFilters(state, action) {
      state.currentFilters = action.payload
    },
    clearFilters(state) {
      state.currentFilters = {}
    },
    setCollections(state, action) {
      state.collections = action.payload
    },
    addToCart(state, action) {
      const existingItem = state.cartItems.find((item) => item._id === action.payload._id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cartItems = [...state.cartItems, { ...action.payload, quantity: 1 }]
      }
    },
    deleteFromCart(state, action) {
      const filteredProducts = state.cartItems.filter((product) => product._id !== action.payload)
      state.cartItems = filteredProducts
    },
    increaseQuantity(state, action) {
      const product = state.cartItems.find((product) => product._id === action.payload)
      if (product) {
        product.quantity += 1
      }
    },
    decreaseQuantity(state, action) {
      const product = state.cartItems.find((product) => product._id === action.payload)
      if (product && product.quantity > 1) {
        product.quantity -= 1
      }
    },
    clearCartItems: (state) => {
      state.cartItems = []
    },
    resetProductState: () => defaultState,
  },
})

// reducer
export default slice.reducer

export const actions = slice.actions

// selectors
export const getProductsList = (state) => state.products.list
export const getCartItems = (state) => state.products.cartItems
export const getProductsLoading = (state) => state.products.loading
export const getProductsError = (state) => state.products.error
export const getCurrentFilters = (state) => state.products.currentFilters
export const getCollections = (state) => state.products.collections
export const getCartItemsCount = (state) => state.products.cartItems.reduce((total, item) => total + item.quantity, 0)
export const getCartTotal = (state) =>
  state.products.cartItems.reduce((total, item) => {
    const variant = item.variants?.[0] || { price: 0 }
    return total + variant.price * item.quantity
  }, 0)
