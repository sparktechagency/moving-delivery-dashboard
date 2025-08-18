import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAboutQuery,
  useUpdateAboutMutation,
} from "../../../features/api/settingApi";

const AboutUs = () => {
  const [content, setContent] = useState("");

  // GET AboutUs from backend
  const { data, isLoading: isFetching } = useGetAboutQuery();
  const [updateAbout, { isLoading }] = useUpdateAboutMutation();

  // set content when API response arrives
  useEffect(() => {
    if (data?.data?.aboutUs) {
      setContent(data.data.aboutUs); // ✅ Correct path
    }
  }, [data]);

  const onFinish = async () => {
    try {
      const payload = { aboutUs: content };
      const res = await updateAbout(payload).unwrap();
      message.success(res.message || "About Us updated successfully!");
    } catch (err) {
      message.error(err?.data?.message || "Failed to update About Us");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-6 mt-5 bg-white rounded-lg md:p-10">
        <h2 className="mb-6 text-2xl font-bold">About Us</h2>
        <Form name="aboutUs" onFinish={onFinish} layout="vertical">
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
              {isLoading ? "Updating..." : "Update About Us"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AboutUs;
