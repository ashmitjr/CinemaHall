import React, { useEffect, useState, useRef } from "react";
import { getTrending, getPopular, IMG_BASE } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [popularTV, setPopularTV] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, pm, pt] = await Promise.all([
          getTrending(),
          getPopular("movie"),
          getPopular("tv"),
        ]);
        setTrending(t);
        setPopularMovies(pm);
        setPopularTV(pt);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && trending.length > 0) {
      gsap.to(heroRef.current, {
        backgroundPositionY: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".section-heading", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".section-heading",
          start: "top 80%",
        },
      });
    }
  }, [loading, trending]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">
      LOADING CINEMA TRIAL...
    </div>
  );

  const heroItem = trending[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative h-[80vh] w-full bg-cover bg-center flex items-end p-6 md:p-12"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(10,10,10,1), rgba(10,10,10,0.3)), url(${IMG_BASE}/original${heroItem?.backdrop_path})`,
        }}
      >
        <div ref={heroContentRef} className="max-w-4xl">
          <span className="font-mono text-accent text-sm mb-4 block tracking-widest">TRENDING NOW</span>
          <h1 className="text-6xl md:text-9xl mb-6 leading-none">
            {heroItem?.title || heroItem?.name}
          </h1>
          <p className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mb-8 line-clamp-3">
            {heroItem?.overview || "No description available."}
          </p>
          <button 
            onClick={() => window.location.href = `/movie/${heroItem.id}?type=${heroItem.media_type}`}
            className="bg-accent text-black px-10 py-4 text-lg hover:scale-105 transition-transform"
          >
            VIEW DETAILS
          </button>
        </div>
      </div>

      {/* Carousels */}
      <div className="px-6 md:px-12 mt-20 space-y-20">
        <section>
          <h2 className="section-heading text-4xl mb-8 border-l-4 border-accent pl-4">TRENDING THIS WEEK</h2>
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            grabCursor={true}
            slidesPerView={1.5}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4.5 },
              1440: { slidesPerView: 5.5 },
            }}
          >
            {trending.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section>
          <h2 className="section-heading text-4xl mb-8 border-l-4 border-accent pl-4">POPULAR MOVIES</h2>
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            grabCursor={true}
            slidesPerView={1.5}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4.5 },
              1440: { slidesPerView: 5.5 },
            }}
          >
            {popularMovies.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard item={item} type="movie" />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section>
          <h2 className="section-heading text-4xl mb-8 border-l-4 border-accent pl-4">POPULAR TV SHOWS</h2>
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            grabCursor={true}
            slidesPerView={1.5}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4.5 },
              1440: { slidesPerView: 5.5 },
            }}
          >
            {popularTV.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard item={item} type="tv" />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </motion.div>
  );
};

export default Home;
