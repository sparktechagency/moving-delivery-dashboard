import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGetTermsQuery, useUpdateTermsMutation } from "../../../features/api/settingApi";

const TermsConditions = () => {
  const [content, setContent] = useState("");

  const { data, isLoading: isFetching } = useGetTermsQuery();
  const [updateTerms, { isLoading }] = useUpdateTermsMutation();

  // set content when GET API responds
  useEffect(() => {
    if (data?.data?.TermsConditions) { // ⚠️ use exact key from backend
      setContent(data.data.TermsConditions);
    }
  }, [data]);

  const onFinish = async () => {
    try {
      const payload = { TermsConditions: content }; // ⚠️ match backend key
      const res = await updateTerms(payload).unwrap();
      message.success(res.message || "Terms & Conditions updated successfully!");
    } catch (err) {
      console.error("Error response:", err);
      message.error(err?.data?.message || "Failed to update Terms & Conditions");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-6 mt-5 bg-white rounded-lg md:p-10">
        <h2 className="mb-6 text-2xl font-bold">Terms & Conditions</h2>

        <Form name="terms" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Content"
            rules={[{ required: true, message: "Please input content!" }]}
          >
            <div>
              <ReactQuill
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
              {isLoading ? "Updating..." : "Update Terms & Conditions"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default TermsConditions;
