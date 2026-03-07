import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getMovieDetails, getMovieVideos, IMG_BASE } from "../services/tmdb";
import api from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, Play, Heart } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  
  const [movie, setMovie] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [details, vids] = await Promise.all([
          getMovieDetails(id, type),
          getMovieVideos(id, type),
        ]);
        setMovie(details);
        setVideos(vids);

        // Auto-post to watch history if logged in
        if (isAuth) {
          api.post("/watch-history", {
            tmdbId: id,
            type,
            title: details.title || details.name,
            posterPath: details.poster_path,
          }).catch(() => {}); // Silent catch
        }
      } catch (err) {
        setError("FAILED TO LOAD MOVIE DETAILS");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type, isAuth]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">
      FETCHING INTEL...
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center font-mono text-red-500">
      {error}
    </div>
  );

  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Backdrop Hero */}
      <div className="relative h-[60vh] w-full">
        <img
          src={`${IMG_BASE}/original${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover grayscale opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="px-6 md:px-12 -mt-40 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Poster */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="border-4 border-accent shadow-none">
            {movie.poster_path ? (
              <img
                src={`${IMG_BASE}/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="aspect-[2/3] bg-border flex items-center justify-center font-mono text-xs uppercase">
                NO POSTER
              </div>
            )}
          </div>
          
          <button className="w-full mt-6 bg-accent text-black py-4 flex items-center justify-center gap-3 hover:scale-105 transition-transform">
            <Heart size={20} /> ADD TO FAVORITES
          </button>
        </div>

        {/* Info */}
        <div className="md:col-span-8 lg:col-span-9">
          <h1 className="text-6xl md:text-8xl mb-4 leading-none">
            {movie.title || movie.name}
          </h1>
          
          <div className="flex flex-wrap gap-6 font-mono text-sm text-accent mb-8">
            <div className="flex items-center gap-2">
              <Star size={16} fill="currentColor" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{movie.runtime || movie.episode_run_time?.[0] || "N/A"} MIN</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{movie.release_date || movie.first_air_date}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl mb-4 border-b border-border pb-2 inline-block">OVERVIEW</h2>
              <p className="font-body text-gray-300 text-lg leading-relaxed max-w-4xl">
                {movie.overview || "No description available."}
              </p>
            </div>

            <div>
              <h2 className="text-2xl mb-4 border-b border-border pb-2 inline-block">TRAILER</h2>
              <div className="aspect-video w-full max-w-4xl bg-surface border border-border flex items-center justify-center">
                {trailer ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <span className="font-mono text-gray-500 tracking-widest">TRAILER UNAVAILABLE</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetail;
