import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { LuPenLine } from "react-icons/lu";
import { Link } from "react-router-dom";

import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import Profile from "./Profile";
import admin from "../../assets/image/admin.jpg";
import { useUpdateProfileMutation } from "../../features/api/authApi";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePic, setProfilePic] = useState(admin); // default image
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // 🔹 Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await updateProfile({ photo: file }).unwrap();
      // ✅ Preview new photo immediately
      setProfilePic(URL.createObjectURL(file));
      alert("Profile photo updated successfully ✅");
    } catch (error) {
      console.error("Photo update failed:", error);
      alert("Failed to update photo ❌");
    }
  };

  return (
    <div className="overflow-y-auto bg-[#52B5D1]">
      <div className="h-full px-5 pb-5">
        {/* 🔹 Page Title */}
        {activeTab === "profile" && (
          <Link to={"/"} className="flex items-center gap-x-5">
            <IoArrowBack size={30} color="#555555" />
            <h1 className="text-3xl font-bold text-white text-start">Profile</h1>
          </Link>
        )}
        {activeTab === "editProfile" && (
          <Link to={"/"} className="flex items-center gap-x-5">
            <IoArrowBack size={30} color="#555555" />
            <h1 className="text-3xl font-bold text-white text-start">
              Edit Profile
            </h1>
          </Link>
        )}
        {activeTab === "changePassword" && (
          <Link to={"/"} className="flex items-center gap-x-5">
            <IoArrowBack size={30} color="#555555" />
            <h1 className="text-3xl font-bold text-white text-start">
              Change Password
            </h1>
          </Link>
        )}

        {/* 🔹 Main Content */}
        <div className="flex flex-col items-center justify-center mx-auto ">
          {/* Profile Picture Section */}
          <div className="w-full">
            <div className="bg-[#C9E6ED] rounded-md">
              <div className="p-5 mt-10 ">
                <div className="w-[122px] relative h-[122px] mx-auto bg-gray-300 rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                  <img
                    src="https://png.pngtree.com/png-vector/20220719/ourmid/pngtree-color-icon---businessman-icon-color-sign-vectorteamwork-account-admin-photo-image_37961448.jpg"
                    alt="profile"
                    className="object-cover w-32 h-32 rounded-full"
                  />
                  {/* Upload Icon */}
                  <div className="absolute right-0 p-2 bg-white rounded-full shadow-md cursor-pointer bottom-2">
                    <label htmlFor="profilePicUpload" className="cursor-pointer">
                      <LuPenLine />
                    </label>
                    <input
                      type="file"
                      id="profilePicUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Section */}
          {activeTab === "profile" && (
            <div className="flex items-center justify-center gap-5 my-5 font-semibold text-md md:text-xl">
              <p
                onClick={() => setActiveTab("profile")}
                className={`cursor-pointer pb-1 text-white ${
                  activeTab === "profile" ? " border-b-2 " : "text-white"
                }`}
              >
                Profile
              </p>
              <p
                onClick={() => setActiveTab("changePassword")}
                className={`cursor-pointer pb-1 text-white ${
                  activeTab === "changePassword" ? " border-b-2 " : "text-white"
                }`}
              >
                Change Password
              </p>
            </div>
          )}

          {activeTab === "editProfile" && (
            <div className="flex items-center justify-center gap-5 my-5 font-semibold text-md md:text-xl">
              <p
                onClick={() => setActiveTab("editProfile")}
                className={`cursor-pointer pb-1 text-white ${
                  activeTab === "editProfile" ? " border-b-2 " : "text-white"
                }`}
              >
                Edit Profile
              </p>
              <p
                onClick={() => setActiveTab("changePassword")}
                className={`cursor-pointer pb-1 text-white ${
                  activeTab === "changePassword" ? " border-b-2 " : "text-white"
                }`}
              >
                Change Password
              </p>
            </div>
          )}

          {activeTab === "changePassword" && (
            <div className="flex items-center justify-center gap-5 my-5 font-semibold text-md md:text-xl">
              <p
                onClick={() => setActiveTab("editProfile")}
                className={`cursor-pointer pb-1 text-white ${
                  activeTab === "editProfile" ? " border-b-2 " : "text-white"
                }`}
              >
                Edit Profile
              </p>
              <p
                onClick={() => setActiveTab("changePassword")}
                className={`cursor-pointer pb-1 text-white ${
                  activeTab === "changePassword" ? " border-b-2 " : "text-white"
                }`}
              >
                Change Password
              </p>
            </div>
          )}

          {/* Tab Content Section */}
          <div className="flex items-center justify-center p-5 rounded-md">
            <div className="w-full max-w-3xl">
              {activeTab === "profile" && (
                <Profile setActiveTab={setActiveTab} />
              )}
              {activeTab === "editProfile" && <Profile />}
              {activeTab === "changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
