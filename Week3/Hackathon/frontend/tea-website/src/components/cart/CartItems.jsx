// "use client"

// import React from "react"
// import { Minus, Plus } from "lucide-react"
// import Button from "../shared/buttons/button"
// import { useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { useNavigate } from "react-router-dom"
// import { removeFromCart, updateQuantity } from "../../redux/slices/cart/cartSlice"

// const CartItems = ({ cartProducts, subtotal }) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const handleIncreaseQuantity = (id) => {
//     const item = cartProducts.find((p) => p.id === id)
//     if (item) {
//       dispatch(updateQuantity({ itemId: id, quantity: item.quantity + 1 }))
//       toast.success("Quantity updated!")
//     }
//   }

//   const handledecreaseQuantity = (id) => {
//     const item = cartProducts.find((p) => p.id === id)
//     if (item && item.quantity > 1) {
//       dispatch(updateQuantity({ itemId: id, quantity: item.quantity - 1 }))
//       toast.success("Quantity updated!")
//     }
//   }

//   const handleRemoveBtn = (id) => {
//     dispatch(removeFromCart(id))
//     toast.success("Item removed from cart!")
//   }

//   const handleShoppingBtn = () => {
//     navigate("/collections")
//   }

//   return (
//     <div className="sm:w-[455px] font-montserrat mb-12">
//       {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
//         cartProducts.map((product) => (
//           <div key={product.id} className="flex items-center gap-2 sm:gap-4 w-full py-3">
//             <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
//               <img
//                 src={
//                   product.image || "/placeholder.svg"
//                 }
//                 className="h-full w-full object-cover rounded"
//               />
//             </div>
//             <div className="flex flex-col sm:gap-3 justify-between w-full">
//               <div className="flex justify-between w-full">
//                 <p className="text-[8px] sm:text-sm w-[100px] sm:w-[200px]">
//                   {product.name} - {product?.variant}
//                 </p>
//                 <div className="flex items-center justify-between w-[50px] sm:w-[70px]">
//                   <span className="cursor-pointer" onClick={() => handledecreaseQuantity(product.id)}>
//                     <Minus size={14} />
//                   </span>
//                   <span className="text-sm sm:text-xl">{product.quantity}</span>
//                   <span className="cursor-pointer" onClick={() => handleIncreaseQuantity(product.id)}>
//                     <Plus size={14} />
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <button
//                   onClick={() => handleRemoveBtn(product.id)}
//                   className="uppercase cursor-pointer text-[10px] sm:text-sm text-gray-600 hover:text-red-600"
//                 >
//                   remove
//                 </button>
//                 <span className="text-[12px] sm:text-sm">€{product.price}</span>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center py-12 text-lg">No Item in cart</p>
//       )}

//       <div className="border-b border-[#A0A0A0] mt-4 mx-6"></div>
//       <div className="flex items-center justify-between py-8 w-full">
//         <span>subtotal</span>
//         <span className="font-medium">€{subtotal}</span>
//       </div>

//       <div className="flex items-center justify-center w-full">
//         <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
//           {" "}
//           back to shopping{" "}
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default React.memo(CartItems)



// "use client"

// import React from "react"
// import { Minus, Plus } from "lucide-react"
// import Button from "../shared/buttons/button"
// import { useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { useNavigate } from "react-router-dom"
// import { removeFromCart, updateQuantity } from "../../redux/slices/cart/cartSlice"
// import { useRemoveFromCartMutation, useUpdateCartItemQuantityMutation } from "../../redux/slices/cart/cartApi"
// import { useSelector } from "react-redux"
// import { getUser } from "../../redux/slices/auth/authSlice"

// const CartItems = ({ cartProducts, subtotal }) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const user = useSelector(getUser)

//   const [removeFromCartAPI] = useRemoveFromCartMutation()
//   const [updateQuantityAPI] = useUpdateCartItemQuantityMutation()

