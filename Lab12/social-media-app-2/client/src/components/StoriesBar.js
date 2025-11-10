import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function StoriesBar({ stories }) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {stories.map((story, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-r from-pink-500 to-purple-500">
            <img
              src={story.image_url}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                      alt="Story"
            />
          </div>
          <p className="text-xs mt-1">Story</p>
        </motion.div>
      ))}
    </div>
  );
}
