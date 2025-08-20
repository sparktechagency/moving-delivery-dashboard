import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/slices/authSlice";
// import { selectCurrentUser } from "../../redux/authSlice"; // adjust path if needed

function Profile({ setActiveTab }) {
  // 🔹 Fetch user from Redux store
  const userData = useSelector(selectCurrentUser);
  console.log(userData)

  if (!userData) {
    return (
      <div className="bg-[#52B5D1] p-5 text-center text-white">
        <p className="text-xl">No user data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#52B5D1]">
      <p className="mb-5 text-2xl font-bold text-center text-white">
        Your Profile
      </p>
      <form className="space-y-2 w-auto md:w-[480px]">
        <div>
          <label className="mb-2 text-xl font-bold text-white">User Name</label>
          <input
            type="text"
            value={userData.name || ""}
            className="w-full px-5 py-3 mt-5 text-white rounded-md outline-none placeholder:text-xl"
            disabled
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-white">Email</label>
          <input
            type="email"
            value={userData.email || ""}
            className="w-full px-5 py-3 mt-5 text-white rounded-md outline-none placeholder:text-xl"
            disabled
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-white">
            Contact No
          </label>
          <input
            type="text"
            value={userData.number || ""}
            className="w-full px-5 py-3 mt-5 text-white rounded-md outline-none placeholder:text-xl"
            disabled
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-white">Address</label>
          <input
            type="text"
            value={userData.address || ""}
            className="w-full px-5 py-3 mt-5 text-white rounded-md outline-none placeholder:text-xl"
            disabled
          />
        </div>

        <div className="py-5 text-center">
          <button
            type="button"
            onClick={() => setActiveTab("editProfile")}
            className="bg-[#F8FAFC] text-BLACK font-semibold w-full py-2 rounded-lg"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