//   const handleIncreaseQuantity = async (id) => {
//     const item = cartProducts.find((p) => p.id === id)
//     if (item) {
//       dispatch(updateQuantity({ itemId: id, quantity: item.quantity + 1 }))

//       if (user?.token) {
//         try {
//           await updateQuantityAPI({ cartItemId: id, action: "increase" })
//         } catch (error) {
//           console.error("Failed to update quantity on server:", error)
//         }
//       }

//       toast.success("Quantity updated!")
//     }
//   }

//   const handledecreaseQuantity = async (id) => {
//     const item = cartProducts.find((p) => p.id === id)
//     if (item && item.quantity > 1) {
//       dispatch(updateQuantity({ itemId: id, quantity: item.quantity - 1 }))

//       if (user?.token) {
//         try {
//           await updateQuantityAPI({ cartItemId: id, action: "decrease" })
//         } catch (error) {
//           console.error("Failed to update quantity on server:", error)
//         }
//       }

//       toast.success("Quantity updated!")
//     }
//   }

//   const handleRemoveBtn = async (id) => {
//     dispatch(removeFromCart(id))

//     if (user?.token) {
//       try {
//         await removeFromCartAPI(id)
//       } catch (error) {
//         console.error("Failed to remove item from server:", error)
//       }
//     }

//     toast.success("Item removed from cart!")
//   }

//   const handleShoppingBtn = () => {
//     navigate("/collections")
//   }

//   return (
//     <div className="sm:w-[455px] font-montserrat mb-12">
//       {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
//         cartProducts.map((product) => (
//           <div key={product.id} className="flex items-center gap-2 sm:gap-4 w-full py-3">
//             <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
//               <img
//                 src={product.image || "/product-placeholder.png"} // Use proper placeholder
//                 alt={product.name}
//                 className="h-full w-full object-cover rounded"
//                 onError={(e) => {
//                   e.target.src = "/product-placeholder.png"
//                 }}
//               />
//             </div>
//             <div className="flex flex-col sm:gap-3 justify-between w-full">
//               <div className="flex justify-between w-full">
//                 <p className="text-[8px] sm:text-sm w-[100px] sm:w-[200px]">
//                   {product.name} - {product?.variant}
//                 </p>
//                 <div className="flex items-center justify-between w-[50px] sm:w-[70px]">
//                   <span className="cursor-pointer" onClick={() => handledecreaseQuantity(product.id)}>
//                     <Minus size={14} />
//                   </span>
//                   <span className="text-sm sm:text-xl">{product.quantity}</span>
//                   <span className="cursor-pointer" onClick={() => handleIncreaseQuantity(product.id)}>
//                     <Plus size={14} />
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <button
//                   onClick={() => handleRemoveBtn(product.id)}
//                   className="uppercase cursor-pointer text-[10px] sm:text-sm text-gray-600 hover:text-red-600"
//                 >
//                   remove
//                 </button>
//                 <span className="text-[12px] sm:text-sm">€{product.price}</span>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center py-12 text-lg">No Item in cart</p>
//       )}

//       <div className="border-b border-[#A0A0A0] mt-4 mx-6"></div>
//       <div className="flex items-center justify-between py-8 w-full">
//         <span>subtotal</span>
//         <span className="font-medium">€{subtotal}</span>
//       </div>

//       <div className="flex items-center justify-center w-full">
//         <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
//           {" "}
//           back to shopping{" "}
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default React.memo(CartItems)




"use client"

import React from "react"
import { Minus, Plus } from "lucide-react"
import Button from "../shared/buttons/button"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { removeFromCart, updateQuantity } from "../../redux/slices/cart/cartSlice"
import { useRemoveFromCartMutation, useUpdateCartItemQuantityMutation } from "../../redux/slices/cart/cartApi"
import { useSelector } from "react-redux"
import { getUser } from "../../redux/slices/auth/authSlice"

