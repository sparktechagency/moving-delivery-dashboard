import React, { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from "../../features/api/userManagementApi";
import { notification } from "antd"; // Import notification from Ant Design

function UserManagement() {
  const { data, isLoading, error } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 14;

  useEffect(() => {
    const allUsers = data?.data?.all_users || [];
    if (Array.isArray(allUsers)) {
      const formattedUsers = allUsers.map((user, index) => ({
        id: user.id,
        name: user.name || "No Name",
        email: user.email || "No Email",
        date: new Date(user.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        accType: user.role || "User",
        status: user.status || "blocked", // Assuming 'blocked' as default
      }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    }
  }, [data]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase()) ||
          user.accType.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleBlockUnblockUser = async (user) => {
    const newStatus = user.status === "isProgress" ? "blocked" : "isProgress";
    try {
      await updateUserStatus({ userId: user.id, status: newStatus }).unwrap();
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      // Show Ant Design notification
      notification.success({
        message: `${user.name} has been ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`,
        description: `User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully!`,
        placement: "topRight",
      });
    } catch (err) {
      console.error("Error updating user status:", err);
      notification.error({
        message: "Failed to update user status",
        description: "There was an error while updating the user status.",
        placement: "topRight",
      });
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  if (isLoading)
    return <div className="mt-10 text-center">Loading users...</div>;
  if (error)
    return (
      <div className="mt-10 text-center text-red-500">
        Failed to load users.
      </div>
    );

  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-[#E0F2F7] mt-16">
        <div className="bg-[#4BADC9] p-4 flex justify-end">
          <div className="w-72">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-[#4BADC9]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E0F2F7] text-gray-700">
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Acc Type</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index} className="bg-[#4BADC9]">
                  <td className="px-4 text-white">
                    {(index + 1).toString().padStart(2, "0")}
                  </td> {/* Format serial number */}
                  <td className="px-4 text-white">{user.name}</td>
                  <td className="px-4 text-white">{user.email}</td>
                  <td className="px-4 text-white">{user.date}</td>
                  <td className="px-4 text-white">{user.accType}</td>
                  <td className="flex px-4 py-3 space-x-4">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-white hover:text-gray-200"
                    >
                      <EyeOutlined size={20} />
                    </button>
                    <button
                      onClick={() => handleBlockUnblockUser(user)}
                      className={`text-${
                        user.status === "isProgress" ? "green" : "red"
                      }-500 hover:text-${
                        user.status === "isProgress" ? "green" : "red"
                      }-300`}
                    >
                      <MdBlock size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end py-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 mx-1 text-black rounded-full disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <IoIosArrowBack size={20} />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded-full ${
                currentPage === index + 1
                  ? "text-red-500"
                  : "bg-transparent text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 mx-1 text-black rounded-full disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* View Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-4 overflow-hidden bg-white rounded-md">
            <div className="relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute p-1 text-white rounded-full right-2 top-2 bg-white/10 hover:bg-white/20"
              >
                <IoMdClose />
              </button>

              <div className="bg-[#52B5D1] p-6 text-center rounded-md">
                <h2 className="text-xl font-bold text-white">
                  {selectedUser.name}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="w-2/3">
                      <h3 className="font-bold text-black ">Email</h3>
                      <p className="text-gray-700">{selectedUser.email}</p>
                    </div>
                    <div className="w-1/3">
                      <h3 className="font-bold text-black">Account Type</h3>
                      <p className="text-gray-700">{selectedUser.accType}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-2/3">
                      <h3 className="font-bold text-black">Date Joined</h3>
                      <p className="text-gray-700">{selectedUser.date}</p>
                    </div>
                    <div className="w-1/3">
                      <h3 className="font-bold text-black">Location</h3>
                      <p className="text-gray-700">USA</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 font-semibold text-black">Attach File</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement;
