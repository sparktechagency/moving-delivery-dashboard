import React, { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "../../features/api/userManagementApi";
import { notification } from "antd";

function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10; // Match your API's limit

  // Fetch users with pagination parameters
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = data?.data?.all_users || [];
  const meta = data?.data?.meta || { total: 0, totalPage: 1, page: 1 };

  // Format users for display
  const formattedUsers = users.map((user, index) => ({
    id: user.id,
    name: user.name || "No Name",
    email: user.email || "No Email",
    date: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A",
    accType: user.role || "User",
    status: user.status || "blocked",
    location: user.location || "N/A",
    isVerify: user.isVerify,
    phoneNumber: user.phoneNumber,
  }));

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  // Trigger search after typing stops (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);

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

      // Refetch the current page to update the data
      refetch();

      notification.success({
        message: `${user.name} has been ${
          newStatus === "blocked" ? "blocked" : "unblocked"
        }`,
        description: `User ${
          newStatus === "blocked" ? "blocked" : "unblocked"
        } successfully!`,
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

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = meta.totalPage;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calculate display range
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, meta.total);

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
              placeholder="Search by name, email, or role..."
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
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {formattedUsers.length > 0 ? (
                formattedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bg-[#4BADC9] border-b border-[#3a9bb3]"
                  >
                    <td className="px-4 py-3 text-white">
                      {(startIndex + index).toString().padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3 text-white">{user.name}</td>
                    <td className="px-4 py-3 text-white">{user.email}</td>
                    <td className="px-4 py-3 text-white">{user.date}</td>
                    <td className="px-4 py-3 text-white capitalize">
                      {user.accType}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "isProgress"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {user.status === "isProgress" ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="flex px-4 py-3 space-x-4">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-white transition-colors hover:text-gray-200"
                        title="View User"
                      >
                        <EyeOutlined size={20} />
                      </button>
                      <button
                        onClick={() => handleBlockUnblockUser(user)}
                        className={`transition-colors ${
                          user.status === "isProgress"
                            ? "text-red-400 hover:text-red-300"
                            : "text-green-400 hover:text-green-300"
                        }`}
                        title={
                          user.status === "isProgress"
                            ? "Block User"
                            : "Unblock User"
                        }
                      >
                        <MdBlock size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-white">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#E0F2F7]">
          <div className="text-sm text-gray-600">
            Showing {formattedUsers.length > 0 ? startIndex : 0} to {endIndex}{" "}
            of {meta.total} users
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="flex items-center justify-center w-8 h-8 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              title="Previous page"
            >
              <IoIosArrowBack size={18} />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`min-w-[32px] h-8 px-2 rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-[#4BADC9] text-white font-semibold"
                    : page === "..."
                    ? "bg-transparent text-gray-400 cursor-default"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="flex items-center justify-center w-8 h-8 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === meta.totalPage}
              title="Next page"
            >
              <IoIosArrowForward size={18} />
            </button>
          </div>
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
                      <h3 className="font-bold text-black">Email</h3>
                      <p className="text-gray-700">{selectedUser.email}</p>
                    </div>
                    <div className="w-1/3">
                      <h3 className="font-bold text-black">Account Type</h3>
                      <p className="text-gray-700 capitalize">
                        {selectedUser.accType}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-2/3">
                      <h3 className="font-bold text-black">Phone Number</h3>
                      <p className="text-gray-700">
                        {selectedUser.phoneNumber}
                      </p>
                    </div>
                    <div className="w-1/3">
                      <h3 className="font-bold text-black">Verified</h3>
                      <p className="text-gray-700">
                        {selectedUser.isVerify ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-2/3">
                      <h3 className="font-bold text-black">Date Joined</h3>
                      <p className="text-gray-700">{selectedUser.date}</p>
                    </div>
                    <div className="w-1/3">
                      <h3 className="font-bold text-black">Location</h3>
                      <p className="text-gray-700">
                        {selectedUser.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-black">Status</h3>
                    <p
                      className={`inline-block px-3 py-1 mt-1 text-sm rounded-full ${
                        selectedUser.status === "isProgress"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedUser.status === "isProgress"
                        ? "Active"
                        : "Blocked"}
                    </p>
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
