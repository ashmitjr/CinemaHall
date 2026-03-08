import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IMG_BASE } from "../../services/tmdb";

/* ─── Rating color ───────────────────────────────── */
const ratingColor = (r) => {
  if (!r) return "#333333";
  if (r >= 7.5) return "#e8ff00";
  if (r >= 5)   return "#f0f0f0";
  return "#ff2d2d";
};

/* ─── MovieCard ──────────────────────────────────── */
export const MovieCard = ({ item, type = "movie" }) => {
  if (!item) return null;

  const title       = item.title || item.name || "UNTITLED";
  const releaseDate = item.release_date || item.first_air_date;
  const year        = releaseDate?.split("-")[0] || "—";
  const rating      = item.vote_average;
  const mediaType   = item.media_type || type;
  const href        = `/movie/${mediaType}/${item.id}`;

  return (
    <Link to={href} className="block group cursor-crosshair">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden"
        style={{
          border:     "1px solid #1a1a1a",
          transition: "border-color 0.05s linear",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#e8ff00"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
      >

        {/* ─ POSTER ─ */}
        <div className="relative overflow-hidden bg-[#0e0e0e]"
          style={{ aspectRatio: "2/3" }}>

          {item.poster_path ? (
            <img
              src={`${IMG_BASE}/w342${item.poster_path}`}
              alt={title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{
                filter:     "grayscale(30%)",
                transition: "filter 0.15s linear, transform 0.15s linear",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter    = "grayscale(0%)";
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter    = "grayscale(30%)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border border-[#1e1e1e]" />
              <p className="font-mono text-[10px] tracking-widest text-[#2a2a2a]">NO POSTER</p>
            </div>
          )}

          {/* Media type stamp — top left */}
          <div className="absolute top-0 left-0 z-10">
            <span className="font-mono text-[9px] tracking-[0.4em] px-2 py-1 block"
              style={{
                backgroundColor: "#060606",
                color:           "#444444",
                borderRight:     "1px solid #1a1a1a",
                borderBottom:    "1px solid #1a1a1a",
              }}>
              {mediaType === "tv" ? "TV" : "MV"}
            </span>
          </div>

          {/* Rating badge — top right */}
          {rating > 0 && (
            <div className="absolute top-0 right-0 z-10">
              <span className="font-mono text-[10px] font-bold px-2 py-1 block"
                style={{
                  backgroundColor: "#060606",
                  color:           ratingColor(rating),
                  borderLeft:      "1px solid #1a1a1a",
                  borderBottom:    "1px solid #1a1a1a",
                }}>
                {rating.toFixed(1)}
              </span>
            </div>
          )}

        </div>

        {/* ─ INFO BAR ─ */}
        <div className="px-3 py-3" style={{ borderTop: "1px solid #141414" }}>
          <p className="font-mono text-xs text-white tracking-wide leading-snug line-clamp-2 mb-1">
            {title.toUpperCase()}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#444444] tracking-widest">{year}</span>
            {rating > 0 && (
              <span className="font-mono text-[10px] tracking-wider"
                style={{ color: ratingColor(rating) }}>
                ★ {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

      </motion.div>
    </Link>
  );
};

export default MovieCard;