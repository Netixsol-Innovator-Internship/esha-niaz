// // app/dashboard/page.jsx
// "use client";

// export default function DashboardPage() {
//   return (
//     <div className="container-max py-10">
//       <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
//       <p className="text-gray-600 mb-6">Simple starter dashboard page (static).</p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="p-6 bg-white border rounded-2xl shadow-sm">
//           <h3 className="text-sm text-gray-500">Users</h3>
//           <p className="text-2xl font-bold mt-2">—</p>
//           <p className="text-xs text-gray-400 mt-1">Total registered users</p>
//         </div>

//         <div className="p-6 bg-white border rounded-2xl shadow-sm">
//           <h3 className="text-sm text-gray-500">Orders</h3>
//           <p className="text-2xl font-bold mt-2">—</p>
//           <p className="text-xs text-gray-400 mt-1">Orders placed</p>
//         </div>

//         <div className="p-6 bg-white border rounded-2xl shadow-sm">
//           <h3 className="text-sm text-gray-500">Products</h3>
//           <p className="text-2xl font-bold mt-2">—</p>
//           <p className="text-xs text-gray-400 mt-1">Active products</p>
//         </div>
//       </div>

//       <div className="mt-8 p-6 bg-white border rounded-2xl shadow-sm">
//         <h2 className="text-lg font-semibold mb-2">Quick links</h2>
//         <div className="flex gap-3 flex-wrap">
//           <a className="px-4 py-2 bg-gray-100 rounded-full text-sm" href="/dashboard/users">Users</a>
//           <a className="px-4 py-2 bg-gray-100 rounded-full text-sm" href="/dashboard/orders">Orders</a>
//           <a className="px-4 py-2 bg-gray-100 rounded-full text-sm" href="/dashboard/products">Products</a>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useGetAllUsersQuery, useGetProductsQuery, useGetRecentOrdersQuery } from "../../lib/services/api";

export default function DashboardPage() {
  const { data: users, isLoading: loadingUsers, isError: errorUsers } = useGetAllUsersQuery();
  const { data: products, isLoading: loadingProducts, isError: errorProducts } = useGetProductsQuery();
  const { data: orders, isLoading: loadingOrders, isError: errorOrders } = useGetRecentOrdersQuery();

  // Total users count
  const usersCount = users?.length || 0;

  // Total products count
  const productsCount = products?.length || 0;

  // Count only active orders
  const activeOrdersCount = orders?.filter(o => o.status === "active")?.length || 0;

  return (
    <div className="container-max py-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {/* <p className="text-gray-600 mb-6">Simple starter dashboard page.</p> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Card */}
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
          <h3 className="text-sm text-gray-500">Users</h3>
          <p className="text-2xl font-bold mt-2">
            {loadingUsers ? "..." : errorUsers ? "!" : usersCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total registered users</p>
        </div>

        {/* Orders Card */}
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
          <h3 className="text-sm text-gray-500">Orders</h3>
          <p className="text-2xl font-bold mt-2">
            {loadingOrders ? "..." : errorOrders ? "!" : activeOrdersCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Active orders</p>
        </div>

        {/* Products Card */}
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
          <h3 className="text-sm text-gray-500">Products</h3>
          <p className="text-2xl font-bold mt-2">
            {loadingProducts ? "..." : errorProducts ? "!" : productsCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total products</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-20 p-6 bg-white border rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Quick links</h2>
        <div className="flex gap-3 flex-wrap">
          <a className="px-4 py-2 bg-gray-100 rounded-full text-sm" href="/dashboard/users">Users</a>
          <a className="px-4 py-2 bg-gray-100 rounded-full text-sm" href="/dashboard/orders">Orders</a>
          <a className="px-4 py-2 bg-gray-100 rounded-full text-sm" href="/dashboard/products">Products</a>
        </div>
      </div>
    </div>
  );
}
