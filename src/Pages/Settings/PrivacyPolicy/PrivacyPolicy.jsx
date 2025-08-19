import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from "../../../features/api/settingApi";

const PrivacyPolicy = () => {
  const [content, setContent] = useState("");

  const { data, isLoading: isFetching } = useGetPrivacyPolicyQuery();
  const [updatePrivacyPolicy, { isLoading }] = useUpdatePrivacyPolicyMutation();

  useEffect(() => {
  if (data?.data?.PrivacyPolicy) {
    setContent(data.data.PrivacyPolicy);
  }
}, [data]);

const onFinish = async () => {
  try {
    const payload = { PrivacyPolicy: content };
    console.log("Sending payload:", payload);

    const res = await updatePrivacyPolicy(payload).unwrap();
    message.success(res.message || "Privacy Policy updated successfully!");
  } catch (err) {
    console.error("Error response:", err);
    message.error(err?.data?.message || "Failed to update Privacy Policy");
  }
};

  return (
    <div className="container mx-auto">
      <div className="p-6 mt-5 bg-white rounded-lg md:p-10">
        <h2 className="mb-6 text-2xl font-bold">Privacy Policy</h2>
        <Form name="privacyPolicy" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Content"
            rules={[{ required: true, message: "Please input content!" }]}
          >
            <div>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-[200px] mb-12"
              />
            </div>
          </Form.Item>

          <Form.Item className="mt-16">
            <button
              type="submit"
              className="bg-[#52B5D1] text-white px-6 py-2 rounded-lg"
              disabled={isLoading || isFetching}
            >
              {isLoading ? "Updating..." : "Update Privacy Policy"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
