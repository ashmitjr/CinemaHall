import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="text-[15vw] md:text-[20vw] leading-none text-accent">404</h1>
      <span className="font-mono text-2xl md:text-4xl mb-8 tracking-widest uppercase">
        SIGNAL LOST IN THE VOID
      </span>
      <p className="font-body text-gray-500 max-w-md mb-12">
        THE ARCHIVE YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN REDACTED BY THE AUTHORITIES.
      </p>
      <Link
        to="/"
        className="bg-white text-black px-12 py-4 font-mono text-lg hover:bg-accent transition-colors"
      >
        RETURN TO BASE
      </Link>
    </motion.div>
  );
};

export default NotFound;
