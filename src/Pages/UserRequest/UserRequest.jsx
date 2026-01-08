import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosCheckmarkCircle,
  IoMdClose,
} from "react-icons/io";
import { MdDelete } from "react-icons/md";
import {
  useAcceptDriverMutation,
  useDeleteDriverMutation,
  useGetDriverQuery,
} from "../../features/api/driverRequest";
import { Image, message, Modal, Tag } from "antd";
import { BASE_URL } from "../../utils/api";

function UserRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  // Fetch drivers with pagination parameters
  const {
    data: responseData,
    error,
    isLoading,
    refetch,
  } = useGetDriverQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });

  const [acceptDriver] = useAcceptDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAccept, setIsModalAccept] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const apiData = responseData?.data?.all_driver_verification || [];
  const meta = responseData?.data?.meta || { total: 0, totalPage: 1, page: 1 };

  // Transform API data for display
  const transformedUsers = apiData.map((item, index) => ({
    id: `${String((currentPage - 1) * pageSize + index + 1).padStart(2, "0")}`,
    name: item.userId?.name || "N/A",
    email: item.userId?.email || "N/A",
    phoneNumber: item.userId?.phoneNumber || "N/A",
    date: new Date(item.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    accType: "Driver",
    driverLocation: item.driverLocation || "N/A",
    vehicleNumber: item.vehicleNumber || "N/A",
    truckSize: item.truckSize || "N/A",
    loadCapacity: item.loadCapacity || "N/A",
    truckcategories: item.driverSelectedTruck?.truckcategories || "N/A",
    truckPhoto: item.driverSelectedTruck?.photo,
    picCities: item.picCities || "N/A",
    picState: item.picState || "N/A",
    driverLicense: item.driverLicense,
    driverNidCard: item.driverNidCard,
    isVerifyDriverLicense: item.isVerifyDriverLicense,
    isVerifyDriverNid: item.isVerifyDriverNid,
    isReadyToDrive: item.isReadyToDrive,
    coordinates: item.autoDetectLocation || ["N/A", "N/A"],
    originalId: item._id,
    userId: item.userId?._id,
    status: "pending",
  }));

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);

  const onPageChange = (page) => setCurrentPage(page);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAcceptUser = (user) => {
    setSelectedUser(user);
    setIsModalAccept(true);
  };

  const showModalDelete = () => {
    setIsModalOpenDelete(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
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

  const handleConfirmAccept = async (driver) => {
    try {
      await acceptDriver({
        id: driver.originalId,
        driverId: driver.userId,
      }).unwrap();

      setIsModalAccept(false);
      message.success(`${driver.name} has been accepted successfully!`);

      // Refetch current page
      refetch();
    } catch (err) {
      console.error("Accept failed", err);
      message.error("Failed to accept user. Try again!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDriver({ id: selectedUser.originalId }).unwrap();

      setIsModalOpenDelete(false);
      message.success(`${selectedUser.name} has been deleted successfully!`);

      // Refetch current page
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
      message.error("Failed to delete user. Try again!");
    }
  };

  // Calculate display range
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, meta.total);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-xl text-red-500">
          Error: {error.message || "Failed to fetch data."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-[#E0F2F7] mt-16">
        {/* Header with search */}
        {/* <div className="bg-[#4BADC9] p-4 flex justify-end">
          <div className="w-72">
            <input
              type="text"
              placeholder="Search by name, email, location..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-md"
            />
          </div>
        </div> */}

        {/* Table */}
        <div className="overflow-x-auto bg-[#4BADC9]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E0F2F7] text-gray-700">
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {transformedUsers.length > 0 ? (
                transformedUsers.map((user, index) => (
                  <tr
                    key={user.originalId}
                    className="bg-[#4BADC9] border-b border-[#3a9bb3]"
                  >
                    <td className="px-4 py-3 text-white">{user.id}</td>
                    <td className="px-4 py-3 text-white">{user.name}</td>
                    <td className="px-4 py-3 text-white">{user.email}</td>
                    <td className="px-4 py-3 text-white">{user.date}</td>
                    <td className="px-4 py-3">
                      {user.isReadyToDrive ? (
                        <Tag color="green">Ready to Drive</Tag>
                      ) : (
                        <Tag color="orange">Pending</Tag>
                      )}
                    </td>
                    <td className="flex items-center px-4 py-3 space-x-4">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-white transition-colors hover:text-gray-200"
                        title="View Details"
                      >
                        <EyeOutlined size={20} />
                      </button>

                      {!user.isReadyToDrive && (
                        <button
                          onClick={() => handleAcceptUser(user)}
                          className="text-green-400 transition-colors hover:text-green-300"
                          title="Accept Driver"
                        >
                          <IoIosCheckmarkCircle size={20} />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          showModalDelete();
                        }}
                        className="text-red-400 transition-colors hover:text-red-300"
                        title="Delete Driver"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-white">
                    No driver requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#E0F2F7]">
          <div className="text-sm text-gray-600">
            Showing {transformedUsers.length > 0 ? startIndex : 0} to {endIndex}{" "}
            of {meta.total} driver requests
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

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Driver"
        open={isModalOpenDelete}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        centered
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-4 overflow-hidden bg-white rounded-md max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute z-10 p-1 text-white rounded-full right-2 top-2 bg-black/20 hover:bg-black/30"
              >
                <IoMdClose />
              </button>
              <div className="bg-[#52B5D1] p-6 text-center rounded-md">
                <h2 className="text-xl font-bold text-white">
                  {selectedUser.name}
                </h2>
                <p className="text-white/80">{selectedUser.accType}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="pb-2 text-lg font-bold text-black border-b">
                      Personal Information
                    </h3>
                    <div>
                      <h4 className="font-semibold text-black">Email</h4>
                      <p className="text-gray-700">{selectedUser.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Phone Number</h4>
                      <p className="text-gray-700">
                        {selectedUser.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Date Joined</h4>
                      <p className="text-gray-700">{selectedUser.date}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Location</h4>
                      <p className="text-gray-700">
                        {selectedUser.driverLocation}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">
                        Pick-up Cities
                      </h4>
                      <p className="text-gray-700">
                        {selectedUser.picCities}, {selectedUser.picState}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-4">
                    <h3 className="pb-2 text-lg font-bold text-black border-b">
                      Vehicle Information
                    </h3>
                    <div>
                      <h4 className="font-semibold text-black">
                        Vehicle Number
                      </h4>
                      <p className="text-gray-700">
                        {selectedUser.vehicleNumber}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">
                        Truck Category
                      </h4>
                      <p className="text-gray-700 capitalize">
                        {selectedUser.truckcategories}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Truck Size</h4>
                      <p className="text-gray-700">{selectedUser.truckSize}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">
                        Load Capacity
                      </h4>
                      <p className="text-gray-700">
                        {selectedUser.loadCapacity}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">
                        Ready to Drive
                      </h4>
                      <p className="text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            selectedUser.isReadyToDrive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedUser.isReadyToDrive ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mt-6">
                  <h3 className="pb-2 text-lg font-bold text-black border-b">
                    Verification Documents
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Driver License */}
                    <div>
                      <h4 className="font-semibold text-black">
                        Driver License
                      </h4>
                      {selectedUser.driverLicense ? (
                        <Image
                          src={`${BASE_URL}/${selectedUser.driverLicense}`}
                          alt="Driver License"
                          className="w-full mt-2 rounded-md shadow-md"
                          preview={{
                            mask: "Click to Zoom",
                          }}
                        />
                      ) : (
                        <p className="mt-2 text-gray-700">No Image</p>
                      )}
                    </div>

                    {/* NID Card */}
                    <div>
                      <h4 className="font-semibold text-black">NID Card</h4>
                      {selectedUser.driverNidCard ? (
                        <Image
                          src={`${BASE_URL}/${selectedUser.driverNidCard}`}
                          alt="NID Card"
                          className="w-full mt-2 rounded-md shadow-md"
                          preview={{
                            mask: "Click to Zoom",
                          }}
                        />
                      ) : (
                        <p className="mt-2 text-gray-700">No Image</p>
                      )}
                    </div>

                    {/* Truck Photo */}
                    <div>
                      <h4 className="font-semibold text-black">Truck Photo</h4>
                      {selectedUser.truckPhoto ? (
                        <Image
                          src={`${BASE_URL}/${selectedUser.truckPhoto}`}
                          alt="Truck"
                          className="w-full mt-2 rounded-md shadow-md"
                          preview={{
                            mask: "Click to Zoom",
                          }}
                        />
                      ) : (
                        <p className="mt-2 text-gray-700">No Image</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isModalAccept && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md overflow-hidden bg-white rounded-md">
            <div className="relative">
              <button
                onClick={() => setIsModalAccept(false)}
                className="absolute p-1 rounded-full right-2 top-2 bg-white/10 hover:bg-white/20"
              >
                <IoMdClose />
              </button>
              <div className="flex flex-col items-center justify-center py-12 space-y-4 px-11">
                <h2 className="text-xl font-bold text-[#39b4c0]">
                  Are You Sure?
                </h2>
                <p className="text-center text-gray-600">
                  Do you want to accept <strong>{selectedUser.name}</strong>'s
                  driver profile? They will be able to start accepting rides.
                </p>
                <button
                  onClick={() => handleConfirmAccept(selectedUser)}
                  className="bg-[#52B5D1] py-3 px-8 rounded-md font-semibold text-white hover:bg-[#4BADC9] transition-colors"
                >
                  Confirm Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserRequest;
