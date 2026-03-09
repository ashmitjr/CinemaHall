import React from "react";
import { motion } from "framer-motion";

/* ── Full page loader ── */
export const PageLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center"
    style={{ backgroundColor: "#060606", zIndex: 100 }}>
    <div className="flex flex-col items-center gap-8">
      {/* Animated bars */}
      <div className="flex items-end gap-[3px]" style={{ height: 40 }}>
        {[0,1,2,3,4,5,6].map(i => (
          <motion.div key={i}
            style={{ width: 3, backgroundColor: i === 3 ? "#e8ff00" : "#222222" }}
            animate={{ height: [8, 36, 8] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.08, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.6em]" style={{ color: "#333333" }}>
          LOADING ARCHIVE
        </span>
        <div style={{ width: 120, height: 1, backgroundColor: "#111111", position: "relative", overflow: "hidden" }}>
          <motion.div style={{ height: "100%", backgroundColor: "#e8ff00", position: "absolute", left: 0 }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            initial={{ width: "60%" }}
          />
        </div>
      </div>
    </div>
  </div>
);

/* ── Inline section loader ── */
export const Loader = ({ label = "LOADING" }) => (
  <div className="flex flex-col items-center justify-center gap-6 py-16 px-6">
    <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
      {[0,1,2,3,4].map(i => (
        <motion.div key={i}
          style={{ width: 2, backgroundColor: i === 2 ? "#e8ff00" : "#1e1e1e" }}
          animate={{ height: [6, 24, 6] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
    <span className="font-mono text-[10px] tracking-[0.5em]" style={{ color: "#333333" }}>
      {label}
    </span>
  </div>
);

/* ── Skeleton card ── */
export const SkeletonCard = () => (
  <div style={{ border: "1px solid #141414", backgroundColor: "#0a0a0a" }}>
    <motion.div
      className="w-full"
      style={{ aspectRatio: "2/3", backgroundColor: "#111111" }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    />
    <div className="p-3 flex flex-col gap-2">
      <motion.div style={{ height: 14, backgroundColor: "#111111", width: "80%" }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.1, ease: "easeInOut" }} />
      <motion.div style={{ height: 10, backgroundColor: "#0e0e0e", width: "40%" }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: "easeInOut" }} />
    </div>
  </div>
);

export default Loader;