const CartItems = ({ cartProducts, subtotal }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(getUser)

  const [removeFromCartAPI] = useRemoveFromCartMutation()
  const [updateQuantityAPI] = useUpdateCartItemQuantityMutation()

  const handleIncreaseQuantity = async (id) => {
    const item = cartProducts.find((p) => p.id === id)
    if (item) {
      dispatch(updateQuantity({ itemId: id, quantity: item.quantity + 1 }))

      if (user?.token) {
        try {
          await updateQuantityAPI({ cartItemId: id, action: "increase" })
        } catch (error) {
          console.error("Failed to update quantity on server:", error)
        }
      }

      toast.success("Quantity updated!")
    }
  }

  const handledecreaseQuantity = async (id) => {
    const item = cartProducts.find((p) => p.id === id)
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ itemId: id, quantity: item.quantity - 1 }))

      if (user?.token) {
        try {
          await updateQuantityAPI({ cartItemId: id, action: "decrease" })
        } catch (error) {
          console.error("Failed to update quantity on server:", error)
        }
      }

      toast.success("Quantity updated!")
    }
  }

  const handleRemoveBtn = async (id) => {
    dispatch(removeFromCart(id))

    if (user?.token) {
      try {
        await removeFromCartAPI(id)
      } catch (error) {
        console.error("Failed to remove item from server:", error)
      }
    }

    toast.success("Item removed from cart!")
  }

  const handleShoppingBtn = () => {
    navigate("/collections")
  }

  return (
    <div className="sm:w-[455px] font-montserrat mb-12">
      {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
        cartProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-2 sm:gap-4 w-full py-3">
            <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
              <img
                src={product.image || "/product-placeholder.png"} // Use proper placeholder
                alt={product.name}
                className="h-full w-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "/product-placeholder.png"
                }}
              />
            </div>
            <div className="flex flex-col sm:gap-3 justify-between w-full">
              <div className="flex justify-between w-full">
                <p className="text-[8px] sm:text-sm w-[100px] sm:w-[200px]">
                  {product.name} - {product.variant}
                </p>
                <div className="flex items-center justify-between w-[50px] sm:w-[70px]">
                  <span className="cursor-pointer" onClick={() => handledecreaseQuantity(product.id)}>
                    <Minus size={14} />
                  </span>
                  <span className="text-sm sm:text-xl">{product.quantity}</span>
                  <span className="cursor-pointer" onClick={() => handleIncreaseQuantity(product.id)}>
                    <Plus size={14} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => handleRemoveBtn(product.id)}
                  className="uppercase cursor-pointer text-[10px] sm:text-sm text-gray-600 hover:text-red-600"
                >
                  remove
                </button>
                <span className="text-[12px] sm:text-sm">€{product.price}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center py-12 text-lg">No Item in cart</p>
      )}

      <div className="border-b border-[#A0A0A0] mt-4 mx-6"></div>
      <div className="flex items-center justify-between py-8 w-full">
        <span>subtotal</span>
        <span className="font-medium">€{subtotal}</span>
      </div>

      <div className="flex items-center justify-center w-full">
        <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
          {" "}
          back to shopping{" "}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(CartItems)





// "use client"

// import React from "react"
// import { Minus, Plus } from "lucide-react"
// import Button from "../shared/buttons/button"
// import { useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { useNavigate } from "react-router-dom"
// import { removeFromCart, updateQuantity } from "../../redux/slices/cart/cartSlice"
// import { useRemoveFromCartMutation, useUpdateCartItemQuantityMutation } from "../../redux/slices/cart/cartApi"
// import { useSelector } from "react-redux"
// import { getUser } from "../../redux/slices/auth/authSlice"

// const CartItems = ({ cartProducts, subtotal }) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const user = useSelector(getUser)

//   const [removeFromCartAPI] = useRemoveFromCartMutation()
//   const [updateQuantityAPI] = useUpdateCartItemQuantityMutation()

