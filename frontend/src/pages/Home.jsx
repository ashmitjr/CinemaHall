import React, { useEffect, useState, useRef } from "react";
import { getTrending, getPopularMovies, getPopularTV, getTopRated, getUpcoming, IMG_BASE } from "../services/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { PageTransition } from "../components/common/PageTransition";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getYear } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [hero, setHero] = useState(null);
  const [sections, setSections] = useState({
    trending: [],
    popularMovies: [],
    popularTV: [],
    topRated: [],
    upcoming: [],
  });
  const [gridMovies, setGridMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [t, pm, pt, tr, up] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getPopularTV(),
          getTopRated("movie"),
          getUpcoming(),
        ]);

        setHero(t.data.results[0]);
        setSections({
          trending: t.data.results,
          popularMovies: pm.data.results,
          popularTV: pt.data.results,
          topRated: tr.data.results,
          upcoming: up.data.results,
        });
        setGridMovies(pm.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Home fetch error:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    const headings = document.querySelectorAll(".section-heading");
    headings.forEach((heading) => {
      gsap.from(heading, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
        },
      });
    });
  }, [loading]);

  const loadMore = async () => {
    if (gridLoading) return;
    setGridLoading(true);
    try {
      const nextPage = page + 1;
      const res = await getPopularMovies(nextPage);
      setGridMovies((prev) => [...prev, ...res.data.results]);
      setPage(nextPage);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setGridLoading(false);
    }
  };

  const sentinelRef = useInfiniteScroll(loadMore);

  if (loading) return <div className="h-screen bg-background flex items-center justify-center font-mono text-accent">LOADING ARCHIVE...</div>;

  return (
    <PageTransition>
      <div className="relative">
        {/* Hero */}
        <section className="relative h-screen w-full overflow-hidden">
          <div ref={heroRef} className="absolute inset-0 z-0">
            <img
              src={`${IMG_BASE}/original${hero?.backdrop_path}`}
              alt={hero?.title || hero?.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase">Trending Now</span>
                <Badge variant="accent">{hero?.vote_average?.toFixed(1)}</Badge>
                <span className="font-mono text-xs text-muted">{getYear(hero?.release_date || hero?.first_air_date)}</span>
              </div>
              <h1 className="font-display text-8xl md:text-[12rem] leading-[0.85] mb-8 uppercase tracking-tighter">
                {hero?.title || hero?.name}
              </h1>
              <div className="flex flex-wrap gap-4 mb-12">
                <Button onClick={() => navigate(`/movie/${hero?.media_type}/${hero?.id}`)}>VIEW DETAILS</Button>
                <Button variant="outline">ADD TO VAULT</Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Carousels */}
        <div className="py-24 space-y-32">
          {Object.entries(sections).map(([key, items]) => (
            <section key={key} className="px-6 md:px-12">
              <div className="container mx-auto">
                <h2 className="section-heading font-display text-6xl mb-12 tracking-tight uppercase">
                  {key.replace(/([A-Z])/g, " $1")}
                </h2>
                <Swiper
                  modules={[FreeMode]}
                  freeMode={true}
                  grabCursor={true}
                  slidesPerView="auto"
                  spaceBetween={16}
                  className="!overflow-visible"
                >
                  {items.map((item) => (
                    <SwiperSlide key={item.id} className="!w-[280px]">
                      <MovieCard item={item} type={key.includes("TV") ? "tv" : "movie"} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          ))}

          {/* Grid with Infinite Scroll */}
          <section className="px-6 md:px-12">
            <div className="container mx-auto">
              <h2 className="section-heading font-display text-6xl mb-12 tracking-tight uppercase">Discover More</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gridMovies.map((item) => (
                  <MovieCard key={item.id} item={item} />
                ))}
                {gridLoading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
              <div ref={sentinelRef} className="h-20" />
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
