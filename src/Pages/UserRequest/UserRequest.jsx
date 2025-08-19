import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { IoIosArrowBack, IoIosArrowForward, IoIosCheckmarkCircle, IoMdClose } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import userImage from "../../assets/image/admin.jpg";
import { useGetDriverQuery } from "../../features/api/driverRequest";

function UserRequest() {
  const { data: responseData, error, isLoading } = useGetDriverQuery();
  
  // Destructure the actual data array from the response object
  const apiData = responseData?.data?.all_driver_verification;
  
  const [transformedUsers, setTransformedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAccept, setIsModalAccept] = useState(false);
  const [isModalBlock, setIsModalBlock] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // Only transform data if the nested array exists and is a valid array
    if (apiData && Array.isArray(apiData)) {
      const transformed = apiData.map((item, index) => ({
        id: `${String(index + 1).padStart(2, '0')}`,
        name: item.userId?.name || "N/A",
        email: item.userId?.email || "N/A",
        phoneNumber: item.userId?.phoneNumber || "N/A",
        date: new Date(item.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
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
      }));
      setTransformedUsers(transformed);
      setFilteredUsers(transformed); // Initialize filtered users with all users
    }
  }, [apiData]);

  // For user search functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredUsers(transformedUsers);
    } else {
      const filtered = transformedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase()) ||
          user.accType.toLowerCase().includes(term.toLowerCase()) ||
          user.driverLocation.toLowerCase().includes(term.toLowerCase()) ||
          user.vehicleNumber.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  // For pagination functionality
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

  const handleAcceptUser = (user) => {
    setSelectedUser(user);
    setIsModalAccept(true);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Handle loading and error states for a better user experience
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
                {/* <th className="px-4 py-3 text-left">Users</th> */}
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={index} className="bg-[#4BADC9]">
                    <td className="px-4 my-3 text-white">{user.id}</td>
                    {/* <td className="px-4 my-3 overflow-hidden text-white w-11 h-11">
                      <img className="rounded-full w-11 h-11" src={userImage} alt="user" />
                    </td> */}
                    <td className="px-4 my-3 text-white">{user.name}</td>
                    <td className="px-4 my-3 text-white">{user.email}</td>
                    <td className="px-4 my-3 text-white">{user.date}</td>
                    <td className="flex px-4 py-3 space-x-4">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-white hover:text-gray-200"
                      >
                        <EyeOutlined size={20} />
                      </button>
                      <button
                        onClick={() => handleAcceptUser(user)}
                        className="text-green-400 hover:text-gray-200"
                      >
                        <IoIosCheckmarkCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleBlockUser(user)}
                        className="text-red-500 hover:text-red-300"
                      >
                        <MdBlock size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-white">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > pageSize && (
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
                className={`px-3 py-1 mx-1 rounded-full ${currentPage === index + 1
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
        )}
      </div>

      {/* ================= Modal for user details ============= */}
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
                {/* <div className="w-24 h-24 mx-auto mb-4 overflow-hidden border-4 border-white rounded-full">
                  <img src={userImage} className="object-cover w-full h-full" alt="User" />
                </div> */}
                <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                <p className="text-white/80">{selectedUser.accType}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="pb-2 text-lg font-bold text-black border-b">Personal Information</h3>
                    <div>
                      <h4 className="font-semibold text-black">Email</h4>
                      <p className="text-gray-700">{selectedUser.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Phone Number</h4>
                      <p className="text-gray-700">{selectedUser.phoneNumber}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Date Joined</h4>
                      <p className="text-gray-700">{selectedUser.date}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Location</h4>
                      <p className="text-gray-700">{selectedUser.driverLocation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Pick-up Cities</h4>
                      <p className="text-gray-700">{selectedUser.picCities}, {selectedUser.picState}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="pb-2 text-lg font-bold text-black border-b">Vehicle Information</h3>
                    <div>
                      <h4 className="font-semibold text-black">Vehicle Number</h4>
                      <p className="text-gray-700">{selectedUser.vehicleNumber}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Truck Category</h4>
                      <p className="text-gray-700 capitalize">{selectedUser.truckcategories}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Truck Size</h4>
                      <p className="text-gray-700">{selectedUser.truckSize}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Load Capacity</h4>
                      <p className="text-gray-700">{selectedUser.loadCapacity}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Ready to Drive</h4>
                      <p className="text-gray-700">
                        <span className={`px-2 py-1 rounded-full text-xs ${selectedUser.isReadyToDrive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                          {selectedUser.isReadyToDrive ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="pb-2 text-lg font-bold text-black border-b">Verification Status</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-semibold text-black">Driver License</h4>
                      <p className="text-gray-700">
                        <span className={`px-2 py-1 rounded-full text-xs ${selectedUser.isVerifyDriverLicense
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                          {selectedUser.isVerifyDriverLicense ? 'Verified' : 'Not Verified'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">NID Card</h4>
                      <p className="text-gray-700">
                        <span className={`px-2 py-1 rounded-full text-xs ${selectedUser.isVerifyDriverNid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                          {selectedUser.isVerifyDriverNid ? 'Verified' : 'Not Verified'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="pb-2 text-lg font-bold text-black border-b">Documents</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="mb-2 font-semibold text-black">Driver License</h4>
                      <div className="p-2 border rounded-md">
                        {/* Corrected: Show the actual image if it exists */}
                        {selectedUser.driverLicense ? (
                          <img
                            src={`${selectedUser.driverLicense}`}
                            alt="Driver License"
                            className="object-cover w-full h-32 rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-32 text-gray-500 bg-gray-200 rounded">
                            No Image Found
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-black">NID Card</h4>
                      <div className="p-2 border rounded-md">
                        {/* Corrected: Show the actual image if it exists */}
                        {selectedUser.driverNidCard ? (
                          <img
                            src={`${selectedUser.driverNidCard}`}
                            alt="NID Card"
                            className="object-cover w-full h-32 rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-32 text-gray-500 bg-gray-200 rounded">
                            No Image Found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="pb-2 text-lg font-bold text-black border-b">Location Coordinates</h3>
                  <div className="mt-4">
                    <p className="text-gray-700">
                      Latitude: {selectedUser.coordinates[0]}, Longitude: {selectedUser.coordinates[1]}
                    </p>
                  </div>
                </div>
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
              <button
                onClick={() => setIsModalBlock(false)}
                className="absolute p-1 rounded-full right-2 top-2 bg-white/10 hover:bg-white/20"
              >
                <IoMdClose />
              </button>
              <div className="flex flex-col items-center justify-center py-12 space-y-4 px-11">
                <h2 className="text-xl font-bold text-[#39b4c0]">
                  Are You Sure You Want to Block?
                </h2>
                <p>Do you want to Block {selectedUser.name}'s profile?</p>
                <button className="px-8 py-3 font-semibold text-white bg-red-500 rounded-md">
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= Modal for Accept Users ============= */}
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
                <p>Do you want to Accept {selectedUser.name}'s profile?</p>
                <button className="bg-[#52B5D1] py-3 px-8 rounded-md font-semibold text-white">
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