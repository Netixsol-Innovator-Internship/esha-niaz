"use client";
import { Minus, Plus, Trash2, X } from "lucide-react"; // 👈 Added X
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCartQuery,
  useIncrementCartMutation,
  useDecrementCartMutation,
  useRemoveCartMutation,
  useGetProductByIdQuery,
} from "../lib/services/api";

function CartItem({ item, increment, decrement, remove }) {
  const { data: product } = useGetProductByIdQuery(item.productId);

  return (
    <div className="flex items-center justify-between border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={product?.variants?.[0]?.images?.[0] || "/placeholder.png"}
          alt={product?.name || "Product"}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div>
          <h3 className="font-semibold">{product?.name}</h3>
          <p className="text-sm text-gray-500">Size: {item.selectedSize || "-"}</p>
          <p className="text-sm text-gray-500">Color: {item.selectedColor || "-"}</p>
          <p className="font-semibold mt-1">${product?.effectivePrice || "0"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            decrement({
              productId: item.productId,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
            })
          }
          className="border px-2 py-1 rounded"
        >
          <Minus size={16} />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() =>
            increment({
              productId: item.productId,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
            })
          }
          className="border px-2 py-1 rounded"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => remove({ productId: item.productId })}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function CartPage({ onClose }) {
  const { data, isLoading } = useGetCartQuery();
  const [increment] = useIncrementCartMutation();
  const [decrement] = useDecrementCartMutation();
  const [remove] = useRemoveCartMutation();
   const router = useRouter();

  if (isLoading) {
    return <p className="p-6">Loading cart...</p>;
  }

  if (!data?.items?.length) {
    return (
      <div className="relative max-w-6xl mx-auto px-6 py-12 text-center">
        {/* Cross button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button> */}

        <h1 className="text-2xl font-bold mb-4">Your cart is empty 🛒</h1>
        <p className="text-gray-600">Start shopping to add items to your cart.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-8">
      {/* Cross button */}
      {/* <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
      >
        <X size={20} />
      </button> */}

      <p className="text-sm text-gray-500 mb-4">Home &gt; Cart</p>
      <h1 className="text-3xl font-extrabold mb-6">YOUR CART</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {data.items.map((item) => (
            <CartItem
              key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
              item={item}
              increment={increment}
              decrement={decrement}
              remove={remove}
            />
          ))}
        </div>

        <div className="border rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span className="font-semibold">${data.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Delivery Fee</span>
            <span>${data.deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>${data.total}</span>
          </div>

 {/* ✅ Redirect to /order when checkout */}
          <button
            onClick={() => {
    if (onClose) onClose(); // ✅ close popup first
    router.push("/order");   // ✅ then navigate
  }}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Go to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
