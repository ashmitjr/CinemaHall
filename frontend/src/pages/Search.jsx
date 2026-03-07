import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti, getGenres, getByGenre } from "../services/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { PageTransition } from "../components/common/PageTransition";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { Badge } from "../components/ui/Badge";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";

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
        // Default popular if no query
        res = await searchMulti("a", pageNum); 
      }

      const filtered = res.data.results.filter(i => i.media_type !== "person" || i.profile_path);
      setResults(prev => isNew ? filtered : [...prev, ...filtered]);
      setHasMore(res.data.page < res.data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage);
    }
  };

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="mb-12">
            <input
              type="text"
              placeholder="SEARCH THE ARCHIVE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-4 border-border py-8 font-display text-6xl md:text-8xl uppercase outline-none focus:border-accent transition-colors placeholder:text-border"
            />
          </div>

          {/* Genres */}
          <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar mb-12">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`flex-shrink-0 px-6 py-2 font-mono text-xs uppercase border transition-all ${
                !selectedGenre ? "border-accent text-accent" : "border-border text-muted"
              }`}
            >
              All Genres
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`flex-shrink-0 px-6 py-2 font-mono text-xs uppercase border transition-all ${
                  selectedGenre === g.id ? "border-accent text-accent" : "border-border text-muted"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item, idx) => (
                item.media_type === "person" ? (
                  <div key={`${item.id}-${idx}`} className="flex flex-col items-center gap-4 p-4 border border-border bg-surface">
                    <div className="aspect-square w-full rounded-full overflow-hidden border border-border">
                      <img
                        src={item.profile_path ? `https://image.tmdb.org/t/p/w185${item.profile_path}` : "/no-avatar.png"}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-2xl uppercase leading-none mb-1">{item.name}</p>
                      <p className="font-mono text-[10px] text-muted uppercase">{item.known_for_department}</p>
                    </div>
                  </div>
                ) : (
                  <MovieCard key={`${item.id}-${idx}`} item={item} />
                )
              ))}
              {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : !loading && debouncedQuery && (
            <div className="h-64 flex items-center justify-center">
              <h2 className="font-display text-6xl md:text-8xl text-border uppercase text-center">
                No results for "{debouncedQuery}"
              </h2>
            </div>
          )}

          <div ref={sentinelRef} className="h-20" />
        </div>
      </div>
    </PageTransition>
  );
};

export default Search;
