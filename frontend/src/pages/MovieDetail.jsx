import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/free-mode";

import {
  getMovieById, getVideos, getCredits,
  getSimilar, getReviews, IMG_BASE,
} from "../services/tmdb";
import api from "../services/api";
import { useSelector } from "react-redux";
import { PageTransition } from "../components/common/PageTransition";
import { MovieCard } from "../components/common/MovieCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { getYear } from "../utils/helpers";

gsap.registerPlugin(ScrollTrigger);

/* ─── Helpers ────────────────────────────────────── */
const ratingColor = (r) => r >= 7.5 ? "#e8ff00" : r >= 5 ? "#f0f0f0" : "#ff2d2d";

const MetaBlock = ({ label, value, accent }) => (
  <div className="flex flex-col gap-1 pr-8"
    style={{ borderRight: "1px solid #1e1e1e" }}>
    <span className="font-mono text-[10px] tracking-[0.5em] text-[#444444]">{label}</span>
    <span className="font-mono text-xl leading-none"
      style={{ color: accent || "#f0f0f0" }}>{value}</span>
  </div>
);

/* ─── Section heading ────────────────────────────── */
const SecHead = ({ index, title }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } }
    );
  }, []);
  return (
    <div ref={ref} className="flex items-end gap-5 pb-5 mb-8"
      style={{ borderBottom: "1px solid #1e1e1e" }}>
      <span className="font-mono text-xs text-[#333333] mb-0.5">{index}</span>
      <h2 className="font-display uppercase text-white leading-none"
        style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)" }}>{title}</h2>
    </div>
  );
};

