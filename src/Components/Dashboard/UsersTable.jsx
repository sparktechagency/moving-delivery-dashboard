import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllUsersQuery } from "../../features/api/userManagementApi";

function UsersTable() {
  const { data, isLoading, error } = useGetAllUsersQuery();
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const allUsers = data?.data?.all_users || [];

    if (Array.isArray(allUsers)) {
      // Format users same as UserManagement
      const formatted = allUsers.map((user, index) => ({
        id: user._id || index + 1,
        name: user.name || "No Name",
        email: user.email || "No Email",
        phoneNumber: user.phoneNumber || "N/A",
        accType: user.role || "User",

        createdAt: new Date(user.createdAt),
      }));

      // Sort by latest createdAt
      const sorted = formatted.sort((a, b) => b.createdAt - a.createdAt);

      // Get only the latest 6 users
      setLatestUsers(sorted.slice(0, 6));
    }
  }, [data]);

  if (isLoading) return <p className="p-4 text-gray-600">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load users</p>;

  if (!latestUsers || latestUsers.length === 0)
    return <p className="p-4 text-gray-600">No users found</p>;

  return (
    <div className="overflow-x-auto">
      <div className="bg-[#4BADC9] flex justify-between text-white p-3 font-medium">
        <h1>Recent Users</h1>
        <Link to="/user-management">View All</Link>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-[#C9E6ED] text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Serial</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Acc Type</th>
          </tr>
        </thead>

        <tbody>
          {latestUsers.map((user, index) => (
            <tr
              key={user.id}
              className={index % 2 === 0 ? "bg-[#3A9CB9]" : "bg-[#4BADC9]"}
            >
              <td className="px-4 py-3 text-white">{index + 1}</td>
              <td className="px-4 py-3 text-white">{user.name}</td>
              <td className="px-4 py-3 text-white">{user.email}</td>
              <td className="px-4 py-3 text-white">{user.phoneNumber}</td>
              <td className="px-4 py-3 text-white">{user.accType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
