'use client';

import { useGetRecentOrdersQuery, useUpdateOrderStatusMutation } from '../../../lib/services/api';
import { useState } from 'react';
import { useRouter } from "next/navigation"; // Next.js App Router

export default function OrdersPage() {
  const { data: orders, isLoading, refetch } = useGetRecentOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
    const router = useRouter();
  
  if (isLoading) return <p>Loading Orders...</p>;

  const activeOrders = orders.filter(o => o.status === 'active');
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');

  const handleStatusChange = async (orderId, status) => {
    await updateStatus({ id: orderId, status });
    refetch();
  };

  return (
    <div className="container-max py-10">
                       {/* Back to Dashboard Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>


      {/* Active Orders */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Active Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeOrders.map(order => (
            <div key={order._id} className="border rounded-xl shadow-lg p-4 bg-white">
              <p className="font-semibold mb-2">Order ID: {order._id}</p>
              <p>User ID: {order.userId}</p>
              <p>Status: <span className="text-blue-600 font-semibold">{order.status}</span></p>
              <div className="mt-2">
                <h3 className="font-semibold">Items:</h3>
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between border-b py-1">
                    <span>{item.name} ({item.selectedSize}, {item.selectedColor})</span>
                    <span>{item.quantity} x ${item.unitPrice}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2">Total: ${order.total}</p>
              <p>Payment: {order.paymentMethod}</p>
              <p>Address: {order.address.street}, {order.address.city}, {order.address.zip}, {order.address.country}</p>

              {/* Status change buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleStatusChange(order._id, 'delivered')}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() => handleStatusChange(order._id, 'completed')}
                  className="px-3 py-1 bg-indigo-500 text-white rounded"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed / Delivered Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Completed / Delivered Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedOrders.map(order => (
            <div key={order._id} className="border rounded-xl shadow-lg p-4 bg-gray-50">
              <p className="font-semibold mb-2">Order ID: {order._id}</p>
              <p>User ID: {order.userId}</p>
              <p>Status: <span className="text-green-600 font-semibold">{order.status}</span></p>
              <div className="mt-2">
                <h3 className="font-semibold">Items:</h3>
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between border-b py-1">
                    <span>{item.name} ({item.selectedSize}, {item.selectedColor})</span>
                    <span>{item.quantity} x ${item.unitPrice}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2">Total: ${order.total}</p>
              <p>Payment: {order.paymentMethod}</p>
              <p>Address: {order.address.street}, {order.address.city}, {order.address.zip}, {order.address.country}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
