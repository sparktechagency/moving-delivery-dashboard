import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { message } from "antd";
import { useChangePasswordMutation } from "../../features/api/settingApi";

function ChangePass() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      message.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("New password and confirm password do not match");
      return;
    }

    try {
      const payload = {
        oldpassword: oldPassword,
        newpassword: newPassword,
      };

      const res = await changePassword(payload).unwrap();
      message.success(res.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error:", err);
      message.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#52B5D1] rounded-md">
      <p className="mb-5 text-xl font-bold text-center text-white">
        Change Password
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="relative">
          <label className="font-semibold text-white">Current Password</label>
          <input
            type={showOld ? "text" : "password"}
            placeholder="********"
            className="w-full px-4 py-2 mt-1 rounded-md outline-none"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute text-white right-3 top-9"
            onClick={() => setShowOld(!showOld)}
          >
            {showOld ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="font-semibold text-white">New Password</label>
          <input
            type={showNew ? "text" : "password"}
            placeholder="********"
            className="w-full px-4 py-2 mt-1 rounded-md outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute text-white right-3 top-9"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="font-semibold text-white">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="********"
            className="w-full px-4 py-2 mt-1 rounded-md outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute text-white right-3 top-9"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 font-semibold text-[#52B5D1] bg-white rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Changing..." : "Save & Change"}
        </button>
      </form>
    </div>
  );
}

export default ChangePass;
