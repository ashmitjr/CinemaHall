import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/common/PageTransition";
import { motion } from "framer-motion";

const NotFound = () => {

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    setPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <PageTransition>

      <div
        onMouseMove={handleMove}
        className="relative h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      >

        {/* Cursor Glow */}
        <div
          className="pointer-events-none absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20 bg-accent transition-transform duration-200"
          style={{
            transform: `translate(${pos.x - 200}px, ${pos.y - 200}px)`
          }}
        />

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="w-full h-full bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 border-2 border-white px-12 py-16 max-w-2xl"
        >

          <motion.h1
            animate={{
              textShadow: [
                "0px 0px 0px #e8ff00",
                "0px 0px 20px #e8ff00",
                "0px 0px 0px #e8ff00"
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2
            }}
            className="font-display text-[10rem] md:text-[18rem] leading-none text-accent tracking-tighter"
          >
            404
          </motion.h1>

          <h2 className="font-display text-5xl md:text-7xl mb-6 uppercase tracking-tight">
            Signal Lost
          </h2>

          <p className="font-mono text-gray-400 max-w-md mx-auto mb-12 uppercase tracking-widest text-xs leading-relaxed">
            THE ARCHIVE YOU ARE LOOKING FOR DOES NOT EXIST
            OR HAS BEEN REDACTED BY THE AUTHORITIES.
          </p>

          <Link
            to="/"
            className="inline-block border-2 border-white px-12 py-4 font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            RETURN TO BASE
          </Link>

        </motion.div>

      </div>

    </PageTransition>
  );
};

export default NotFound;