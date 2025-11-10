import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function UploadPhoto({ token }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [filter, setFilter] = useState("none");
  const [filteredPreview, setFilteredPreview] = useState(null);

  const filters = ["none", "vintage", "sunset", "bw"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyFilter = async () => {
    if (!image || filter === "none") {
      setFilteredPreview(preview);
      return;
    }
    try {
      const res = await axios.post("http://localhost:5006/apply-filter", {
        image_url: preview,
        filter,
      });
      setFilteredPreview(res.data.filtered_image);
    } catch (err) {
      alert("Filter failed");
    }
  };

  const handleUpload = async () => {
    await axios.post(
      "http://localhost:5005/upload-photo",
      {
        image_base64: filteredPreview || preview,
        caption,
        filter,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Posted!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Share a Photo</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {preview && (
        <div className="space-y-4">
          <img
            src={filteredPreview || preview}
            alt="Preview"
            className="w-full rounded-lg shadow-md"
          />

          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  if (f !== "none") applyFilter();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === f
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Post to Feed
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default UploadPhoto;
