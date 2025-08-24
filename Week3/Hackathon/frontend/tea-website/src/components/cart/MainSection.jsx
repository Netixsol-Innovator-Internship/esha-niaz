// "use client"

// import { useState } from "react"
// import CartItems from "./CartItems"
// import OrderSummary from "./OrderSummary"
// import { useNavigate } from "react-router-dom"
// import Button from "../shared/buttons/button"
// import { useSelector } from "react-redux"
// import { selectCartItems } from "../../redux/slices/cart/cartSlice"
// import { selectCartTotalAmount } from "../../redux/slices/cart/cartSlice"

// const MainSection = () => {
//   const cartProducts = useSelector(selectCartItems)
//   const subtotal = useSelector(selectCartTotalAmount)
//   const [delivery] = useState(3.5)
//   const total = subtotal + delivery
//   const navigate = useNavigate()

//   const handleShoppingBtn = () => {
//     navigate("/collections")
//   }

//   return (
//     <div className="py-6 flex flex-col lg:flex-row items-center lg:items-start justify-between">
//       {cartProducts.length > 0 ? (
//         <>
//           <CartItems subtotal={subtotal} cartProducts={cartProducts} />
//           <OrderSummary subtotal={subtotal} total={total} delivery={delivery} />
//         </>
//       ) : (
//         <div className="w-full flex flex-col items-center justify-center">
//           <p className="text-center py-12 text-lg font-montserrat">No Item in cart</p>
//           <div className="flex items-center justify-center w-full">
//             <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
//               back to shopping
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default MainSection






// "use client"

// import { useState } from "react"
// import CartItems from "./CartItems"
// import OrderSummary from "./OrderSummary"
// import { useNavigate } from "react-router-dom"
// import Button from "../shared/buttons/button"
// import { useSelector } from "react-redux"
// import { selectCartItems } from "../../redux/slices/cart/cartSlice"
// import { selectCartTotalAmount } from "../../redux/slices/cart/cartSlice"

// const MainSection = () => {
//   const cartProducts = useSelector(selectCartItems)
//   const subtotal = useSelector(selectCartTotalAmount)
//   const [delivery] = useState(3.5)
//   const total = subtotal + delivery
//   const navigate = useNavigate()

//   const handleShoppingBtn = () => {
//     navigate("/collections")
//   }

//   return (
//     <div className="py-6 flex flex-col lg:flex-row items-center lg:items-start justify-between">
//       {cartProducts.length > 0 ? (
//         <>
//           <CartItems subtotal={subtotal} cartProducts={cartProducts} />
//           <OrderSummary subtotal={subtotal} total={total} delivery={delivery} />
//         </>
//       ) : (
//         <div className="w-full flex flex-col items-center justify-center">
//           <p className="text-center py-12 text-lg font-montserrat">No Item in cart</p>
//           <div className="flex items-center justify-center w-full">
//             <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
//               back to shopping
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default MainSection




"use client"

import { useState } from "react"
import CartItems from "./CartItems"
import OrderSummary from "./OrderSummary"
import { useNavigate } from "react-router-dom"
import Button from "../shared/buttons/button"
import { useSelector } from "react-redux"
import { selectCartItems } from "../../redux/slices/cart/cartSlice"
import { selectCartTotalAmount } from "../../redux/slices/cart/cartSlice"

const MainSection = () => {
  const cartProducts = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartTotalAmount)
  const [delivery] = useState(3.5)
  const total = subtotal + delivery
  const navigate = useNavigate()

  const handleShoppingBtn = () => {
    navigate("/collections")
  }

  return (
    <div className="py-6 flex flex-col lg:flex-row items-center lg:items-start justify-between">
      {cartProducts.length > 0 ? (
        <>
          <CartItems subtotal={subtotal} cartProducts={cartProducts} />
          <OrderSummary subtotal={subtotal} total={total} delivery={delivery} />
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-center py-12 text-lg font-montserrat">No Item in cart</p>
          <div className="flex items-center justify-center w-full">
            <Button className="border hover:bg-[#282828] hover:text-white" onClick={handleShoppingBtn}>
              back to shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainSection
