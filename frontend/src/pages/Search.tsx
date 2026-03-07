import React, { useState, useEffect } from "react";
import { searchMulti } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchMulti(debouncedQuery);
        setResults(data.filter((item: any) => item.media_type !== "person"));
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 md:px-12 py-12 min-h-screen"
    >
      <div className="max-w-4xl mx-auto mb-20">
        <h1 className="text-6xl md:text-8xl mb-8">SEARCH</h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE MOVIE OR TV SHOW NAME..."
            className="w-full text-2xl md:text-4xl py-6 border-b-4 border-border focus:border-accent transition-colors"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-border" size={32} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-surface animate-pulse border border-border" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      ) : debouncedQuery ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <span className="font-mono text-4xl md:text-6xl text-border text-center">
            NO RESULTS FOR "{debouncedQuery.toUpperCase()}"
          </span>
          <p className="font-mono text-gray-500">TRY A DIFFERENT KEYWORD</p>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <span className="font-mono text-2xl text-border">START TYPING TO DISCOVER</span>
        </div>
      )}
    </motion.div>
  );
};

export default Search;
