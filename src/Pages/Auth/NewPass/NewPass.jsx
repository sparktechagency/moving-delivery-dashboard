import { Form, Input, Checkbox, Typography, message } from "antd";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const NewPass = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { email, newPassword, confirmPassword } = values;

    // Simulate API call
    setTimeout(() => {
      if (newPassword !== confirmPassword) {
        message.error("Passwords do not match!");
      } else {
        message.success("Password changed successfully");
        navigate("/sign-in");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center w-full gap-2 mx-auto md:max-w-screen-md">
          <Form
            name="new-password"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="py-10 md:py-20 px-6 md:px-10 rounded-2xl w-full max-w-lg bg-[#79DEF8]/25 border-2 border-[#eef6ff] mt-10"
          >
            <div className="mb-6 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-700 md:text-3xl">
                Create New Password
              </h2>
              <Typography.Text className="text-base text-gray-600">
              Create a new password. Ensure it differs from
              previous ones for security
              </Typography.Text>
            </div>

            <Form.Item
              name="newPassword"
              label={<p className="text-md">New Password</p>}
              rules={[{ required: true, message: "Please input your new password!" }]}
            >
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="text-md"
                />
                <div className="absolute right-0 pr-3">
                  <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<p className="text-md">Confirm Password</p>}
              rules={[{ required: true, message: "Please confirm your password!" }]}
            >
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="text-md"
                />
                <div className="absolute right-0 pr-3">
                  <button type="button" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </div>
            </Form.Item>

         

            <Form.Item className="mt-8 text-center">
              <button
                className="bg-[#52B5D1] text-center p-2 font-semibold text-white px-10 py-2 rounded-md transition hover:bg-[#3aa2bf]"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Update Password"}
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
