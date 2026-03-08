import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti, getGenres, getByGenre } from "../services/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { PageTransition } from "../components/common/PageTransition";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await getGenres("movie");
      setGenres(res.data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1, true);
  }, [debouncedQuery, selectedGenre]);

  const fetchResults = async (pageNum, isNew = false) => {
    if (loading) return;

    setLoading(true);

    try {
      let res;

      if (selectedGenre) {
        res = await getByGenre("movie", selectedGenre, pageNum);
      } else if (debouncedQuery) {
        res = await searchMulti(debouncedQuery, pageNum);
      } else {
        res = await searchMulti("a", pageNum);
      }

      const filtered = res.data.results.filter(
        (i) => i.media_type !== "person" || i.profile_path
      );

      setResults((prev) => (isNew ? filtered : [...prev, ...filtered]));
      setHasMore(res.data.page < res.data.total_pages);
    } catch (error) {
      console.error("Search error:", error);
    }

    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchResults(next);
    }
  };

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-black text-white overflow-x-hidden">

        <div className="max-w-[1400px] mx-auto">

          {/* HEADER */}
          <div className="mb-16 border-b-4 border-white pb-10">
            <h1 className="font-mono text-4xl md:text-6xl tracking-widest mb-8">
              SEARCH ARCHIVE
            </h1>

            {/* SEARCH BAR */}
            <input
              type="text"
              placeholder="TYPE TO SCAN DATABASE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black border-4 border-white px-6 py-6 text-3xl md:text-5xl font-mono uppercase tracking-widest outline-none focus:bg-white focus:text-black transition-all"
            />
          </div>

          {/* GENRE FILTER */}
          <div className="flex flex-wrap gap-4 mb-16">

            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-6 py-2 border-2 font-mono text-xs tracking-widest transition ${
                !selectedGenre
                  ? "bg-white text-black border-white"
                  : "border-white hover:bg-white hover:text-black"
              }`}
            >
              ALL
            </button>

            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-6 py-2 border-2 font-mono text-xs tracking-widest transition ${
                  selectedGenre === g.id
                    ? "bg-white text-black border-white"
                    : "border-white hover:bg-white hover:text-black"
                }`}
              >
                {g.name.toUpperCase()}
              </button>
            ))}

          </div>

          {/* RESULTS GRID */}
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

              {results.map((item, idx) =>
                item.media_type === "person" ? (

                  /* PERSON CARD */
                  <div
                    key={`${item.id}-${idx}`}
                    className="border-2 border-white p-5 flex flex-col gap-4 hover:bg-white hover:text-black transition"
                  >
                    <div className="aspect-square overflow-hidden border-2 border-white">

                      <img
                        src={
                          item.profile_path
                            ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                            : "/no-avatar.png"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />

                    </div>

                    <div>
                      <p className="font-mono text-lg uppercase tracking-wide">
                        {item.name}
                      </p>

                      <p className="text-[10px] font-mono opacity-70 tracking-widest">
                        {item.known_for_department}
                      </p>
                    </div>
                  </div>

                ) : (
                  <MovieCard key={`${item.id}-${idx}`} item={item} />
                )
              )}

              {loading &&
                Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}

            </div>
          ) : !loading && debouncedQuery && (

            <div className="h-[40vh] flex items-center justify-center border-4 border-white">

              <h2 className="text-3xl md:text-5xl font-mono uppercase tracking-widest text-center px-6">
                NO FILES FOUND FOR "{debouncedQuery}"
              </h2>

            </div>

          )}

          {/* INFINITE SCROLL SENTINEL */}
          <div ref={sentinelRef} className="h-20" />

        </div>
      </div>
    </PageTransition>
  );
};

export default Search;