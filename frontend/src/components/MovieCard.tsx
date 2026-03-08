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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group border-[3px] border-white bg-black text-white overflow-hidden transition-all"
    >
      <Link to={`/movie/${item.id}?type=${item.media_type || type}`}>

        {/* POSTER */}
        <div className="relative aspect-[2/3] border-b-[3px] border-white overflow-hidden">

          {posterPath ? (
            <img
              src={`${IMG_BASE}/w500${posterPath}`}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center px-4 font-mono text-xs tracking-widest">
              POSTER
              <br />
              NOT AVAILABLE
            </div>
          )}

          {/* MEDIA TYPE TAG */}
          <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-mono px-2 py-1 tracking-widest border-r-[3px] border-b-[3px] border-black">
            {(item.media_type || type).toUpperCase()}
          </div>

          {/* RATING */}
          {rating && (
            <div className="absolute bottom-0 right-0 bg-white text-black px-2 py-1 text-[10px] font-mono flex items-center gap-1 border-l-[3px] border-t-[3px] border-black">
              <Star size={10} fill="currentColor" />
              {rating}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="p-4 flex flex-col gap-2">

          <h3 className="font-mono text-sm md:text-base uppercase tracking-wide leading-tight line-clamp-2">
            {title}
          </h3>

          <div className="flex justify-between text-[10px] font-mono tracking-widest opacity-70">

            <span>
              {releaseDate?.split("-")[0] || "UNKNOWN"}
            </span>

            <span>
              ID:{item.id}
            </span>

          </div>

        </div>

      </Link>
    </motion.div>
  );
};

export default MovieCard;