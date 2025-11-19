import { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { LuPenLine } from "react-icons/lu";
import { Link } from "react-router-dom";
import ChangePass from "./ChangePass";
import Profile from "./Profile";
import admin from "../../assets/image/admin.jpg";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "../../features/api/authApi";
import { message } from "antd";
import { BASE_URL } from "../../utils/api";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user profile
  const { data, refetch } = useGetMyProfileQuery();
  const user = data?.data || {};

  // Local photo preview
  const [profilePic, setProfilePic] = useState(admin);

  // Update API mutation (optional: you may remove if updating inside Profile component)
  const [updateProfile] = useUpdateProfileMutation();

  // Update profilePic when user changes
  useEffect(() => {
    if (user?.photo) {
      const pic = user.photo.startsWith("http") ? user.photo : `${BASE_URL}/${user.photo}`;
      setProfilePic(pic);
    } else {
      setProfilePic(admin);
    }
  }, [user]);

  // Handle photo update from child Profile component
  const handlePhotoUpdate = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await updateProfile(formData).unwrap();
      const updatedPhoto = res?.data?.photo;
      const finalPic = updatedPhoto.startsWith("http") ? updatedPhoto : `${BASE_URL}/${updatedPhoto}`;
      setProfilePic(finalPic);
      await refetch(); // refresh user data
      message.success("Profile photo updated successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to update photo");
    }
  };

  return (
    <div className="overflow-y-auto bg-[#52B5D1]">
      <div className="h-full px-5 pb-5">
        <Link to={"/"} className="flex items-center gap-x-5">
          <IoArrowBack size={30} color="#555555" />
          <h1 className="text-3xl font-bold text-white text-start">
            {activeTab === "profile" && "Profile"}
            {activeTab === "editProfile" && "Edit Profile"}
            {activeTab === "changePassword" && "Change Password"}
          </h1>
        </Link>

        <div className="flex flex-col items-center justify-center mx-auto">
          {/* Profile Picture */}
          <div className="w-full">
            <div className="bg-[#C9E6ED] rounded-md">
              <div className="p-5 mt-10">
                <div className="w-[122px] relative h-[122px] mx-auto bg-gray-300 rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                  <img
                    src={profilePic}
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
                      onChange={(e) => handlePhotoUpdate(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-5 my-5 font-semibold text-white text-md md:text-xl">
            <p
              onClick={() => setActiveTab("profile")}
              className={`cursor-pointer pb-1 ${activeTab === "profile" ? "border-b-2" : ""}`}
            >
              Profile
            </p>
            <p
              onClick={() => setActiveTab("changePassword")}
              className={`cursor-pointer pb-1 ${activeTab === "changePassword" ? "border-b-2" : ""}`}
            >
              Change Password
            </p>
          </div>

          {/* Tab Content */}
          <div className="flex items-center justify-center w-full max-w-3xl p-5 rounded-md">
            {activeTab === "profile" && (
              <Profile setActiveTab={setActiveTab} profile={user} onPhotoUpdate={handlePhotoUpdate} />
            )}
            {activeTab === "editProfile" && (
              <Profile editMode={true} profile={user} onPhotoUpdate={handlePhotoUpdate} />
            )}
            {activeTab === "changePassword" && <ChangePass />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
