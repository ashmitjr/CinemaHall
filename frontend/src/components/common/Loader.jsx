import React from "react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-12 h-12 border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );
};
