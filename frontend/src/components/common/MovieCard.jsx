import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IMG_BASE } from "../../services/tmdb";

const getYear = (date) => date?.split("-")[0] || null;

const ratingColor = (r) => {
  if (!r || r === 0) return "#333333";
  if (r >= 7.5) return "#e8ff00";
  if (r >= 5)   return "#f0f0f0";
  return "#ff2d2d";
};

export const MovieCard = ({ item, type = "movie" }) => {
  const [imgError, setImgError] = useState(false);
  if (!item) return null;

  const title     = item.title || item.name || "UNTITLED";
  const year      = getYear(item.release_date || item.first_air_date);
  const rating    = item.vote_average;
  const mediaType = item.media_type || type;

  return (
    <Link to={`/movie/${mediaType}/${item.id}`} className="block group cursor-crosshair">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden flex flex-col"
        style={{ border: "1px solid #1a1a1a", transition: "border-color 0.05s linear" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#e8ff00"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}>

        {/* POSTER */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "2/3", backgroundColor: "#0a0a0a" }}>
          {!imgError && item.poster_path ? (
            <img
              src={`${IMG_BASE}/w342${item.poster_path}`}
              alt={title}
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(25%)", transition: "filter 0.15s linear, transform 0.2s linear" }}
              onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%)"; e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(25%)"; e.currentTarget.style.transform = "scale(1)"; }}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8" style={{ border: "1px solid #1e1e1e" }} />
              <span className="font-mono" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#2a2a2a" }}>
                NO POSTER
              </span>
            </div>
          )}

          {/* Media type stamp */}
          <div className="absolute top-0 left-0"
            style={{ backgroundColor: "#060606", borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
            <span className="font-mono block px-2 py-1"
              style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#444444" }}>
              {mediaType === "tv" ? "TV" : "MV"}
            </span>
          </div>

          {/* Rating badge */}
          {rating > 0 && (
            <div className="absolute top-0 right-0"
              style={{ backgroundColor: "#060606", borderLeft: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
              <span className="font-mono block px-2 py-1 font-bold"
                style={{ fontSize: "10px", color: ratingColor(rating) }}>
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* INFO BAR */}
        <div className="p-3 flex flex-col gap-1.5"
          style={{ borderTop: "1px solid #141414", backgroundColor: "#060606" }}>
          <h3 className="font-display text-lg uppercase leading-none text-white line-clamp-1 group-hover:text-[#e8ff00]"
            style={{ transition: "color 0.05s linear" }}>
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-mono" style={{ fontSize: "9px", letterSpacing: "0.25em", color: "#444444" }}>
              {year || "—"}
            </span>
            <span className="font-mono px-1.5 py-0.5"
              style={{ fontSize: "8px", letterSpacing: "0.3em", color: "#333333", border: "1px solid #1a1a1a" }}>
              {mediaType === "tv" ? "SERIES" : "FILM"}
            </span>
          </div>
        </div>

      </motion.div>
    </Link>
  );
};

export default MovieCard;