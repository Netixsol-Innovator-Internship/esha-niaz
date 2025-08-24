"use client"

import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { getUser } from "../../redux/slices/auth/authSlice"

const DashboardPage = () => {
  const user = useSelector(getUser)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl">
        <div className="backdrop-blur-sm bg-white/10 border-b border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-center p-6 max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-blue-100 text-sm">Manage your e-commerce platform</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <p className="text-sm text-blue-100">Welcome back!</p>
                <p className="font-semibold text-white">
                  Logged in as{" "}
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold ml-1">
                    {user?.role}
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="group relative px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>Go to Store</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <NavLink
              to="/dashboard/products"
              className={({ isActive }) =>
                `group relative px-6 py-4 font-medium transition-all duration-300 ${
                  isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-2">
                    <svg
                      className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span>Product Management</span>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>

            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `group relative px-6 py-4 font-medium transition-all duration-300 ${
                  isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-2">
                    <svg
                      className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <span>User Management</span>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 min-h-[600px] overflow-hidden">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  )
}

export default DashboardPage
