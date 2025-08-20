import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../../features/api/authApi";
import { selectCurrentUser, setCredentials } from "../../features/slices/authSlice";

function EditProfile() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser); // 🔹 fetch user from Redux
  const [userData, setUserData] = useState(currentUser || {});
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // sync redux user → local state (when redux updates)
  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile({
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        // photo will come from another component
      }).unwrap();

      // ✅ update redux + localStorage
      dispatch(setCredentials({ token: localStorage.getItem("token"), user: updatedUser }));

      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Profile update failed ❌");
    }
  };

  return (
    <div className="bg-[#52B5D1] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-auto md:w-[480px] bg-[#52B5D1] p-6 rounded-lg"
      >
        <p className="mb-5 text-2xl font-bold text-center text-white">
          Edit Your Profile
        </p>

        <div>
          <label className="mb-2 text-xl font-bold text-white">User Name</label>
          <input
            type="text"
            name="name"
            value={userData?.name || ""}
            onChange={handleChange}
            className="w-full px-5 py-3 text-white bg-[#52B5D1] border-2 border-white rounded-md outline-none placeholder:text-xl"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-white">Email</label>
          <input
            type="email"
            name="email"
            value={userData?.email || ""}
            disabled // 🔹 email usually not editable
            className="w-full px-5 py-3 mt-2 text-gray-300 bg-gray-500 border-2 border-white rounded-md placeholder:text-xl"
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-white">Contact No</label>
          <input
            type="text"
            name="phoneNumber"
            value={userData?.phoneNumber || ""}
            onChange={handleChange}
            className="w-full px-5 py-3 mt-2 text-white bg-[#52B5D1] border-2 border-white rounded-md placeholder:text-xl"
            placeholder="Contact No"
            required
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-white">Address</label>
          <input
            type="text"
            name="location"
            value={userData?.location || ""}
            onChange={handleChange}
            className="w-full px-5 py-3 mt-2 text-white bg-[#52B5D1] border-2 border-white rounded-md placeholder:text-xl"
            placeholder="Enter Address"
            required
          />
        </div>

        <div className="py-5 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#F8FAFC] text-black font-semibold w-full py-2 rounded-lg hover:bg-gray-200"
          >
            {isLoading ? "Saving..." : "Save & Change"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
