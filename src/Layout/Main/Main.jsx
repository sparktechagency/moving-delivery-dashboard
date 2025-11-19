import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { ConfigProvider, Drawer } from "antd";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import adminImage from "../../assets/image/admin.jpg";
import { useGetMyProfileQuery } from "../../features/api/authApi";
import { BASE_URL } from "../../utils/api";

const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch logged-in admin profile
  const { data, isLoading } = useGetMyProfileQuery();
  const userProfile = data?.data || {};

  // Local state for profile image
  const [profilePic, setProfilePic] = useState(adminImage);

  // Update profilePic when userProfile changes
  useEffect(() => {
    if (userProfile?.photo) {
      const photoUrl = userProfile.photo.startsWith("http")
        ? userProfile.photo
        : `${BASE_URL}/${userProfile.photo}`;
      setProfilePic(photoUrl);
    } else {
      setProfilePic(adminImage);
    }
  }, [userProfile]);

  // Format page title nicely
  const formatPathName = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1] || "Dashboard";
    return (
      lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, " ")
    );
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  // Pages where layout should not render
  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/forgate-password" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/new-password";

  if (isAuthPage) return <Outlet />;

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 z-10 bg-white shadow-sm lg:ml-72 subtract-width">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">
            {formatPathName(location.pathname)}
          </h1>

          {/* Profile Section */}
          <div
            className="flex items-center gap-4 cursor-pointer md:mr-8"
            onClick={() => navigate("/profile")}
          >
            {/* Profile Image */}
            <div className="items-center justify-center hidden w-10 h-10 overflow-hidden bg-gray-100 rounded-full md:flex">
              <img
                src={profilePic}
                alt="profile"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Name & Email */}
            <div className="hidden text-right md:block">
              <h3 className="text-lg font-semibold">
                {isLoading ? "Loading..." : userProfile.name || "Unknown"}
              </h3>
              <p className="text-sm text-gray-500">
                {userProfile.email || ""}
              </p>
            </div>

            {/* Mobile Drawer Button */}
            <button className="block lg:hidden" onClick={showDrawer}>
              <RxHamburgerMenu className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar (Desktop) */}
        <div className="fixed left-0 hidden h-full bg-white shadow-md lg:block w-72">
          <Sidebar adminProfile={userProfile} />
        </div>

        {/* Mobile Sidebar Drawer */}
        <ConfigProvider
          theme={{
            components: {
              Drawer: {
                colorBgElevated: "#ffffff",
              },
            },
          }}
        >
          <Drawer
            placement="right"
            width="100%"
            onClose={onClose}
            open={open}
            closeIcon={<IoMdClose className="text-2xl" />}
          >
            <Sidebar adminProfile={userProfile} />
          </Drawer>
        </ConfigProvider>

        {/* Main Content (Right Side) */}
        <div className="flex-1 p-5 bg-[#E0F2F7] overflow-y-auto lg:ml-72">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
