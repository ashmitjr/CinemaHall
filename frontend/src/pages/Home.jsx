import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/free-mode";

import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRated,
  getUpcoming,
  getNowPlaying,
  IMG_BASE,
} from "../services/tmdb";
import api from "../services/api";
import { MovieCard } from "../components/common/MovieCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { PageTransition } from "../components/common/PageTransition";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getYear } from "../utils/helpers";

gsap.registerPlugin(ScrollTrigger);

/* ─── Film Grain ─────────────────────────────────── */
const FilmGrain = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let timer;
    const draw = () => {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
      const img = ctx.createImageData(c.width, c.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 22;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 16;
      }
      ctx.putImageData(img, 0, 0);
      timer = setTimeout(draw, 80);
    };
    draw();
    return () => clearTimeout(timer);
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[6]" />;
};

/* ─── Section Heading ────────────────────────────── */
const SectionHeading = ({ index, title, count }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } }
    );
  }, []);
  return (
    <div ref={ref} className="flex items-end justify-between pb-5 mb-10"
      style={{ borderBottom: "2px solid #1e1e1e" }}>
      <div className="flex items-end gap-6">
        <span className="font-mono text-xs tracking-[0.5em] text-[#333333] mb-1">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-display uppercase leading-none text-white"
          style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)" }}>
          {title}
        </h2>
      </div>
      {count > 0 && (
        <span className="font-mono text-xs tracking-widest text-[#444444] mb-1">
          {count} TITLES
        </span>
      )}
    </div>
  );
};