//   const handleIncreaseQuantity = async (id) => {
//     const item = cartProducts.find((p) => p.id === id)
//     if (item) {
//       // Update local state immediately
//       dispatch(updateQuantity({ itemId: id, quantity: item.quantity + 1 }))

//       if (user?.token && item.cartItemId) {
//         try {
//           await updateQuantityAPI({ cartItemId: item.cartItemId, action: "increase" })
//         } catch (error) {
//           console.error("Failed to update quantity on server:", error)
//           // Revert local change on error
//           dispatch(updateQuantity({ itemId: id, quantity: item.quantity }))
//         }
//       }

//       toast.success("Quantity updated!")
//     }
//   }

//   const handledecreaseQuantity = async (id) => {
//     const item = cartProducts.find((p) => p.id === id)
//     if (item && item.quantity > 1) {
//       // Update local state immediately
//       dispatch(updateQuantity({ itemId: id, quantity: item.quantity - 1 }))

//       if (user?.token && item.cartItemId) {
//         try {
//           await updateQuantityAPI({ cartItemId: item.cartItemId, action: "decrease" })
//         } catch (error) {
//           console.error("Failed to update quantity on server:", error)
//           // Revert local change on error
//           dispatch(updateQuantity({ itemId: id, quantity: item.quantity }))
//         }
//       }

//       toast.success("Quantity updated!")
//     }
//   }

//   const handleRemoveBtn = async (id) => {
//     const item = cartProducts.find((p) => p.id === id)

//     // Update local state immediately
//     dispatch(removeFromCart(id))

//     if (user?.token && item?.cartItemId) {
//       try {
//         await removeFromCartAPI(item.cartItemId)
//       } catch (error) {
//         console.error("Failed to remove item from server:", error)
//       }
//     }

//     toast.success("Item removed from cart!")
//   }

//   const handleShoppingBtn = () => {
//     navigate("/collections")
//   }

//   return (
//     <div className="sm:w-[455px] font-montserrat mb-12">
//       {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
//         cartProducts.map((product) => (
//           <div key={product.id} className="flex items-center gap-2 sm:gap-4 w-full py-3">
//             <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
//               <img
//                 src={product.image || "/placeholder.svg"}
//                 alt={product.name}
//                 className="h-full w-full object-cover rounded"
//                 onError={(e) => {
//                   e.target.src = "/placeholder.svg"
//                 }}
//               />
//             </div>
//             <div className="flex flex-col sm:gap-3 justify-between w-full">
//               <div className="flex justify-between w-full">
//                 <p className="text-[8px] sm:text-sm w-[100px] sm:w-[200px]">
//                   {product.name} - {product?.variant}
//                 </p>
//                 <div className="flex items-center justify-between w-[50px] sm:w-[70px]">
//                   <span className="cursor-pointer" onClick={() => handledecreaseQuantity(product.id)}>
//                     <Minus size={14} />
//                   </span>
//                   <span className="text-sm sm:text-xl">{product.quantity}</span>
//                   <span className="cursor-pointer" onClick={() => handleIncreaseQuantity(product.id)}>
//                     <Plus size={14} />
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <button
//                   onClick={() => handleRemoveBtn(product.id)}
//                   className="uppercase cursor-pointer text-[10px] sm:text-sm text-gray-600 hover:text-red-600"
//                 >
//                   remove
//                 </button>
//                 <span className="text-[12px] sm:text-sm">€{product.price}</span>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center py-12 text-lg">No Item in cart</p>
//       )}

//       <div className="border-b border-[#A0A0A0] mt-4 mx-6"></div>
//       <div className="flex items-center justify-between py-8 w-full">
//         <span>subtotal</span>
//         <span className="font-medium">€{subtotal}</span>
//       </div>

//       <div className="flex items-center justify-center w-full">
//         <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
//           back to shopping
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default React.memo(CartItems)
