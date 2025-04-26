/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PrivacyPolicy = () => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (value) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            message.success("Privacy Policy updated Successfully");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="container mx-auto">
            <div className="p-6 mt-5 bg-white rounded-lg md:p-10">
                <h2 className="mb-6 text-2xl font-bold">Privacy Policy</h2>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    className="h-[200px] mb-12"
                />

                <button
                    onClick={() => handleSubmit(value)}
                    className="bg-[#52B5D1] text-white px-6 py-2 rounded-lg mt-16"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Privacy Policy'}
                </button>
            </div>
        </div>
    );
};

export default PrivacyPolicy;