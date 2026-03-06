import React from "react";
import { motion } from "framer-motion";

export function TigonLogoMark({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="tigonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b2f62" />
          <stop offset="100%" stopColor="#0a4a99" />
        </linearGradient>
        <linearGradient id="tigonGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8e5a1f" />
          <stop offset="55%" stopColor="#e0b26b" />
          <stop offset="100%" stopColor="#9a5f24" />
        </linearGradient>
      </defs>

      <path d="M6 12h42v12H34v52H20V24H6z" fill="url(#tigonBlue)" />
      <path
        d="M49 12h33v12H63v16h17v12H63v24H49V63l8-11h-8z"
        fill="url(#tigonGold)"
      />
      <path d="M44 74V31l-8 8 8-24 8 24-8-8v43z" fill="#fff" />
    </svg>
  );
}

export function TigonLogoWatermark({ theme }) {
  const isDark = theme === "dark";

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "8%",
          left: "-6%",
          opacity: isDark ? 0.2 : 0.12,
          filter: isDark
            ? "drop-shadow(0 10px 28px rgba(12,74,110,0.4))"
            : "drop-shadow(0 10px 28px rgba(13,37,84,0.22))",
          transformStyle: "preserve-3d",
        }}
        animate={{
          x: ["0vw", "72vw", "0vw"],
          y: ["0vh", "34vh", "0vh"],
          rotateY: [0, 14, -10, 0],
          rotateX: [0, -8, 6, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <TigonLogoMark size={280} />
      </motion.div>
    </motion.div>
  );
}
