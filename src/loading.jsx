import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@nextui-org/react";

export default function Loading() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-16 bg-gradient-to-br from-[#73F1CF] to-[#99CCDF]">
      <motion.div
        className="w-40 h-40 bg-white mb-20" // 添加了 mt-8 类来增加顶部间距
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      />
      
      <Progress
      aria-label="Downloading..."
      size="md"
      value={value}
      label="Loading💤"
      color="success"
      showValueLabel={true}
      className="max-w-md"
    />
    </div>
  );
}