/* ─── Cast card ──────────────────────────────────── */
const CastCard = ({ person }) => (
  <div className="group" style={{ border: "1px solid #1a1a1a", transition: "border-color 0.05s" }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2a2a"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}>
    <div className="overflow-hidden bg-[#0e0e0e]" style={{ aspectRatio: "1/1" }}>
      <img
        src={person.profile_path
          ? `${IMG_BASE}/w185${person.profile_path}`
          : null}
        alt={person.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0"
        style={{ transition: "filter 0.15s" }}
        referrerPolicy="no-referrer"
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
      {!person.profile_path && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-display text-4xl text-[#222222]">
            {person.name?.charAt(0)}
          </span>
        </div>
      )}
    </div>
    <div className="p-3" style={{ borderTop: "1px solid #1a1a1a" }}>
      <p className="font-mono text-xs text-white tracking-wide truncate">{person.name}</p>
      <p className="font-mono text-[10px] text-[#444444] tracking-wider mt-0.5 truncate">
        {person.character || "—"}
      </p>
    </div>
  </div>
);

/* ─── Review accordion ───────────────────────────── */
const ReviewItem = ({ review, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-0 py-5 group">
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs text-[#333333]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-sm text-[#888888] group-hover:text-white truncate max-w-[260px] md:max-w-none"
            style={{ transition: "color 0.05s" }}>
            {review.author}
          </span>
          {review.author_details?.rating && (
            <span className="font-mono text-xs px-2 py-0.5"
              style={{ border: "1px solid #2a2a2a", color: ratingColor(review.author_details.rating) }}>
              {review.author_details.rating}/10
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-[#333333] shrink-0 ml-4"
          style={{ transition: "color 0.05s" }}>
          {open ? "COLLAPSE ↑" : "EXPAND ↓"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <p className="font-body text-sm text-[#666666] leading-relaxed pb-6 max-w-3xl">
              {review.content?.slice(0, 800)}
              {review.content?.length > 800 && "..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Skeleton layout ────────────────────────────── */
const DetailSkeleton = () => (
  <div className="bg-[#060606] min-h-screen animate-pulse">
    <div className="w-full h-[55vh] bg-[#0e0e0e]" />
    <div className="max-w-[1700px] mx-auto px-6 md:px-14 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-3">
          <div className="bg-[#0e0e0e]" style={{ aspectRatio: "2/3" }} />
        </div>
        <div className="lg:col-span-9 space-y-6">
          <div className="h-24 bg-[#0e0e0e] w-3/4" />
          <div className="h-4 bg-[#0e0e0e] w-1/3" />
          <div className="h-20 bg-[#0e0e0e]" />
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════ */
const MovieDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useSelector(s => s.auth);

  const [movie,    setMovie]    = useState(null);
  const [videos,   setVideos]   = useState([]);
  const [credits,  setCredits]  = useState([]);
  const [similar,  setSimilar]  = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [isFav,    setIsFav]    = useState(false);
  const [favBusy,  setFavBusy]  = useState(false);
  const [favMsg,   setFavMsg]   = useState("");
  const [mouse,    setMouse]    = useState({ x: 0, y: 0 });

  const backdropRef = useRef(null);

  /* Mouse glow */
  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* Keyboard: F = toggle favorite */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "f" || e.key === "F") handleFavorite();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isFav, favBusy, movie]);

  /* Fetch all data */
  useEffect(() => {
    window.scrollTo(0, 0);
    const run = async () => {
      setLoading(true);
      try {
        const [m, v, c, s, r] = await Promise.all([
          getMovieById(id, type),
          getVideos(id, type),
          getCredits(id, type),
          getSimilar(id, type),
          getReviews(id, type),
        ]);
        setMovie(m.data);
        setVideos(v.data.results);
        setCredits(c.data.cast || []);
        setSimilar(s.data.results || []);
        setReviews(r.data.results || []);

        /* Silent watch history */
        if (isAuth) {
          api.post("/watch-history", {
            movieId:   parseInt(id),
            movieType: type,
            title:     m.data.title || m.data.name,
            poster:    m.data.poster_path,
          }).catch(() => {});
        }

        /* Check if already favorited */
        if (isAuth) {
          api.get("/favorites").then(res => {
            const favs = res.data?.data || [];
            setIsFav(favs.some(f => f.movieId === parseInt(id) && f.movieType === type));
          }).catch(() => {});
        }
      } catch (e) {
        console.error("Detail fetch:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, type, isAuth]);

  /* GSAP backdrop parallax */
  useEffect(() => {
    if (!backdropRef.current || loading) return;
    gsap.to(backdropRef.current, {
      yPercent: 22,
      ease: "none",
      scrollTrigger: {
        trigger: backdropRef.current.parentElement,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [loading]);

  /* Toggle favorite */
  const handleFavorite = async () => {
    if (!isAuth) { navigate("/login"); return; }
    if (favBusy || !movie) return;
    setFavBusy(true);
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`);
        setIsFav(false);
        setFavMsg("REMOVED FROM VAULT");
      } else {
        await api.post("/favorites", {
          movieId:   parseInt(id),
          movieType: type,
          title:     movie.title || movie.name,
          poster:    movie.poster_path,
        });
        setIsFav(true);
        setFavMsg("ADDED TO VAULT");
      }
      setTimeout(() => setFavMsg(""), 2500);
    } catch {
      setFavMsg("ACTION FAILED");
      setTimeout(() => setFavMsg(""), 2500);
    } finally {
      setFavBusy(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!movie) return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center">
      <p className="font-mono text-sm text-[#444444] tracking-widest">RECORD NOT FOUND</p>
    </div>
  );

  const trailer   = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
  const rating    = movie.vote_average || 0;
  const runtime   = movie.runtime || movie.episode_run_time?.[0];
  const releaseDate = movie.release_date || movie.first_air_date;
  const isTV      = type === "tv";

  return (
    <PageTransition>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[5]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.055) 2px,rgba(0,0,0,0.055) 4px)" }} />

      {/* Cursor glow */}
      <div className="pointer-events-none fixed z-[4] w-[500px] h-[500px] rounded-full"
        style={{ left: mouse.x - 250, top: mouse.y - 250,
          background: "radial-gradient(circle, rgba(232,255,0,0.035) 0%, transparent 65%)",
          transition: "left 0.12s ease-out, top 0.12s ease-out" }} />

      {/* Toast notification */}
      <AnimatePresence>
        {favMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50 font-mono text-xs tracking-widest px-5 py-3"
            style={{ border: "1px solid #e8ff00", backgroundColor: "#060606", color: "#e8ff00" }}>
            {favMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#060606] text-white min-h-screen overflow-x-hidden">

        {/* ══ BACKDROP ══ */}
        <div className="relative overflow-hidden" style={{ height: "62vh" }}>
          <div ref={backdropRef} className="absolute inset-0 scale-110">
            {movie.backdrop_path ? (
              <img
                src={`${IMG_BASE}/original${movie.backdrop_path}`}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.38) contrast(1.1) saturate(0.65)" }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-[#0a0a0a]" />
            )}
          </div>
          {/* Overlays */}
          <div className="absolute inset-0 z-[1]"
            style={{ background: "linear-gradient(to top, #060606 0%, rgba(6,6,6,0.3) 60%, transparent 100%)" }} />
          <div className="absolute inset-0 z-[1]"
            style={{ background: "linear-gradient(to right, rgba(6,6,6,0.7) 0%, transparent 55%)" }} />
          {/* Yellow accent left strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e8ff00] z-[2]" />
          {/* Back button */}
          <button onClick={() => navigate(-1)}
            className="absolute top-24 left-8 z-[2] font-mono text-xs tracking-[0.4em] text-[#555555] hover:text-[#e8ff00] flex items-center gap-3"
            style={{ transition: "color 0.05s" }}>
            ← BACK
          </button>
          {/* Type badge on backdrop */}
          <div className="absolute top-24 right-8 z-[2]">
            <span className="font-mono text-[10px] tracking-[0.5em] px-3 py-2"
              style={{ border: "1px solid #e8ff00", color: "#e8ff00" }}>
              {isTV ? "TV SERIES" : "FILM"}
            </span>
          </div>
        </div>

        {/* ══ MAIN CONTENT ══ */}
        <div className="max-w-[1700px] mx-auto px-6 md:px-14 -mt-40 relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* ─ POSTER COLUMN ─ */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}>

                {/* Poster */}
                <div style={{ border: "1px solid #2a2a2a", aspectRatio: "2/3", overflow: "hidden", backgroundColor: "#0e0e0e" }}>
                  {movie.poster_path ? (
                    <img
                      src={`${IMG_BASE}/w500${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="font-mono text-xs text-[#2a2a2a] tracking-widest">NO POSTER</p>
                    </div>
                  )}
                </div>

                {/* Favorite button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFavorite}
                  disabled={favBusy}
                  className="w-full mt-4 font-mono text-xs tracking-[0.35em] py-4 relative overflow-hidden"
                  style={{
                    backgroundColor: isFav ? "#e8ff00" : "#0e0e0e",
                    border: `1px solid ${isFav ? "#e8ff00" : "#2a2a2a"}`,
                    color: isFav ? "#000" : "#888888",
                    transition: "all 0.05s linear",
                  }}>
                  {favBusy ? "..." : isFav ? "✓ IN YOUR VAULT" : "+ ADD TO VAULT"}
                </motion.button>

                {/* Keyboard hint */}
                <p className="font-mono text-[10px] text-center text-[#2a2a2a] tracking-widest mt-3">
                  PRESS F TO TOGGLE
                </p>

                {/* Ratings block */}
                <div className="mt-6 p-5" style={{ border: "1px solid #1a1a1a" }}>
                  <p className="font-mono text-[10px] tracking-[0.4em] text-[#333333] mb-4">RATINGS</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display leading-none"
                      style={{ fontSize: "3.5rem", color: ratingColor(rating) }}>
                      {rating.toFixed(1)}
                    </span>
                    <span className="font-mono text-xs text-[#333333]">/ 10</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#2a2a2a]">
                    {movie.vote_count?.toLocaleString()} VOTES
                  </p>
                  {/* Rating bar */}
                  <div className="mt-4 h-[2px] bg-[#111111] relative">
                    <div className="absolute inset-y-0 left-0 h-full"
                      style={{ width: `${(rating / 10) * 100}%`, backgroundColor: ratingColor(rating), transition: "width 1s ease" }} />
                  </div>
                </div>

                {/* Spoken languages */}
                {movie.spoken_languages?.length > 0 && (
                  <div className="mt-4 p-5" style={{ border: "1px solid #1a1a1a" }}>
                    <p className="font-mono text-[10px] tracking-[0.4em] text-[#333333] mb-3">LANGUAGES</p>
                    <div className="flex flex-wrap gap-2">
                      {movie.spoken_languages.map(l => (
                        <span key={l.iso_639_1} className="font-mono text-[10px] tracking-wider px-2 py-1 text-[#555555]"
                          style={{ border: "1px solid #1e1e1e" }}>
                          {l.english_name?.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ─ INFO COLUMN ─ */}
            <div className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>

                {/* Title */}
                <h1 className="font-display uppercase text-white break-words mb-4"
                  style={{ fontSize: "clamp(3rem, 8vw, 8rem)", lineHeight: 0.88 }}>
                  {movie.title || movie.name}
                </h1>

                {/* Tagline */}
                {movie.tagline && (
                  <p className="font-mono text-sm tracking-[0.3em] text-[#e8ff00] mb-8 uppercase">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Meta strip */}
                <div className="flex flex-wrap gap-0 mb-10 py-6"
                  style={{ borderTop: "1px solid #1e1e1e", borderBottom: "1px solid #1e1e1e" }}>
                  <MetaBlock label="RATING" value={`${rating.toFixed(1)} / 10`} accent={ratingColor(rating)} />
                  <div className="px-8">
                    <MetaBlock label="YEAR" value={getYear(releaseDate)} />
                  </div>
                  {runtime && (
                    <div className="px-8" style={{ borderRight: "1px solid #1e1e1e" }}>
                      <MetaBlock label="RUNTIME" value={`${runtime} MIN`} />
                    </div>
                  )}
                  {isTV && movie.number_of_seasons && (
                    <div className="px-8" style={{ borderRight: "1px solid #1e1e1e" }}>
                      <MetaBlock label="SEASONS" value={movie.number_of_seasons} />
                    </div>
                  )}
                  {isTV && movie.number_of_episodes && (
                    <div className="px-8">
                      <MetaBlock label="EPISODES" value={movie.number_of_episodes} />
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-10">
                    {movie.genres.map(g => (
                      <span key={g.id} className="font-mono text-xs tracking-widest px-4 py-2 text-[#888888]"
                        style={{ border: "1px solid #1e1e1e", transition: "all 0.05s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#e8ff00"; e.currentTarget.style.color="#e8ff00"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="#1e1e1e"; e.currentTarget.style.color="#888888"; }}>
                        {g.name.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <div className="mb-16">
                  <SecHead index="01" title="OVERVIEW" />
                  <p className="font-body text-sm text-[#888888] leading-relaxed max-w-3xl">
                    {movie.overview || "No description available."}
                  </p>
                </div>

                {/* Production companies */}
                {movie.production_companies?.length > 0 && (
                  <div className="mb-16">
                    <SecHead index="02" title="PRODUCED BY" />
                    <div className="flex flex-wrap gap-3">
                      {movie.production_companies.slice(0, 5).map(c => (
                        <span key={c.id} className="font-mono text-xs tracking-wider px-4 py-2 text-[#555555]"
                          style={{ border: "1px solid #1a1a1a" }}>
                          {c.name.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trailer */}
                <div className="mb-16">
                  <SecHead index="03" title="TRAILER" />
                  <div className="w-full max-w-4xl overflow-hidden"
                    style={{ aspectRatio: "16/9", border: "1px solid #1e1e1e" }}>
                    {trailer ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                        title="Trailer"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                        <div className="text-center">
                          <p className="font-display text-3xl text-[#1e1e1e] uppercase mb-2">
                            TRAILER UNAVAILABLE
                          </p>
                          <p className="font-mono text-xs text-[#2a2a2a] tracking-widest">
                            NO FOOTAGE ON FILE
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cast */}
                {credits.length > 0 && (
                  <div className="mb-16">
                    <SecHead index="04" title="CAST" />
                    <Swiper
                      modules={[FreeMode]}
                      freeMode grabCursor
                      slidesPerView="auto" spaceBetween={10}>
                      {credits.slice(0, 16).map(person => (
                        <SwiperSlide key={person.cast_id || person.id} style={{ width: "150px" }}>
                          <CastCard person={person} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}

                {/* Reviews */}
                {reviews.length > 0 && (
                  <div className="mb-16">
                    <SecHead index="05" title={`REVIEWS (${reviews.length})`} />
                    <div>
                      {reviews.slice(0, 5).map((review, i) => (
                        <ReviewItem key={review.id} review={review} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar */}
                {similar.length > 0 && (
                  <div className="mb-8">
                    <SecHead index="06" title="SIMILAR CONTENT" />
                    <Swiper
                      modules={[FreeMode]}
                      freeMode grabCursor
                      slidesPerView="auto" spaceBetween={12}>
                      {similar.slice(0, 12).map(item => (
                        <SwiperSlide key={item.id} style={{ width: "200px" }}>
                          <MovieCard item={item} type={type} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-24" />
      </div>
    </PageTransition>
  );
};

export default MovieDetail;