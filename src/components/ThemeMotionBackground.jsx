import React from "react";
import { motion } from "framer-motion";
import { TigonLogoMark } from "./TigonBrand";

export default function ThemeMotionBackground({ theme }) {
  const isDark = theme === "dark";
  const sparkleTracks = [
    { left: "3%", delay: 0, duration: 5.8, size: 12 },
    { left: "8%", delay: 0.7, duration: 6.3, size: 10 },
    { left: "13%", delay: 1.1, duration: 6.7, size: 11 },
    { left: "18%", delay: 0.3, duration: 5.9, size: 13 },
    { left: "23%", delay: 1.5, duration: 6.8, size: 10 },
    { left: "28%", delay: 0.9, duration: 6.1, size: 12 },
    { left: "33%", delay: 1.9, duration: 7.2, size: 11 },
    { left: "38%", delay: 0.4, duration: 6.0, size: 13 },
    { left: "43%", delay: 1.2, duration: 6.6, size: 10 },
    { left: "48%", delay: 0.2, duration: 5.7, size: 12 },
    { left: "53%", delay: 1.8, duration: 7.1, size: 11 },
    { left: "58%", delay: 0.6, duration: 6.3, size: 12 },
    { left: "63%", delay: 1.4, duration: 6.9, size: 10 },
    { left: "68%", delay: 0.5, duration: 6.0, size: 13 },
    { left: "73%", delay: 2.0, duration: 7.4, size: 11 },
    { left: "78%", delay: 1.0, duration: 6.4, size: 12 },
    { left: "83%", delay: 0.1, duration: 5.9, size: 10 },
    { left: "88%", delay: 1.6, duration: 6.8, size: 13 },
    { left: "93%", delay: 0.8, duration: 6.2, size: 11 },
    { left: "97%", delay: 1.3, duration: 6.6, size: 12 },
  ];

  const glowA = isDark ? "rgba(59,130,246,0.26)" : "rgba(59,130,246,0.18)";
  const glowB = isDark ? "rgba(14,165,233,0.20)" : "rgba(14,165,233,0.14)";
  const glowC = isDark ? "rgba(16,185,129,0.18)" : "rgba(16,185,129,0.12)";
  const base = isDark ? "#050b18" : "#eef4ff";
  const overlay = isDark
    ? "linear-gradient(180deg, rgba(2,6,23,0.76), rgba(2,6,23,0.64))"
    : "linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.48))";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        background: base,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(circle at 20% 30%, " +
            glowA +
            " 0, transparent 40%), radial-gradient(circle at 80% 30%, " +
            glowB +
            " 0, transparent 42%), radial-gradient(circle at 50% 80%, " +
            glowC +
            " 0, transparent 45%)",
          filter: "blur(20px)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.06, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          inset: "-30%",
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,0.08), rgba(56,189,248,0.05), rgba(16,185,129,0.06), rgba(99,102,241,0.08))",
          filter: "blur(26px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        style={{
          position: "absolute",
          top: "-8%",
          left: "-24%",
          opacity: isDark ? 0.62 : 0.56,
          filter: isDark
            ? "drop-shadow(0 20px 42px rgba(247,181,0,0.5)) contrast(1.5) saturate(1.35) brightness(0.46)"
            : "drop-shadow(0 20px 42px rgba(110,68,14,0.5)) contrast(1.5) saturate(1.3) brightness(0.42)",
          transformStyle: "preserve-3d",
        }}
        animate={{
          // multi-direction travel with "out and in" style movement
          x: ["0vw", "122vw", "-18vw", "88vw", "0vw"],
          y: ["0vh", "-22vh", "112vh", "18vh", "0vh"],
          rotateY: [0, 24, -18, 12, 0],
          rotateX: [0, -14, 10, -8, 0],
          scale: [1, 1.14, 0.92, 1.06, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <TigonLogoMark size={620} />
      </motion.div>

      {sparkleTracks.map((item, idx) => (
        <motion.div
          key={idx}
          style={{
            position: "absolute",
            left: item.left,
            top: "-14vh",
            width: item.size,
            height: item.size,
            color: isDark ? "rgba(255,200,40,0.95)" : "rgba(191,118,16,0.93)",
            textShadow: isDark
              ? "0 0 14px rgba(247,181,0,0.8)"
              : "0 0 10px rgba(191,128,25,0.65)",
            fontSize: `${item.size}px`,
            lineHeight: 1,
          }}
          animate={{
            y: ["-14vh", "110vh"],
            x: [0, 8, -6, 0],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 0.95, 0.8],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ✦
        </motion.div>
      ))}

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isDark ? 0.18 : 0.12,
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.26) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "44px 44px"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlay,
        }}
      />
    </div>
  );
}
