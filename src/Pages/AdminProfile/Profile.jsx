import { useState, useEffect } from "react";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "../../features/api/authApi";

function Profile() {
  const { data, error, isLoading, refetch } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const userData = data?.data || {};

  // 🔹 Local state for form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    photo: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Load data into form when API responds
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        location: userData.location || "",
        photo: null,
      });
    }
  }, [userData]);

  // 🔹 Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Handle submit update
  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      await refetch(); // refresh profile after update
      setIsEditing(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile ❌");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#52B5D1] p-5 text-center text-white">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#52B5D1] p-5 text-center text-white">
        <p className="text-xl">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="bg-[#52B5D1] p-5">
      <p className="mb-5 text-2xl font-bold text-center text-white">
        Your Profile
      </p>
      <form className="space-y-4 w-auto md:w-[480px] mx-auto">
        {/* 🔹 User Name */}
        <div>
          <label className="mb-2 text-xl font-bold text-white">User Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-3 mt-2 rounded-md outline-none"
            disabled={!isEditing}
          />
        </div>

        {/* 🔹 Email */}
        <div>
          <label className="mb-2 text-xl font-bold text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 mt-2 rounded-md outline-none"
            disabled
          />
        </div>

        {/* 🔹 Phone */}
        <div>
          <label className="mb-2 text-xl font-bold text-white">Contact No</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-5 py-3 mt-2 rounded-md outline-none"
            disabled={!isEditing}
          />
        </div>

        {/* 🔹 Address */}
        <div>
          <label className="mb-2 text-xl font-bold text-white">Address</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-5 py-3 mt-2 rounded-md outline-none"
            disabled={!isEditing}
          />
        </div>

        {/* 🔹 Photo Upload */}
        {isEditing && (
          <div>
            <label className="mb-2 text-xl font-bold text-white">Profile Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-5 py-3 mt-2 rounded-md outline-none"
            />
          </div>
        )}

        {/* 🔹 Buttons */}
        <div className="flex gap-3 py-5 text-center">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-[#F8FAFC] text-black font-semibold w-full py-2 rounded-lg"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full py-2 font-semibold text-white bg-green-500 rounded-lg disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full py-2 font-semibold text-white bg-red-500 rounded-lg"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;
