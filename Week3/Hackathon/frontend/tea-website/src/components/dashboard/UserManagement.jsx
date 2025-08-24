"use client"

import { useSelector } from "react-redux"
import { getUser } from "../../redux/slices/auth/authSlice"
import {
  useGetAllUsersQuery,
  useChangeUserRoleMutation,
  useBlockUnblockUserMutation,
} from "../../redux/slices/admin/adminApi"
import { useState } from "react"
// import Modal from "./Modal"

const UserManagement = () => {
  const user = useSelector(getUser)
  // const [showConfirmModal, setShowConfirmModal] = useState(false)
  // const [confirmAction, setConfirmAction] = useState(null)

  const { data, isLoading, error } = useGetAllUsersQuery()
  const users = data?.data || []

  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation()
  const [blockUnblockUser, { isLoading: isBlockingUser }] = useBlockUnblockUserMutation()

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction.action()
      setShowConfirmModal(false)
      setConfirmAction(null)
    }
  }

  // const toggleBlock = async (userId, userName, isBlocked) => {
  //   setConfirmAction({
  //     title: isBlocked ? "Unblock User" : "Block User",
  //     message: `Are you sure you want to ${isBlocked ? "unblock" : "block"} ${userName}?`,
  //     action: async () => {
  //       try {
  //         await blockUnblockUser({ userId, blocked: !isBlocked }).unwrap()
  //       } catch (error) {
  //         console.error("Failed to block/unblock user:", error)
  //       }
  //     },
  //   })
  //   setShowConfirmModal(true)
  // }
  const toggleBlock = async (userId, userName, isBlocked) => {
  const confirmMessage = `Are you sure you want to ${isBlocked ? "unblock" : "block"} ${userName}?`

  if (window.confirm(confirmMessage)) {
    try {
      await blockUnblockUser({ userId, blocked: !isBlocked }).unwrap()
    } catch (error) {
      console.error("Failed to block/unblock user:", error)
    }
  }
}


  // const changeRole = async (userId, role, userName, currentRole) => {
  //   if (role === currentRole) return

  //   setConfirmAction({
  //     title: "Change User Role",
  //     message: `Are you sure you want to change ${userName}'s role from ${currentRole} to ${role}?`,
  //     action: async () => {
  //       try {
  //         await changeUserRole({ userId, role }).unwrap()
  //       } catch (error) {
  //         console.error("Failed to change user role:", error)
  //       }
  //     },
  //   })
  //   setShowConfirmModal(true)
  // }

  const changeRole = async (userId, role, userName, currentRole) => {
  if (role === currentRole) return

  const confirmMessage = `Are you sure you want to change ${userName}'s role from ${currentRole} to ${role}?`

  if (window.confirm(confirmMessage)) {
    try {
      await changeUserRole({ userId, role }).unwrap()
    } catch (error) {
      console.error("Failed to change user role:", error)
    }
  }
}



  const getAvailableRoles = (targetUser) => {
    if (user?.role === "superAdmin") {
      if (targetUser._id === user._id) return []
      return ["user", "admin", "superAdmin"]
    } else if (user?.role === "admin") {
      if (targetUser.role !== "user") return []
      return ["user", "admin"]
    }
    return []
  }

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "superAdmin":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
      case "admin":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/25"
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading Users</p>
            <p className="text-gray-500">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div> */}
            {/* <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              User Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage user roles and permissions across your platform with ease
            </p> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Admins</p>
                  <p className="text-3xl font-bold text-gray-900">{users.filter((u) => u.role === "admin").length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Blocked</p>
                  <p className="text-3xl font-bold text-gray-900">{users.filter((u) => u.isBlocked).length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((u, index) => (
            <div
              key={u._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div className="relative p-6 pb-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>

                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {u.name}
                      </h3>
                      <p className="text-gray-500 text-sm truncate">{u.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${getRoleBadgeStyle(u.role)} transform hover:scale-105 transition-transform duration-200`}
                  >
                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transform hover:scale-105 transition-transform duration-200 ${
                      u.isBlocked
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                    }`}
                  >
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {getAvailableRoles(u).length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Change Role</label>
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value, u.name, u.role)}
                        disabled={isChangingRole}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm text-gray-900 transition-all duration-200 hover:border-blue-300"
                      >
                        {getAvailableRoles(u).map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(user?.role === "superAdmin" || (user?.role === "admin" && u.role === "user")) &&
                    u.role !== "superAdmin" && (
                      <button
                        onClick={() => toggleBlock(u._id, u.name, u.isBlocked)}
                        disabled={isBlockingUser}
                        className={`w-full px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg ${
                          u.isBlocked
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25"
                            : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/25"
                        }`}
                      >
                        {isBlockingUser ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : u.isBlocked ? (
                          "Unblock User"
                        ) : (
                          "Block User"
                        )}
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Users Found</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              There are no users to manage at the moment. Users will appear here once they register.
            </p>
          </div>
        )}
      </div>

      {/* {showConfirmModal && (
        // <Modal onClose={() => setShowConfirmModal(false)}>
        //   <div className="text-center p-2">
        //     <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
        //       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //         <path
        //           strokeLinecap="round"
        //           strokeLinejoin="round"
        //           strokeWidth={2}
        //           d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        //         />
        //       </svg>
        //     </div>
        //     <h3 className="text-2xl font-semibold text-gray-900 mb-4">{confirmAction?.title}</h3>
        //     <p className="text-gray-600 mb-8 text-lg">{confirmAction?.message}</p>
        //     <div className="flex gap-4 justify-center">
        //       <button
        //         onClick={() => setShowConfirmModal(false)}
        //         className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
        //       >
        //         Cancel
        //       </button>
        //       <button
        //         onClick={handleConfirmAction}
        //         className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
        //       >
        //         Confirm
        //       </button>
        //     </div>
        //   </div>
        // </Modal>
      )} */}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default UserManagement
