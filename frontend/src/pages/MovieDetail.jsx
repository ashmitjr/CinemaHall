import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, getVideos, getCredits, getSimilar, IMG_BASE } from "../services/tmdb";
import api from "../services/api";
import { useSelector } from "react-redux";
import { PageTransition } from "../components/common/PageTransition";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { motion } from "framer-motion";
import { getYear } from "../utils/helpers";
import { MovieCard } from "../components/common/MovieCard";

const MovieDetail = () => {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const { isAuth } = useSelector((s) => s.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [m, v, c, s] = await Promise.all([
          getMovieById(id, type),
          getVideos(id, type),
          getCredits(id, type),
          getSimilar(id, type),
        ]);

        setMovie(m.data);
        setVideos(v.data.results);
        setCredits(c.data.cast);
        setSimilar(s.data.results);

        if (isAuth) {
          api.post("/watch-history", {
            tmdbId: id,
            type,
            title: m.data.title || m.data.name,
            posterPath: m.data.poster_path,
          }).catch(() => {});
        }
      } catch (error) {
        console.error("Detail fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type, isAuth]);

  if (loading) return <div className="h-screen bg-background flex items-center justify-center font-mono text-accent">RETRACING INTEL...</div>;

  const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        {/* Backdrop */}
        <div className="fixed inset-0 z-0">
          <img
            src={`${IMG_BASE}/original${movie?.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 pt-32 pb-24 px-6 md:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Poster */}
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-border p-1 bg-surface"
                >
                  <img
                    src={movie?.poster_path ? `${IMG_BASE}/w500${movie?.poster_path}` : "/no-poster.png"}
                    alt={movie?.title}
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="mt-8 flex flex-col gap-4">
                  <Button
                    variant={isFavorite ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    {isFavorite ? "IN YOUR VAULT" : "ADD TO FAVORITES"}
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="font-display text-8xl md:text-[10rem] leading-none mb-4 uppercase tracking-tighter">
                    {movie?.title || movie?.name}
                  </h1>
                  {movie?.tagline && (
                    <p className="font-mono text-accent text-sm tracking-widest uppercase mb-8">
                      {movie.tagline}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-6 mb-12">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-muted uppercase mb-1">Rating</span>
                      <span className="font-mono text-2xl text-accent">{movie?.vote_average?.toFixed(1)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-muted uppercase mb-1">Release</span>
                      <span className="font-mono text-2xl">{getYear(movie?.release_date || movie?.first_air_date)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-muted uppercase mb-1">Runtime</span>
                      <span className="font-mono text-2xl">{movie?.runtime || movie?.episode_run_time?.[0] || "N/A"} MIN</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-12">
                    {movie?.genres?.map((g) => (
                      <Badge key={g.id} variant="accent">{g.name}</Badge>
                    ))}
                  </div>

                  <div className="mb-16">
                    <h2 className="font-display text-4xl mb-6 uppercase tracking-tight">Overview</h2>
                    <p className="font-body text-lg text-muted leading-relaxed max-w-3xl">
                      {movie?.overview || "No description available."}
                    </p>
                  </div>

                  {/* Trailer */}
                  <div className="mb-24">
                    <h2 className="font-display text-4xl mb-8 uppercase tracking-tight">Trailer</h2>
                    <div className="aspect-video w-full max-w-4xl border border-border bg-surface overflow-hidden">
                      {trailer ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${trailer.key}`}
                          title="Trailer"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-muted tracking-widest">
                          TRAILER UNAVAILABLE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cast */}
                  <div className="mb-24">
                    <h2 className="font-display text-4xl mb-8 uppercase tracking-tight">Cast</h2>
                    <Swiper
                      modules={[FreeMode]}
                      freeMode={true}
                      grabCursor={true}
                      slidesPerView="auto"
                      spaceBetween={16}
                    >
                      {credits.slice(0, 15).map((person) => (
                        <SwiperSlide key={person.id} className="!w-[160px]">
                          <div className="flex flex-col gap-4">
                            <div className="aspect-square rounded-full overflow-hidden border border-border">
                              <img
                                src={person.profile_path ? `${IMG_BASE}/w185${person.profile_path}` : "/no-avatar.png"}
                                alt={person.name}
                                className="w-full h-full object-cover grayscale"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-center">
                              <p className="font-mono text-[10px] text-white uppercase leading-tight mb-1">{person.name}</p>
                              <p className="font-mono text-[8px] text-muted uppercase leading-tight">{person.character}</p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* Similar */}
                  <div>
                    <h2 className="font-display text-4xl mb-8 uppercase tracking-tight">Similar Content</h2>
                    <Swiper
                      modules={[FreeMode]}
                      freeMode={true}
                      grabCursor={true}
                      slidesPerView="auto"
                      spaceBetween={16}
                    >
                      {similar.map((item) => (
                        <SwiperSlide key={item.id} className="!w-[240px]">
                          <MovieCard item={item} type={type} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MovieDetail;
