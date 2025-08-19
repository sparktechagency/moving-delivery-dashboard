import React from "react";
import { Link } from "react-router-dom";

function UsersTable({ users }) {
  if (!users || users.length === 0)
    return <p className="p-4 text-gray-600">No users found</p>;

  return (
    <div className="overflow-x-auto">
      <div className="bg-[#4BADC9] flex justify-between text-white p-3 font-medium">
        <h1>Recent Users</h1>
        <Link to={'/user-management'}>View All</Link>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-[#C9E6ED] text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Serial</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? "bg-[#3A9CB9]" : "bg-[#4BADC9]"}>
              <td className="px-4 py-3 text-white">{index + 1}</td>
              <td className="px-4 py-3 text-white">{user.name}</td>
              <td className="px-4 py-3 text-white">{user.email}</td>
              <td className="px-4 py-3 text-white">{user.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
