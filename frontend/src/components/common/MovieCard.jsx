import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IMG_BASE } from "../../services/tmdb";
import { motion } from "framer-motion";
import { getYear } from "../../utils/helpers";

export const MovieCard = ({ item, type = "movie" }) => {
  const [imgError, setImgError] = useState(false);
  const title = item.title || item.name;
  const year = getYear(item.release_date || item.first_air_date);
  const rating = item.vote_average?.toFixed(1);
  const mediaType = item.media_type || type;

  const ratingColor =
    rating >= 7.5 ? "#e8ff00" :
    rating >= 5.0 ? "#f0f0f0" :
    "#ff2d2d";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1, ease: "linear" }}
      className="group relative bg-[#111111] border border-[#222222] hover:border-[#e8ff00] overflow-hidden flex flex-col"
      style={{ transition: "border-color 0.05s linear" }}
    >
      <Link to={`/movie/${mediaType}/${item.id}`} className="flex flex-col h-full">

        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden bg-[#0f0f0f]">
          {!imgError && item.poster_path ? (
            <img
              src={`${IMG_BASE}/w500${item.poster_path}`}
              alt={title}
              className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0"
              style={{ transition: "filter 0.15s linear" }}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#0f0f0f]">
              <div className="w-10 h-10 border border-[#333333] flex items-center justify-center">
                <span className="font-mono text-[8px] tracking-widest text-[#333333]">NO</span>
              </div>
              <span className="font-mono text-[8px] tracking-[0.3em] text-[#333333]">POSTER</span>
            </div>
          )}

          {/* Top-left index marker — brutalist editorial stamp */}
          <div className="absolute top-0 left-0 bg-[#0a0a0a] border-b border-r border-[#222222] group-hover:border-[#e8ff00] px-2 py-1"
            style={{ transition: "border-color 0.05s linear" }}>
            <span className="font-mono text-[8px] tracking-[0.2em] text-[#444444] group-hover:text-[#e8ff00]"
              style={{ transition: "color 0.05s linear" }}>
              {mediaType === "tv" ? "TV" : "MV"}
            </span>
          </div>

          {/* Rating — top right hard stamp */}
          {rating && (
            <div className="absolute top-0 right-0 bg-[#0a0a0a] border-b border-l border-[#222222] px-2 py-1">
              <span className="font-mono text-[10px] font-bold" style={{ color: ratingColor }}>
                {rating}
              </span>
            </div>
          )}
        </div>

        {/* Bottom info bar — always visible, not on hover */}
        <div className="border-t border-[#222222] group-hover:border-[#e8ff00] p-3 flex flex-col gap-1"
          style={{ transition: "border-color 0.05s linear" }}>

          {/* Title */}
          <h3 className="font-display text-lg leading-none uppercase tracking-tight line-clamp-1 text-white group-hover:text-[#e8ff00]"
            style={{ transition: "color 0.05s linear" }}>
            {title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#555555]">
              {year || "—"}
            </span>
            <span className="font-mono text-[8px] tracking-[0.3em] text-[#333333] border border-[#222222] px-1.5 py-0.5 group-hover:border-[#444444]">
              {mediaType === "tv" ? "SERIES" : "FILM"}
            </span>
          </div>
        </div>

      </Link>
    </motion.div>
  );
};