/* ─── Carousel Section ───────────────────────────── */
const CarouselSection = ({ index, title, items, type, loading }) => (
  <section className="px-6 md:px-14">
    <div className="max-w-[1700px] mx-auto">
      <SectionHeading index={index} title={title} count={items.length} />
      {loading ? (
        <div className="flex gap-5 overflow-hidden">
          {Array(6).fill(null).map((_, i) => <div key={i} className="shrink-0 w-[220px]"><SkeletonCard /></div>)}
        </div>
      ) : (
        <Swiper
          modules={[FreeMode]}
          freeMode
          grabCursor
          slidesPerView="auto"
          spaceBetween={14}
        >
          {items.map((item, i) => (
            <SwiperSlide key={item.id} style={{ width: "220px" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
              >
                <MovieCard item={item} type={type} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  </section>
);

/* ─── Hero Rating ────────────────────────────────── */
const HeroRating = ({ rating }) => {
  const num = parseFloat(rating);
  const color = num >= 7.5 ? "var(--color-accent)" : num >= 5 ? "#f0f0f0" : "#ff2d2d";
  return (
    <span className="font-mono text-sm font-bold" style={{ color }}>
      {num.toFixed(1)}
    </span>
  );
};

/* ─── Main Component ─────────────────────────────── */
const Home = () => {
  const navigate  = useNavigate();
  const { isAuth } = useSelector(s => s.auth);

  const [hero, setHero]         = useState(null);
  const [heroIdx, setHeroIdx]   = useState(0);
  const [heroList, setHeroList] = useState([]);
  const [sections, setSections] = useState({
    trending: [], popularMovies: [], popularTV: [],
    topRated: [], upcoming: [], nowPlaying: [],
  });
  const [gridMovies, setGridMovies] = useState([]);
  const [gridPage, setGridPage]     = useState(1);
  const [gridLoading, setGridLoading] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [mouse, setMouse]           = useState({ x: 0, y: 0 });
  const [heroReady, setHeroReady]   = useState(false);

  const heroRef    = useRef(null);
  const heroImgRef = useRef(null);
  const tickRef    = useRef(null);

  /* Mouse glow */
  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* Fetch all data */
  useEffect(() => {
    const run = async () => {
      try {
        const [t, pm, pt, tr, up, np] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getPopularTV(),
          getTopRated("movie"),
          getUpcoming(),
          getNowPlaying(),
        ]);
        const trending = t.data.results;
        setHeroList(trending.slice(0, 6));
        setHero(trending[0]);
        setSections({
          trending:     trending,
          popularMovies: pm.data.results,
          popularTV:    pt.data.results,
          topRated:     tr.data.results,
          upcoming:     up.data.results,
          nowPlaying:   np.data.results,
        });
        setGridMovies(pm.data.results);
      } catch (e) {
        console.error("Home fetch:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  /* Auto-cycle hero */
  useEffect(() => {
    if (heroList.length === 0) return;
    tickRef.current = setInterval(() => {
      setHeroIdx(i => {
        const next = (i + 1) % heroList.length;
        setHero(heroList[next]);
        setHeroReady(false);
        return next;
      });
    }, 7000);
    return () => clearInterval(tickRef.current);
  }, [heroList]);

  /* GSAP hero parallax */
  useEffect(() => {
    if (!heroImgRef.current || loading) return;
    gsap.to(heroImgRef.current, {
      yPercent: 28,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [loading]);

  /* Load more grid */
  const loadMore = useCallback(async () => {
    if (gridLoading) return;
    setGridLoading(true);
    try {
      const next = gridPage + 1;
      const res  = await getPopularMovies(next);
      setGridMovies(prev => [...prev, ...res.data.results]);
      setGridPage(next);
    } catch (e) {
      console.error("Load more:", e);
    } finally {
      setGridLoading(false);
    }
  }, [gridPage, gridLoading]);

  const sentinelRef = useInfiniteScroll(loadMore);

  /* Add to favorites */
  const handleFavorite = async () => {
    if (!isAuth) { navigate("/login"); return; }
    if (!hero || favLoading) return;
    setFavLoading(true);
    try {
      await api.post("/favorites", {
        movieId:   hero.id,
        movieType: hero.media_type || "movie",
        title:     hero.title || hero.name,
        poster:    hero.poster_path,
      });
    } catch (e) {
      /* Already saved is fine */
    } finally {
      setFavLoading(false);
    }
  };

  /* Full-page loader */
  if (loading) {
    return (
      <div className="h-screen bg-[#060606] flex flex-col items-center justify-center gap-6">
        <motion.div className="w-16 h-16 border-2 border-[#1e1e1e] relative"
          animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <div className="absolute inset-1 border border-[var(--color-accent)]" />
        </motion.div>
        <p className="font-mono text-xs tracking-[0.6em] text-[#444444]">LOADING ARCHIVE</p>
      </div>
    );
  }

  const heroType  = hero?.media_type || "movie";
  const heroTitle = hero?.title || hero?.name || "";
  const heroBg    = hero?.backdrop_path
    ? `${IMG_BASE}/original${hero.backdrop_path}`
    : null;

  return (
    <PageTransition>
      <FilmGrain />

      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[5]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.055) 2px,rgba(0,0,0,0.055) 4px)" }} />

      {/* Cursor glow */}
      <div className="pointer-events-none fixed z-[4] w-[500px] h-[500px] rounded-full"
        style={{ left: mouse.x - 250, top: mouse.y - 250,
          background: "radial-gradient(circle, rgba(232,255,0,0.04) 0%, transparent 65%)",
          transition: "left 0.12s ease-out, top 0.12s ease-out" }} />

      <div className="bg-[#060606] text-white overflow-x-hidden min-h-screen">

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative w-full overflow-hidden"
          style={{ height: "100svh", minHeight: "600px" }}>

          {/* Backdrop */}
          <AnimatePresence mode="wait">
            <motion.div key={hero?.id} ref={heroImgRef}
              className="absolute inset-0 scale-110"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}>
              {heroBg ? (
                <img src={heroBg} alt={heroTitle}
                  className="w-full h-full object-cover"
                  style={{ filter: "contrast(1.1) brightness(0.45) saturate(0.7)" }}
                  onLoad={() => setHeroReady(true)}
                />
              ) : (
                <div className="w-full h-full bg-[#0e0e0e]" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Hard overlay gradient — bottom fade */}
          <div className="absolute inset-0 z-[1]"
            style={{ background: "linear-gradient(to top, #060606 0%, rgba(6,6,6,0.55) 50%, rgba(6,6,6,0.2) 100%)" }} />

          {/* Left vignette */}
          <div className="absolute inset-0 z-[1]"
            style={{ background: "linear-gradient(to right, rgba(6,6,6,0.85) 0%, transparent 60%)" }} />

          {/* Film strip accent — left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)] z-[2]" />

          {/* Hero content */}
          <div className="relative z-[2] h-full flex flex-col justify-end px-8 md:px-16 pb-16 md:pb-24 max-w-[1800px] mx-auto">

            <AnimatePresence mode="wait">
              <motion.div key={hero?.id}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {/* Type badge */}
                  <span className="font-mono text-[10px] tracking-[0.5em] px-3 py-1.5"
                    style={{ border: "1px solid #e8ff00", color: "var(--color-accent)" }}>
                    {heroType === "tv" ? "TV SERIES" : "FILM"}
                  </span>
                  {/* Rating */}
                  <div className="flex items-center gap-2 font-mono text-xs tracking-wider"
                    style={{ border: "1px solid #2a2a2a", padding: "6px 12px" }}>
                    <span className="text-[#555555]">RATING</span>
                    <HeroRating rating={hero?.vote_average || 0} />
                    <span className="text-[#333333]">/ 10</span>
                  </div>
                  {/* Year */}
                  <span className="font-mono text-xs tracking-widest text-[#555555]">
                    {getYear(hero?.release_date || hero?.first_air_date)}
                  </span>
                  {/* Genre pills (if available) */}
                  {hero?.genre_ids?.slice(0, 2).map(g => (
                    <span key={g} className="font-mono text-[10px] tracking-widest text-[#444444]">
                      #{g}
                    </span>
                  ))}
                </div>

                {/* Big title */}
                <h1 className="font-display uppercase leading-[0.85] text-white mb-8 break-words"
                  style={{ fontSize: "clamp(3.5rem, 10vw, 11rem)", textShadow: "0 0 80px rgba(0,0,0,0.8)" }}>
                  {heroTitle}
                </h1>

                {/* Overview */}
                {hero?.overview && (
                  <p className="font-body text-sm text-[#888888] mb-10 max-w-xl leading-relaxed line-clamp-3">
                    {hero.overview}
                  </p>
                )}

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/movie/${heroType}/${hero?.id}`)}
                    className="font-mono text-sm tracking-[0.3em] uppercase bg-[var(--color-accent)] text-black px-8 py-4 hover:bg-white"
                    style={{ transition: "background-color 0.05s linear" }}>
                    VIEW RECORD →
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleFavorite}
                    disabled={favLoading}
                    className="font-mono text-sm tracking-[0.3em] uppercase text-[#888888] px-8 py-4"
                    style={{ border: "1px solid #2a2a2a", transition: "color 0.05s, border-color 0.05s" }}
                    onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="var(--color-accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color="#888888"; e.currentTarget.style.borderColor="#2a2a2a"; }}>
                    {favLoading ? "SAVING..." : "+ ADD TO VAULT"}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hero dot navigation */}
            <div className="flex items-center gap-3 mt-10">
              {heroList.map((_, i) => (
                <button key={i}
                  onClick={() => { setHeroIdx(i); setHero(heroList[i]); clearInterval(tickRef.current); }}
                  className="h-[2px] transition-all duration-150"
                  style={{
                    width: i === heroIdx ? "32px" : "12px",
                    backgroundColor: i === heroIdx ? "var(--color-accent)" : "#2a2a2a",
                  }}
                />
              ))}
              <span className="font-mono text-[10px] tracking-widest text-[#333333] ml-3">
                {String(heroIdx + 1).padStart(2, "0")} / {String(heroList.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 right-8 z-[2] flex flex-col items-center gap-2">
            <motion.div className="w-[1px] h-12 bg-[#2a2a2a] origin-top"
              animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
            <span className="font-mono text-[9px] tracking-[0.5em] text-[#333333]"
              style={{ writingMode: "vertical-lr" }}>SCROLL</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TICKER BAR
        ══════════════════════════════════════════════ */}
        <div className="border-y border-[#1a1a1a] overflow-hidden py-3 bg-[#080808]">
          <motion.div className="flex gap-16 whitespace-nowrap font-mono text-[10px] tracking-[0.4em] text-[#2a2a2a]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            {Array(6).fill([
              "TRENDING THIS WEEK", "POPULAR FILMS", "CRITICALLY ACCLAIMED",
              "NOW PLAYING", "UPCOMING RELEASES", "TOP RATED SERIES"
            ]).flat().map((t, i) => (
              <span key={i}>{t} <span className="text-[var(--color-accent)] mx-2">·</span></span>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════
            CAROUSEL SECTIONS
        ══════════════════════════════════════════════ */}
        <div className="py-24 space-y-24">

          <CarouselSection index={1} title="TRENDING THIS WEEK"
            items={sections.trending} type="movie" loading={loading} />

          <CarouselSection index={2} title="POPULAR FILMS"
            items={sections.popularMovies} type="movie" loading={loading} />

          <CarouselSection index={3} title="POPULAR SERIES"
            items={sections.popularTV} type="tv" loading={loading} />

          <CarouselSection index={4} title="TOP RATED"
            items={sections.topRated} type="movie" loading={loading} />

          {/* ── EDITORIAL BREAK ── */}
          <EditorialBreak />

          <CarouselSection index={5} title="NOW PLAYING"
            items={sections.nowPlaying} type="movie" loading={loading} />

          <CarouselSection index={6} title="COMING SOON"
            items={sections.upcoming} type="movie" loading={loading} />

        </div>

        {/* ══════════════════════════════════════════════
            DISCOVERY GRID
        ══════════════════════════════════════════════ */}
        <section className="px-6 md:px-14 pb-32">
          <div className="max-w-[1700px] mx-auto">

            <SectionHeading index={7} title="DISCOVER MORE" count={gridMovies.length} />

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {gridMovies.map((item, i) => (
                <motion.div key={`${item.id}-${i}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min((i % 12) * 0.03, 0.25) }}>
                  <MovieCard item={item} type="movie" />
                </motion.div>
              ))}
              {gridLoading && Array(12).fill(null).map((_, i) => <SkeletonCard key={i} />)}
            </div>

            {/* Sentinel */}
            <div ref={sentinelRef} className="h-24 flex items-center justify-center">
              {gridLoading && (
                <p className="font-mono text-xs tracking-[0.5em] text-[#333333]">
                  LOADING MORE...
                </p>
              )}
            </div>

          </div>
        </section>

      </div>
    </PageTransition>
  );
};

/* ─── Editorial break between carousels ─────────── */
const EditorialBreak = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 1,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } }
    );
  }, []);
  return (
    <div ref={ref} className="px-6 md:px-14">
      <div className="max-w-[1700px] mx-auto">
        <div className="border border-[#1a1a1a] p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          style={{ borderLeft: "3px solid #e8ff00" }}>
          <div>
            <p className="font-mono text-[10px] tracking-[0.6em] text-[var(--color-accent)] mb-4">
              CINEMA TRIAL / ARCHIVE
            </p>
            <h3 className="font-display text-white uppercase leading-[0.85]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
              YOUR FILM<br />UNIVERSE.
            </h3>
          </div>
          <div className="space-y-3">
            {[
              ["10,000+", "TITLES IN ARCHIVE"],
              ["HD",      "TRAILERS EMBEDDED"],
              ["JWT",     "SECURED VAULT"],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-4">
                <span className="font-display text-3xl text-[var(--color-accent)] leading-none">{v}</span>
                <span className="font-mono text-xs tracking-widest text-[#444444]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;