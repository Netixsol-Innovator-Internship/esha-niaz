"use client";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      qty: 1,
      image:
        "https://via.placeholder.com/80x80.png?text=T-shirt", // replace with real image
    },
    {
      id: 2,
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      qty: 1,
      image:
        "https://via.placeholder.com/80x80.png?text=Shirt",
    },
    {
      id: 3,
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      qty: 1,
      image:
        "https://via.placeholder.com/80x80.png?text=Jeans",
    },
  ]);

  const handleQtyChange = (id, type) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: type === "inc" ? item.qty + 1 : item.qty > 1 ? item.qty - 1 : 1,
            }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = Math.round(subtotal * 0.2);
  const delivery = 15;
  const total = subtotal - discount + delivery;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">Home &gt; Cart</p>

      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-6">YOUR CART</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: {item.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    Color: {item.color}
                  </p>
                  <p className="font-semibold mt-1">${item.price}</p>
                </div>
              </div>

              {/* Quantity + Remove */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQtyChange(item.id, "dec")}
                  className="border px-2 py-1 rounded"
                >
                  <Minus size={16} />
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.id, "inc")}
                  className="border px-2 py-1 rounded"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal}</span>
          </div>
          <div className="flex justify-between text-red-500 mb-2">
            <span>Discount (-20%)</span>
            <span>- ${discount}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Delivery Fee</span>
            <span>${delivery}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>${total}</span>
          </div>

          {/* Promo Code */}
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Add promo code"
              className="border rounded-l-lg px-3 py-2 w-full focus:outline-none"
            />
            <button className="bg-black text-white px-4 py-2 rounded-r-lg">
              Apply
            </button>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
            Go to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
