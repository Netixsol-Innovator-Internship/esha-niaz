// "use client";

// import { useGetAllUsersQuery, useSetUserRoleMutation } from "../../../lib/services/api";
// import { useSelector } from "react-redux";
// import { selectAuth } from "../../../lib/slices/authSlice";

// export default function UsersPage() {
//   const { data: users, isLoading, isError } = useGetAllUsersQuery();
//   const [setUserRole] = useSetUserRoleMutation();
//   const { me } = useSelector(selectAuth);

//   const handleSetRole = async (userId, role) => {
//     try {
//       await setUserRole({ userId, role }).unwrap();
//       alert("Role updated!");
//     } catch (err) {
//       console.error("Failed to update role", err);
//       alert("Failed to update role");
//     }
//   };

//   if (isLoading) return <p className="p-6">Loading users...</p>;
//   if (isError) return <p className="p-6 text-red-500">Failed to load users.</p>;

//   return (
//     <div className="container-max py-8">
//       <h1 className="text-2xl font-bold mb-6">Users Management</h1>
//       <div className="overflow-x-auto bg-white border rounded-2xl shadow">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="px-4 py-2">Full Name</th>
//               <th className="px-4 py-2">Username</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Role</th>
//               <th className="px-4 py-2">Verified</th>
//               <th className="px-4 py-2">Loyalty Points</th>
//               {me?.role === "superadmin" && <th className="px-4 py-2">Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {users?.map((user) => (
//               <tr key={user._id} className="border-t">
//                 <td className="px-4 py-2">{user.fullName}</td>
//                 <td className="px-4 py-2">{user.username}</td>
//                 <td className="px-4 py-2">{user.email}</td>
//                 <td className="px-4 py-2">{user.role}</td>
//                 <td className="px-4 py-2">{user.verified ? "✅" : "❌"}</td>
//                 <td className="px-4 py-2">{user.loyaltyPoints}</td>
//                 {me?.role === "superadmin" && (
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => handleSetRole(user._id, "admin")}
//                       className="px-3 py-1 bg-black text-white rounded-full text-xs hover:bg-black/80"
//                     >
//                       Set Role
//                     </button>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



"use client";

import { useGetAllUsersQuery, useSetUserRoleMutation, useGetMeQuery } from "../../../lib/services/api";
import { useRouter } from "next/navigation"; // Next.js App Router

export default function UsersPage() {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  const [setUserRole] = useSetUserRoleMutation();
  
   const router = useRouter();

  // Get logged-in user info
  const { data: me, isLoading: meLoading } = useGetMeQuery();

  const handleSetRole = async (userId, newRole) => {
    try {
      await setUserRole({ userId, role: newRole }).unwrap();
      alert("Role updated!");
    } catch (err) {
      console.error("Failed to update role", err);
      alert("Failed to update role");
    }
  };

  if (isLoading || meLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load users.</p>;

  return (
    <div className="container-max py-8">
         {/* Back to Dashboard Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <div className="overflow-x-auto bg-white border rounded-2xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Verified</th>
              <th className="px-4 py-2">Loyalty Points</th>
              {me?.role?.toLowerCase() === "superadmin" && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              // Extra validations
              const canSetRole =
                me?.role?.toLowerCase() === "superadmin" && // logged-in user is superadmin
                user._id !== me._id &&                     // cannot change own role
                user.verified;                             // only for verified users

              return (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.verified ? "✅" : "❌"}</td>
                  <td className="px-4 py-2">{user.loyaltyPoints}</td>
                  {canSetRole && (
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          handleSetRole(user._id, user.role === "admin" ? "user" : "admin")
                        }
                        className="px-3 py-1 bg-black text-white rounded-full text-xs hover:bg-black/80"
                      >
                        {user.role === "admin" ? "Set as User" : "Set as Admin"}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
