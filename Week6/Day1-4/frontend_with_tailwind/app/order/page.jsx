// "use client";
// import { useState } from "react";
//  import { useCreateOrderMutation, useGetMyOrdersQuery } from "../../lib/services/api";

// export default function OrderPage() {
//   const [cartId, setCartId] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     zip: "",
//     country: "",
//   });

//   const [createOrder, { isLoading }] = useCreateOrderMutation();
// const { data: orders, isFetching } = useGetMyOrdersQuery();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createOrder({ cartId, paymentMethod, address }).unwrap();
//       alert("Order placed successfully!");
//       setCartId("");
//       setAddress({ street: "", city: "", zip: "", country: "" });
//     } catch (err) {
//       alert(err?.data?.message || "Order failed!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
//         {/* Order Form */}
//         <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Place New Order</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
            
//             <input
//               type="text"
//               placeholder="Cart ID"
//               value={cartId}
//               onChange={(e) => setCartId(e.target.value)}
//               className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
//               required
//             />

//             {/* Payment Method */}
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="card">Card</option>
//               <option value="cod">Cash on Delivery</option>
//               <option value="points">Points</option>
//               <option value="hybrid">Hybrid</option>
//             </select>

//             {/* Address Fields */}
//             {["street", "city", "zip", "country"].map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                 value={address[field]}
//                 onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
//                 className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             ))}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow transition"
//             >
//               {isLoading ? "Placing Order..." : "Place Order"}
//             </button>
//           </form>
//         </div>

//         {/* My Orders */}
//         <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

//           {isFetching ? (
//             <p className="text-gray-500">Loading orders...</p>
//           ) : orders?.length === 0 ? (
//             <p className="text-gray-500">No orders yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {orders?.map((order) => (
//                 <div key={order._id} className="p-5 border rounded-xl hover:shadow-lg transition">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-lg font-semibold text-gray-700">
//                       Order #{order._id.slice(-6)}
//                     </h3>
//                     <span
//                       className={`font-bold px-3 py-1 rounded-lg text-sm ${
//                         order.status === "completed"
//                           ? "bg-green-100 text-green-700"
//                           : order.status === "delivered"
//                           ? "bg-blue-100 text-blue-700"
//                           : order.status === "canceled"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {order.status.toUpperCase()}
//                     </span>
//                   </div>
//                   <p className="text-gray-600">Payment: {order.paymentMethod}</p>
//                   <p className="text-gray-600">Total: Rs {order.total}</p>
//                   <p className="text-gray-600 text-sm">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </p>
//                   <div className="mt-3 text-sm text-gray-500">
//                     {order.items.map((it, idx) => (
//                       <div key={idx} className="flex justify-between">
//                         <span>{it.name} ({it.quantity}x)</span>
//                         <span>Rs {it.unitPrice * it.quantity}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";
import { useState, useEffect } from "react";
import {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetCartQuery,
} from "../../lib/services/api";

export default function OrderPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  const { data: cart, isFetching: cartLoading } = useGetCartQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: orders, isFetching } = useGetMyOrdersQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({
        cartId: cart?._id, // ✅ use fetched cartId automatically
        paymentMethod,
        address,
      }).unwrap();

      alert("Order placed successfully!");
      setAddress({ street: "", city: "", zip: "", country: "" });
    } catch (err) {
      alert(err?.data?.message || "Order failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Order Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Place New Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Show cartId (readonly) */}
            <input
              type="text"
              value={cartLoading ? "Loading cart..." : cart?._id || "No active cart"}
              readOnly
              className="w-full p-3 rounded-lg border bg-gray-100 text-gray-600"
            />

            {/* Payment Method */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
            >
              <option value="card">Card</option>
              <option value="cod">Cash on Delivery</option>
              <option value="points">Points</option>
              <option value="hybrid">Hybrid</option>
            </select>

            {/* Address Fields */}
            {["street", "city", "zip", "country"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field]}
                onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}

            <button
              type="submit"
              disabled={isLoading || !cart?._id}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow transition"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* My Orders */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
          {isFetching ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders?.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders?.map((order) => (
                <div key={order._id} className="p-5 border rounded-xl hover:shadow-lg transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <span
                      className={`font-bold px-3 py-1 rounded-lg text-sm ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "delivered"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600">Payment: {order.paymentMethod}</p>
                  <p className="text-gray-600">Total: Rs {order.total}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-3 text-sm text-gray-500">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {it.name} ({it.quantity}x)
                        </span>
                        <span>Rs {it.unitPrice * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
