import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { useGetAllPaymentsQuery } from "../../features/api/allPayment";

function Earnings() {
  const { data, isLoading, isError } = useGetAllPaymentsQuery({
    page: 1,
    limit: 10,
  });

  console.log(data)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBlock, setIsModalBlock] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 14;

  // Use a useEffect hook to update filteredUsers when data is fetched
  useEffect(() => {
    if (data && data.data && data.data.payments) {
      setFilteredUsers(data.data.payments);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  // for user search functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (data && data.data && data.data.payments) {
      if (term.trim() === "") {
        setFilteredUsers(data.data.payments);
      } else {
        const filtered = data.data.payments.filter(
          (user) =>
            user.payable_name.toLowerCase().includes(term.toLowerCase()) ||
            user.payable_email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }
    setCurrentPage(1);
  };

  // for pagination functionality
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

  const handleBlockUser = (user) => {
    setSelectedUser(user);
    setIsModalBlock(true);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-[#E0F2F7] mt-16">
        {/* Header with search */}
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

        {/* Table */}
        <div className="overflow-x-auto bg-[#4BADC9]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E0F2F7] text-gray-700">
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Date</th>
                {/* <th className="px-4 py-3 text-left">Acc Type</th> */}
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index} className="bg-[#4BADC9]">
                  <td className="px-4 text-white">
                    {index + 1 + indexOfFirstUser}
                  </td>
                  <td className="px-4 text-white">{user.payable_name}</td>
                  <td className="px-4 text-white">{user.payable_email}</td>
                  <td className="px-4 text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  {/* <td className="px-4 text-white">
                    {user.driverId}
                  </td> */}
                  <td className="flex px-4 py-3 space-x-4">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-white hover:text-gray-200"
                    >
                      <EyeOutlined size={20} />
                    </button>
                    <button
                      onClick={() => handleBlockUser(user)}
                      className="text-red-500 hover:text-red-300"
                    >
                      <MdBlock size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* ================= Modal for Payment Details ============= */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b">
              <h2 className="text-xl font-bold text-[#39b4c0]">
                Payment Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-600 hover:text-black"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {/* User & Payment Info */}
            <div className="space-y-6">
              {/* Top Profile Card */}
              <div className="flex items-center gap-4 p-4 bg-[#E0F2F7] rounded-lg">
                {/* <img
                  src={userImage}
                  className="w-16 h-16 rounded-full border-2 border-[#39b4c0]"
                  alt="User"
                /> */}
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedUser.payable_name}
                  </h3>
                  
                  <p className="text-gray-600">{selectedUser.payable_email}</p>
                  <p className="text-sm text-gray-500">
                    Account Type:{" "}
                    {selectedUser.driverId &&
                    Object.keys(selectedUser.driverId).length > 0
                      ? "Driver"
                      : "User"}
                  </p>
                </div>
              </div>

              {/* Payment Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">Amount</h4>
                  <p className="text-gray-900">
                    {selectedUser.price} {selectedUser.currency.toUpperCase()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">
                    Payment Method
                  </h4>
                  <p className="text-gray-900">{selectedUser.paymentmethod}</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">
                    Payment Status
                  </h4>
                  <p
                    className={`font-bold ${
                      selectedUser.payment_status === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedUser.payment_status}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">Date</h4>
                  <p className="text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">Driver Amount</h4>
                  <p className="text-gray-900">{selectedUser.driverAmount}</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">Admin Amount</h4>
                  <p className="text-gray-900">{selectedUser.adminAmount}</p>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-700">Description</h4>
                <p className="text-gray-900">{selectedUser.description}</p>
              </div>

              {/* Extra Fields */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">
                    Payment Intent
                  </h4>
                  <p className="text-gray-900 break-all">
                    {selectedUser.payment_intent}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">Session ID</h4>
                  <p className="text-gray-900 break-all">
                    {selectedUser.sessionId}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-700">Country</h4>
                <p className="text-gray-900">{selectedUser.country}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= Modal for Block Users ============= */}
      {isModalBlock && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md overflow-hidden bg-white rounded-md">
            <div className="relative">
              {/* Modal Close Button */}
              <button
                onClick={() => setIsModalBlock(false)}
                className="absolute p-1 rounded-full right-2 top-2 bg-white/10 hover:bg-white/20"
              >
                <IoMdClose />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col items-center justify-center py-12 space-y-4 px-11">
                <h2 className="text-xl font-bold text-[#39b4c0]">
                  Are You Sure You Want to Block?
                </h2>
                <p>Do you want to Block your Users profile ?</p>
                <button className="bg-[#52B5D1] py-3 px-8 rounded-md font-semibold text-white">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Earnings;
