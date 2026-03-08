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
          getSimilar(id, type)
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
            posterPath: m.data.poster_path
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


  if (loading)
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center font-mono tracking-widest">
        RETRACING INTEL...
      </div>
    );


  const trailer = videos.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );


  return (

<PageTransition>

<div className="bg-black text-white min-h-screen overflow-x-hidden">


{/* HERO BACKDROP */}

<div className="relative border-b-2 border-white">

<img
src={`${IMG_BASE}/original${movie?.backdrop_path}`}
alt=""
className="w-full h-[60vh] object-cover grayscale contrast-125"
referrerPolicy="no-referrer"
/>

</div>


<div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">


<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">


{/* POSTER COLUMN */}

<div className="lg:col-span-4">

<motion.div
initial={{ opacity:0, x:-20 }}
animate={{ opacity:1, x:0 }}
className="border-2 border-white p-2 bg-black"
>

<img
src={
movie?.poster_path
? `${IMG_BASE}/w500${movie?.poster_path}`
: "/no-poster.png"
}
alt={movie?.title}
className="w-full h-auto"
referrerPolicy="no-referrer"
/>

</motion.div>


<div className="mt-8 flex flex-col gap-4">

<Button
variant={isFavorite ? "primary" : "outline"}
className="w-full border-2 border-white font-mono tracking-[0.25em] py-4"
onClick={() => setIsFavorite(!isFavorite)}
>

{isFavorite ? "IN YOUR VAULT" : "ADD TO VAULT"}

</Button>

</div>

</div>


{/* INFO COLUMN */}

<div className="lg:col-span-8">


<motion.div
initial={{ opacity:0, y:20 }}
animate={{ opacity:1, y:0 }}
>


<h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.85] uppercase tracking-tight mb-6 break-words">

{movie?.title || movie?.name}

</h1>


{movie?.tagline && (

<p className="font-mono text-sm text-accent tracking-[0.35em] uppercase mb-10">

{movie.tagline}

</p>

)}


{/* META */}

<div className="flex flex-wrap gap-10 mb-14 border-y-2 border-white py-6">


<div className="flex flex-col">

<span className="font-mono text-[10px] uppercase text-gray-400 mb-1">
Rating
</span>

<span className="font-mono text-2xl text-accent">
{movie?.vote_average?.toFixed(1)}
</span>

</div>


<div className="flex flex-col">

<span className="font-mono text-[10px] uppercase text-gray-400 mb-1">
Release
</span>

<span className="font-mono text-2xl">
{getYear(movie?.release_date || movie?.first_air_date)}
</span>

</div>


<div className="flex flex-col">

<span className="font-mono text-[10px] uppercase text-gray-400 mb-1">
Runtime
</span>

<span className="font-mono text-2xl">
{movie?.runtime || movie?.episode_run_time?.[0] || "N/A"} MIN
</span>

</div>


</div>


{/* GENRES */}

<div className="flex flex-wrap gap-3 mb-16">

{movie?.genres?.map((g) => (

<Badge key={g.id} variant="accent">

{g.name}

</Badge>

))}

</div>


{/* OVERVIEW */}

<div className="mb-24">

<h2 className="font-display text-4xl uppercase border-b-2 border-white pb-4 mb-6">

Overview

</h2>

<p className="font-body text-lg text-gray-300 leading-relaxed max-w-3xl">

{movie?.overview || "No description available."}

</p>

</div>


{/* TRAILER */}

<div className="mb-24">

<h2 className="font-display text-4xl uppercase border-b-2 border-white pb-4 mb-8">

Trailer

</h2>

<div className="aspect-video w-full max-w-4xl border-2 border-white overflow-hidden">

{trailer ? (

<iframe
src={`https://www.youtube.com/embed/${trailer.key}`}
title="Trailer"
className="w-full h-full"
allowFullScreen
/>

) : (

<div className="w-full h-full flex items-center justify-center font-mono tracking-widest">

TRAILER UNAVAILABLE

</div>

)}

</div>

</div>


{/* CAST */}

<div className="mb-24">

<h2 className="font-display text-4xl uppercase border-b-2 border-white pb-4 mb-8">

Cast

</h2>

<Swiper
modules={[FreeMode]}
freeMode={true}
grabCursor={true}
slidesPerView="auto"
spaceBetween={20}
>

{credits.slice(0, 15).map((person) => (

<SwiperSlide key={person.id} className="!w-[160px]">

<div className="border-2 border-white p-3 text-center">


<img
src={
person.profile_path
? `${IMG_BASE}/w185${person.profile_path}`
: "/no-avatar.png"
}
alt={person.name}
className="w-full aspect-square object-cover grayscale mb-3"
referrerPolicy="no-referrer"
/>

<p className="font-mono text-xs uppercase leading-tight">

{person.name}

</p>

<p className="font-mono text-[10px] text-gray-400 uppercase">

{person.character}

</p>

</div>

</SwiperSlide>

))}

</Swiper>

</div>


{/* SIMILAR */}

<div>

<h2 className="font-display text-4xl uppercase border-b-2 border-white pb-4 mb-8">

Similar Content

</h2>

<Swiper
modules={[FreeMode]}
freeMode={true}
grabCursor={true}
slidesPerView="auto"
spaceBetween={20}
>

{similar.map((item) => (

<SwiperSlide key={item.id} className="!w-[240px]">

<div className="border-2 border-white">

<MovieCard item={item} type={type} />

</div>

</SwiperSlide>

))}

</Swiper>

</div>


</motion.div>

</div>


</div>

</div>

</div>

</PageTransition>

);

};

export default MovieDetail;