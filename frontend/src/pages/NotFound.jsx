import React from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/common/PageTransition";

const NotFound = () => {
  return (
    <PageTransition>
      <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-[15rem] md:text-[25rem] leading-none text-accent tracking-tighter">404</h1>
        <h2 className="font-display text-6xl md:text-8xl mb-8 uppercase tracking-tight">Signal Lost</h2>
        <p className="font-body text-muted max-w-md mb-12 uppercase tracking-widest text-xs">
          THE ARCHIVE YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN REDACTED BY THE AUTHORITIES.
        </p>
        <Link
          to="/"
          className="bg-white text-black px-12 py-4 font-mono text-sm uppercase tracking-widest hover:bg-accent transition-all"
        >
          Return to Base
        </Link>
      </div>
    </PageTransition>
  );
};

export default NotFound;
