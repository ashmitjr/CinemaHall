import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { searchMulti, getGenres, getByGenre, IMG_BASE } from "../services/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { PageTransition } from "../components/common/PageTransition";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

gsap.registerPlugin(ScrollTrigger);

/* ─── Filter types ───────────────────────────────── */
const TYPES = [
  { key: "all",    label: "ALL"    },
  { key: "movie",  label: "FILMS"  },
  { key: "tv",     label: "SERIES" },
  { key: "person", label: "PEOPLE" },
];

const SORTS = [
  { key: "popularity", label: "POPULARITY" },
  { key: "rating",     label: "RATING"     },
  { key: "date",       label: "RELEASE"    },
  { key: "title",      label: "TITLE A–Z"  },
];

/* ─── Person card ────────────────────────────────── */
const PersonCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/person/${item.id}`)}
      className="group cursor-crosshair"
      style={{ border: "1px solid #1e1e1e", transition: "border-color 0.05s linear" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-accent)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}>

      {/* Avatar */}
      <div className="aspect-square overflow-hidden bg-[#0e0e0e] relative">
        {item.profile_path ? (
          <img
            src={`${IMG_BASE}/w342${item.profile_path}`}
            alt={item.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0"
            style={{ transition: "filter 0.15s linear" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl text-[#222222]">
              {item.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Overlay badge */}
        <div className="absolute top-2 left-2">
          <span className="font-mono text-[9px] tracking-[0.4em] px-2 py-1 bg-[#060606] text-[#555555]"
            style={{ border: "1px solid #1e1e1e" }}>
            PERSON
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3" style={{ borderTop: "1px solid #1a1a1a" }}>
        <p className="font-mono text-xs tracking-wider text-white truncate">
          {item.name}
        </p>
        <p className="font-mono text-[10px] tracking-widest text-[#444444] mt-1 truncate">
          {item.known_for_department?.toUpperCase() || "—"}
        </p>
        {item.known_for?.length > 0 && (
          <p className="font-mono text-[9px] text-[#333333] mt-1 truncate">
            {item.known_for.map(k => k.title || k.name).slice(0, 2).join(" · ")}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Result count ───────────────────────────────── */
const ResultCount = ({ count, query, loading }) => {
  if (loading || count === 0) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs tracking-widest text-[#444444]">
        {count} RESULTS
      </span>
      {query && (
        <>
          <span className="text-[#1e1e1e]">—</span>
          <span className="font-mono text-xs tracking-widest text-[#333333]">
            FOR "{query.toUpperCase()}"
          </span>
        </>
      )}
    </motion.div>
  );
};

/* ─── Main ───────────────────────────────────────── */
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef     = useRef(null);
  const headingRef   = useRef(null);

  const [query, setQuery]               = useState(searchParams.get("q") || "");
  const [results, setResults]           = useState([]);
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(false);
  const [hasMore, setHasMore]           = useState(true);
  const [genres, setGenres]             = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [activeType, setActiveType]     = useState("all");
  const [activeSort, setActiveSort]     = useState("popularity");
  const [totalResults, setTotalResults] = useState(0);
  const [focused, setFocused]           = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  /* Keyboard shortcut: / focuses input */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") inputRef.current?.blur();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* GSAP heading reveal */
  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
    );
  }, []);

  /* Load genres */
  useEffect(() => {
    getGenres("movie")
      .then(r => setGenres(r.data.genres))
      .catch(() => {});
  }, []);

  /* Sync query → URL */
  useEffect(() => {
    if (debouncedQuery) setSearchParams({ q: debouncedQuery });
    else setSearchParams({});
  }, [debouncedQuery]);

  /* Sort helper */
  const sortResults = useCallback((arr, sortKey) => {
    const copy = [...arr];
    if (sortKey === "rating")     return copy.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    if (sortKey === "date")       return copy.sort((a, b) => new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0));
    if (sortKey === "title")      return copy.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
    return copy; // popularity — TMDB default order
  }, []);

  /* Filter by type */
  const filterByType = useCallback((arr, type) => {
    if (type === "all") return arr;
    return arr.filter(item => (item.media_type || "movie") === type);
  }, []);

  /* Fetch */
  const fetchResults = useCallback(async (pageNum, isNew = false) => {
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

      let items = res.data.results.filter(i =>
        i.media_type !== "person" || i.profile_path
      );
      items = filterByType(items, activeType);
      items = sortResults(items, activeSort);

      setTotalResults(res.data.total_results || 0);
      setResults(prev => isNew ? items : [...prev, ...items]);
      setHasMore(res.data.page < res.data.total_pages);
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedGenre, activeType, activeSort, loading, filterByType, sortResults]);

  /* Re-fetch on filter changes */
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1, true);
  }, [debouncedQuery, selectedGenre, activeType, activeSort]);

  /* Load more */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchResults(next, false);
    }
  }, [loading, hasMore, page, fetchResults]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  const showEmpty = !loading && results.length === 0 && (debouncedQuery || selectedGenre);

  return (
    <PageTransition>

      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[5]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.055) 2px,rgba(0,0,0,0.055) 4px)" }} />

      <div className="bg-[#060606] text-white min-h-screen overflow-x-hidden">

        {/* ── HEADER BLOCK ── */}
        <div className="pt-28 pb-0 px-6 md:px-14">
          <div className="max-w-[1700px] mx-auto">

            {/* Top meta row */}
            <div ref={headingRef} className="flex items-center gap-4 mb-6">
              <div className="w-1 h-8 bg-[var(--color-accent)]" />
              <span className="font-mono text-xs tracking-[0.5em] text-[var(--color-accent)]">SEARCH ARCHIVE</span>
              <span className="font-mono text-xs text-[#1e1e1e]">/</span>
              <span className="font-mono text-xs tracking-widest text-[#333333]">DATABASE SCAN</span>
            </div>

            {/* Giant input */}
            <div className="relative mb-0"
              style={{ borderBottom: `2px solid ${focused ? "var(--color-accent)" : "#1e1e1e"}`, transition: "border-color 0.05s linear" }}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="SCAN DATABASE..."
                spellCheck={false}
                className="w-full bg-transparent font-display uppercase text-white outline-none pb-5 placeholder-[#1e1e1e] tracking-wider"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 7rem)",
                  caretColor: "var(--color-accent)",
                  lineHeight: 1,
                }}
              />
              {/* Shortcut hint */}
              {!focused && !query && (
                <div className="absolute right-0 bottom-6 flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-[#2a2a2a]">PRESS</span>
                  <span className="font-mono text-[10px] px-2 py-1 text-[#333333]"
                    style={{ border: "1px solid #2a2a2a" }}>/</span>
                  <span className="font-mono text-[10px] tracking-widest text-[#2a2a2a]">TO FOCUS</span>
                </div>
              )}
              {/* Clear button */}
              {query && (
                <button onClick={() => setQuery("")}
                  className="absolute right-0 bottom-5 font-mono text-xs tracking-widest text-[#555555] hover:text-[#ff2d2d]"
                  style={{ transition: "color 0.05s" }}>
                  CLEAR ×
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="sticky top-[60px] z-10 bg-[#060606] border-b border-[#1a1a1a] px-6 md:px-14 py-0">
          <div className="max-w-[1700px] mx-auto flex items-stretch justify-between gap-0 overflow-x-auto">

            {/* Type filters */}
            <div className="flex items-stretch">
              {TYPES.map(t => (
                <button key={t.key}
                  onClick={() => setActiveType(t.key)}
                  className="font-mono text-xs tracking-[0.3em] px-5 py-4 relative"
                  style={{
                    color: activeType === t.key ? "#000" : "#555555",
                    backgroundColor: activeType === t.key ? "var(--color-accent)" : "transparent",
                    transition: "background-color 0.05s, color 0.05s",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-[1px] bg-[#1a1a1a] mx-4 self-stretch" />

            {/* Sort */}
            <div className="flex items-stretch gap-0">
              <span className="font-mono text-[10px] tracking-widest text-[#2a2a2a] self-center px-3">
                SORT
              </span>
              {SORTS.map(s => (
                <button key={s.key}
                  onClick={() => setActiveSort(s.key)}
                  className="font-mono text-xs tracking-[0.25em] px-4 py-4"
                  style={{
                    color: activeSort === s.key ? "var(--color-accent)" : "#333333",
                    borderBottom: activeSort === s.key ? "2px solid #e8ff00" : "2px solid transparent",
                    transition: "color 0.05s, border-color 0.05s",
                  }}>
                  {s.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ── GENRE PILLS ── */}
        <div className="px-6 md:px-14 py-5 border-b border-[#111111] overflow-x-auto">
          <div className="max-w-[1700px] mx-auto flex items-center gap-3 flex-nowrap">
            <span className="font-mono text-[10px] tracking-widest text-[#2a2a2a] shrink-0">GENRE</span>
            <button
              onClick={() => setSelectedGenre(null)}
              className="font-mono text-[10px] tracking-widest px-4 py-2 shrink-0"
              style={{
                border: `1px solid ${!selectedGenre ? "var(--color-accent)" : "#1e1e1e"}`,
                color: !selectedGenre ? "var(--color-accent)" : "#444444",
                transition: "all 0.05s",
              }}>
              ALL
            </button>
            {genres.map(g => (
              <button key={g.id}
                onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
                className="font-mono text-[10px] tracking-widest px-4 py-2 shrink-0"
                style={{
                  border: `1px solid ${selectedGenre === g.id ? "var(--color-accent)" : "#1e1e1e"}`,
                  color: selectedGenre === g.id ? "var(--color-accent)" : "#444444",
                  transition: "all 0.05s",
                }}>
                {g.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div className="px-6 md:px-14 py-10 pb-32">
          <div className="max-w-[1700px] mx-auto">

            <ResultCount count={totalResults} query={debouncedQuery} loading={loading} />

            {/* Grid */}
            <AnimatePresence mode="wait">
              {results.length > 0 && (
                <motion.div key="results"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.map((item, i) => (
                    <motion.div key={`${item.id}-${i}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min((i % 12) * 0.025, 0.2) }}>
                      {item.media_type === "person"
                        ? <PersonCard item={item} />
                        : <MovieCard item={item} type={item.media_type || "movie"} />
                      }
                    </motion.div>
                  ))}
                  {loading && Array(12).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Initial skeleton */}
            {loading && results.length === 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array(18).fill(null).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty state */}
            <AnimatePresence>
              {showEmpty && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 gap-6"
                  style={{ border: "1px solid #1a1a1a", borderLeft: "3px solid #ff2d2d" }}>
                  <p className="font-display text-[#1e1e1e] uppercase text-center"
                    style={{ fontSize: "clamp(2rem, 5vw, 5rem)", lineHeight: 0.88 }}>
                    NO FILES<br />FOUND
                  </p>
                  {debouncedQuery && (
                    <p className="font-mono text-sm tracking-widest text-[#333333]">
                      QUERY: "{debouncedQuery.toUpperCase()}"
                    </p>
                  )}
                  <button onClick={() => { setQuery(""); setSelectedGenre(null); }}
                    className="font-mono text-xs tracking-[0.4em] text-[#555555] hover:text-[var(--color-accent)] mt-4"
                    style={{ transition: "color 0.05s" }}>
                    ← CLEAR FILTERS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sentinel */}
            <div ref={sentinelRef} className="h-20 flex items-center justify-center">
              {loading && results.length > 0 && (
                <p className="font-mono text-xs tracking-[0.5em] text-[#333333]">
                  SCANNING MORE...
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Search;