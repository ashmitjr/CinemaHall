import React from "react";
import { Link } from "react-router-dom";
import { IMG_BASE } from "../services/tmdb";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface MovieCardProps {
  item: any;
  type?: "movie" | "tv";
  key?: React.Key;
}

const MovieCard = ({ item, type = "movie" }: MovieCardProps) => {
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const posterPath = item.poster_path;
  const rating = item.vote_average?.toFixed(1);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group relative bg-surface border border-border hover:border-accent transition-colors overflow-hidden"
    >
      <Link to={`/movie/${item.id}?type=${item.media_type || type}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          {posterPath ? (
            <img
              src={`${IMG_BASE}/w500${posterPath}`}
              alt={title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-border flex items-center justify-center p-4 text-center font-mono text-xs uppercase">
              NO POSTER AVAILABLE
            </div>
          )}
          
          <div className="absolute top-0 right-0 bg-accent text-black font-mono text-[10px] px-2 py-1 uppercase font-bold">
            {item.media_type || type}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg leading-tight mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center justify-between font-mono text-[10px] text-gray-400">
            <span>{releaseDate?.split("-")[0] || "N/A"}</span>
            <div className="flex items-center gap-1 text-accent">
              <Star size={10} fill="currentColor" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
