"use client";

import { useGetMeQuery } from "../../lib/services/api";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        Failed to load profile. Please login again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Username</p>
            <p className="font-semibold text-gray-800">{user.username}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="font-semibold text-gray-800">{user.fullName}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
              {user.role}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Loyalty Points</p>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
              {user.loyaltyPoints} Points
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Verified</p>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                user.verified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.verified ? "Yes" : "No"}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="text-gray-700">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
