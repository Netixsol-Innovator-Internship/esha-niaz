"use client"

import { Minus, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import Button from "../../shared/buttons/button"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartTotalAmount,
} from "../../../redux/slices/cart/cartSlice"

const CartPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cartProducts = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartTotalAmount)
  const dispatch = useDispatch()
  const [delivery] = useState(3.5)
  const total = subtotal + delivery
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  const handleIncreaseQuantity = (id) => {
    const item = cartProducts.find((p) => p.id === id)
    if (item) {
      dispatch(updateQuantity({ itemId: id, quantity: item.quantity + 1 }))
      toast.success("Quantity updated!")
    }
  }

  const handledecreaseQuantity = (id) => {
    const item = cartProducts.find((p) => p.id === id)
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ itemId: id, quantity: item.quantity - 1 }))
      toast.success("Quantity updated!")
    }
  }

  const handleRemoveBtn = (id) => {
    dispatch(removeFromCart(id))
    toast.success("Item removed from cart!")
  }

  const handlePurchaseBtn = () => {
    navigate("/cart")
    handleClose()
  }

  return (
    // overlay
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-[#282828]/50 flex justify-end z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* popup drawer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-[261px] sm:w-[500px] h-screen flex flex-col shadow-xl py-6 sm:py-11 px-3 sm:px-6 font-sans transform transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* cart items */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-6">
            <h2 className="text-xl capitalize">my bag</h2>
            <button onClick={handleClose} className="cursor-pointer">
              <X />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto font-montserrat">
            {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
              cartProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2 sm:gap-4 w-full py-3">
                  {/* image - left*/}
                  <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
                    <img src={product.image || "/placeholder.svg"} className="h-full w-full object-cover rounded" />
                  </div>
                  {/* right */}
                  <div className="flex flex-col sm:gap-3 justify-between w-full">
                    {/* description + items btn */}
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
                    {/* remove btn + price */}
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
              <p>No Item in cart</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-6 sm:mt-0">
          {/* divider */}
          <div className="border-b border-[#A0A0A0] hidden sm:block my-4"></div>
          {/* sub total */}
          <div className="flex items-center justify-between w-full py-2">
            <span className="text-xs sm:text-base">Subtotal</span>
            <span className="font-medium text-base">€{subtotal}</span>
          </div>
          {/* delivery */}
          <div className="flex items-center justify-between w-full pb-2 pt-2">
            <span className="text-xs sm:text-base">Delivery</span>
            <span className="font-medium text-base">€{delivery}</span>
          </div>
          {/* divider */}
          <div className="border-b border-[#A0A0A0] my-4"></div>
          {/* total */}
          <div className="flex items-center justify-between w-full pb-2">
            <span className="font-medium text-base">Total</span>
            <span className="font-medium text-xl">€{total}</span>
          </div>

          <Button
            onClick={handlePurchaseBtn}
            className="bg-[#282828] text-white w-full my-3 hover:bg-transparent border hover:text-[#282828]"
          >
            purchase
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartPopup


// "use client"

// import { Minus, Plus, X } from "lucide-react"
// import { useEffect, useState } from "react"
// import Button from "../../shared/buttons/button"
// import { useSelector, useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { useNavigate } from "react-router-dom"
// import {
//   removeFromCart,
//   updateQuantity,
//   selectCartItems,
//   selectCartTotalAmount,
// } from "../../../redux/slices/cart/cartSlice"
// import {
//   useRemoveFromCartMutation,
//   useUpdateCartItemQuantityMutation,
//   useGetUserCartQuery,
// } from "../../../redux/slices/cart/cartApi"
// import { getUser } from "../../../redux/slices/auth/authSlice"

// const CartPopup = ({ onClose }) => {
//   const [isVisible, setIsVisible] = useState(false)
//   const cartProducts = useSelector(selectCartItems)
//   const subtotal = useSelector(selectCartTotalAmount)
//   const user = useSelector(getUser)
//   const dispatch = useDispatch()
//   const [delivery] = useState(3.5)
//   const total = subtotal + delivery
//   const navigate = useNavigate()

//   const [removeFromCartAPI] = useRemoveFromCartMutation()
//   const [updateQuantityAPI] = useUpdateCartItemQuantityMutation()

//   const { refetch } = useGetUserCartQuery(undefined, {
//     skip: !user?.token,
//   })

//   useEffect(() => {
//     setIsVisible(true)
//     // Refetch cart when popup opens if user is logged in
//     if (user?.token) {
//       refetch()
//     }
//   }, [user?.token, refetch])

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") handleClose()
//     }
//     window.addEventListener("keydown", handleEsc)
//     return () => window.removeEventListener("keydown", handleEsc)
//   }, [])

//   const handleClose = () => {
//     setIsVisible(false)
//     setTimeout(() => onClose(), 300)
//   }

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

//   const handlePurchaseBtn = () => {
//     navigate("/cart")
//     handleClose()
//   }

//   return (
//     // overlay
//     <div
//       onClick={handleClose}
//       className={`fixed inset-0 bg-[#282828]/50 flex justify-end z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
//     >
//       {/* popup drawer */}
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className={`bg-white w-[261px] sm:w-[500px] h-screen flex flex-col shadow-xl py-6 sm:py-11 px-3 sm:px-6 font-sans transform transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* cart items */}
//         <div className="flex-1 flex flex-col min-h-0">
//           <div className="flex items-center justify-between pb-6">
//             <h2 className="text-xl capitalize">my bag</h2>
//             <button onClick={handleClose} className="cursor-pointer">
//               <X />
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto font-montserrat">
//             {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
//               cartProducts.map((product) => (
//                 <div key={product.id} className="flex items-center gap-2 sm:gap-4 w-full py-3">
//                   {/* image - left*/}
//                   <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
//                     <img
//                       src={product.image || "/placeholder.svg"}
//                       alt={product.name}
//                       className="h-full w-full object-cover rounded"
//                     />
//                   </div>
//                   {/* right */}
//                   <div className="flex flex-col sm:gap-3 justify-between w-full">
//                     {/* description + items btn */}
//                     <div className="flex justify-between w-full">
//                       <p className="text-[8px] sm:text-sm w-[100px] sm:w-[200px]">
//                         {product.name} - {product?.variant}
//                       </p>
//                       <div className="flex items-center justify-between w-[50px] sm:w-[70px]">
//                         <span className="cursor-pointer" onClick={() => handledecreaseQuantity(product.id)}>
//                           <Minus size={14} />
//                         </span>
//                         <span className="text-sm sm:text-xl">{product.quantity}</span>
//                         <span className="cursor-pointer" onClick={() => handleIncreaseQuantity(product.id)}>
//                           <Plus size={14} />
//                         </span>
//                       </div>
//                     </div>
//                     {/* remove btn + price */}
//                     <div className="flex items-center justify-between text-sm">
//                       <button
//                         onClick={() => handleRemoveBtn(product.id)}
//                         className="uppercase cursor-pointer text-[10px] sm:text-sm text-gray-600 hover:text-red-600"
//                       >
//                         remove
//                       </button>
//                       <span className="text-[12px] sm:text-sm">€{product.price}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No Item in cart</p>
//             )}
//           </div>
//         </div>
//         <div className="flex-shrink-0 mt-6 sm:mt-0">
//           {/* divider */}
//           <div className="border-b border-[#A0A0A0] hidden sm:block my-4"></div>
//           {/* sub total */}
//           <div className="flex items-center justify-between w-full py-2">
//             <span className="text-xs sm:text-base">Subtotal</span>
//             <span className="font-medium text-base">€{subtotal}</span>
//           </div>
//           {/* delivery */}
//           <div className="flex items-center justify-between w-full pb-2 pt-2">
//             <span className="text-xs sm:text-base">Delivery</span>
//             <span className="font-medium text-base">€{delivery}</span>
//           </div>
//           {/* divider */}
//           <div className="border-b border-[#A0A0A0] my-4"></div>
//           {/* total */}
//           <div className="flex items-center justify-between w-full pb-2">
//             <span className="font-medium text-base">Total</span>
//             <span className="font-medium text-xl">€{total}</span>
//           </div>

//           <Button
//             onClick={handlePurchaseBtn}
//             className="bg-[#282828] text-white w-full my-3 hover:bg-transparent border hover:text-[#282828]"
//           >
//             purchase
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CartPopup
