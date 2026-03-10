import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../features/auth/authSlice";
import api from "../../services/api";
import { searchMulti, IMG_BASE } from "../../services/tmdb";
import useDebounce from "../../hooks/useDebounce";
import { Search, X, Menu, ChevronDown, Film, Tv, TrendingUp, Heart, Clock, Shield, LogOut, Star } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchResults, setSearchResults]   = useState([]);
  const [searchLoading, setSearchLoading]   = useState(false);
  const dropdownRef  = useRef(null);
  const searchRef    = useRef(null);
  const searchInput  = useRef(null);

  const { isAuth, user } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const location  = useLocation();
  const navigate  = useNavigate();
  const debouncedQuery = useDebounce(searchQuery, 350);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSearchResults([]); return; }
    const fetch = async () => {
      setSearchLoading(true);
      try {
        const res = await searchMulti(debouncedQuery, 1);
        setSearchResults(res.data.results.slice(0, 6));
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    };
    fetch();
  }, [debouncedQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInput.current) searchInput.current.focus();
  }, [isSearchOpen]);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (item) => {
    const type = item.media_type === "tv" ? "tv" : "movie";
    navigate(`/movie/${type}/${item.id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const isActive = (path) => {
    const [p] = path.split("?");
    if (p === "/") return location.pathname === "/";
    return location.pathname.startsWith(p);
  };

  const navLinks = [
    { name: "Trending", path: "/",                  icon: TrendingUp },
    { name: "Movies",   path: "/search?type=movie", icon: Film },
    { name: "TV Shows", path: "/search?type=tv",    icon: Tv },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-[#080808]/98 backdrop-blur-md border-b border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-gradient-to-b from-black/70 to-transparent border-b border-transparent"
      }`}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1 group mr-2">
            <span className="font-mono text-white font-bold tracking-[0.12em] text-sm uppercase group-hover:text-[#e8ff00] transition-colors duration-200">Cinema</span>
            <span className="font-mono text-[#e8ff00] font-bold tracking-[0.12em] text-sm uppercase">Trial</span>
          </Link>

          <div className="hidden lg:block h-5 w-px bg-white/10 mx-1" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-150 ${
                  isActive(link.path)
                    ? "bg-[#e8ff00] text-black font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                }`}>
                <link.icon size={11} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      onSubmit={handleSearchSubmit}
                      className="overflow-hidden"
                    >
                      <input
                        ref={searchInput}
                        type="text"
                        placeholder="Search films, shows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/8 border border-white/15 px-3 py-1.5 font-mono text-[11px] tracking-wider text-white outline-none placeholder-white/25 focus:border-[#e8ff00]/40 transition-colors rounded-sm"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-150 flex-shrink-0 ${
                    isSearchOpen ? "bg-[#e8ff00] text-black" : "text-white/50 hover:text-white hover:bg-white/8"
                  }`}>
                  {isSearchOpen ? <X size={14} /> : <Search size={14} />}
                </button>
              </div>

              {/* Real-time search dropdown */}
              <AnimatePresence>
                {isSearchOpen && (searchResults.length > 0 || searchLoading || searchQuery.trim()) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+10px)] right-0 w-80 bg-[#0e0e0e] border border-white/10 rounded-sm shadow-2xl shadow-black/60 overflow-hidden"
                  >
                    {searchLoading && (
                      <div className="px-4 py-3 font-mono text-[10px] tracking-widest text-white/30 uppercase">
                        Searching...
                      </div>
                    )}
                    {!searchLoading && searchResults.length === 0 && searchQuery.trim() && (
                      <div className="px-4 py-3 font-mono text-[10px] tracking-widest text-white/30 uppercase">
                        No results found
                      </div>
                    )}
                    {!searchLoading && searchResults.map((item) => (
                      <button key={item.id} onClick={() => handleResultClick(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left group">
                        <div className="w-9 h-12 flex-shrink-0 bg-white/5 rounded-sm overflow-hidden">
                          {item.poster_path
                            ? <img src={`${IMG_BASE}/w92${item.poster_path}`} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-white/20"><Film size={14} /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[11px] tracking-wide text-white truncate group-hover:text-[#e8ff00] transition-colors">
                            {item.title || item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">
                              {item.media_type === "tv" ? "TV" : "Film"}
                            </span>
                            {item.vote_average > 0 && (
                              <span className="flex items-center gap-1 font-mono text-[9px] text-white/30">
                                <Star size={8} /> {item.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    {searchResults.length > 0 && (
                      <button onClick={handleSearchSubmit}
                        className="w-full px-4 py-2.5 border-t border-white/8 font-mono text-[10px] tracking-widest text-[#e8ff00] hover:bg-[#e8ff00]/8 transition-colors uppercase text-left">
                        See all results for "{searchQuery}" →
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {isAuth ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-sm font-mono text-[10px] tracking-[0.12em] uppercase transition-all duration-150 ${
                    isDropdownOpen ? "bg-[#e8ff00] text-black" : "text-white/60 hover:text-white hover:bg-white/8"
                  }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isDropdownOpen ? "bg-black/20 text-black" : "bg-white/15 text-white"}`}>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate hidden lg:block">{user?.name?.toUpperCase()}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-[calc(100%+8px)] right-0 w-52 bg-[#0e0e0e] border border-white/10 rounded-sm shadow-2xl shadow-black/60 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">Signed in as</p>
                        <p className="font-mono text-[11px] tracking-wider text-white mt-0.5 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/favorites" onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 transition-colors uppercase">
                          <Heart size={12} /> Favorites
                        </Link>
                        <Link to="/history" onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 transition-colors uppercase">
                          <Clock size={12} /> History
                        </Link>
                        {user?.role === "admin" && (
                          <Link to="/admin" onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] text-[#e8ff00] hover:bg-[#e8ff00]/10 transition-colors uppercase">
                            <Shield size={12} /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-white/8 py-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors uppercase text-left">
                          <LogOut size={12} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase bg-[#e8ff00] text-black hover:bg-white transition-colors rounded-sm font-bold">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setIsMenuOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-sm transition-all">
              <Menu size={17} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-[82vw] max-w-xs bg-[#0a0a0a] border-l border-white/10 z-[120] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <span className="font-mono text-xs tracking-widest text-white/60 uppercase">Navigation</span>
                <button onClick={() => setIsMenuOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded-sm transition-all">
                  <X size={15} />
                </button>
              </div>

              {/* Mobile search */}
              <div className="px-4 py-3 border-b border-white/8">
                <form onSubmit={(e) => { handleSearchSubmit(e); setIsMenuOpen(false); }} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white/8 border border-white/10 px-3 py-2 font-mono text-[11px] tracking-wider text-white outline-none placeholder-white/25 focus:border-[#e8ff00]/40 rounded-sm transition-colors"
                  />
                  <button type="submit" className="w-9 h-9 flex items-center justify-center bg-[#e8ff00] text-black rounded-sm flex-shrink-0">
                    <Search size={14} />
                  </button>
                </form>
                {/* Mobile real-time results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-white/8 rounded-sm overflow-hidden">
                    {searchResults.slice(0, 4).map((item) => (
                      <button key={item.id} onClick={() => { handleResultClick(item); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                        <div className="w-7 h-10 flex-shrink-0 bg-white/5 rounded-sm overflow-hidden">
                          {item.poster_path
                            ? <img src={`${IMG_BASE}/w92${item.poster_path}`} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-white/20"><Film size={10} /></div>
                          }
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-white truncate">{item.title || item.name}</p>
                          <p className="font-mono text-[8px] text-white/30 uppercase">{item.media_type === "tv" ? "TV Show" : "Film"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      isActive(link.path) ? "text-[#e8ff00] bg-[#e8ff00]/8" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}>
                    <link.icon size={13} />
                    {link.name}
                  </Link>
                ))}

                <div className="mx-4 my-2 h-px bg-white/8" />

                {isAuth ? (
                  <>
                    <div className="px-5 py-3">
                      <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">Account</p>
                      <p className="font-mono text-xs text-white truncate">{user?.name}</p>
                    </div>
                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                      <Heart size={13} /> Favorites
                    </Link>
                    <Link to="/history" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                      <Clock size={13} /> History
                    </Link>
                    {user?.role === "admin" && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-[#e8ff00] hover:bg-[#e8ff00]/8 transition-colors">
                        <Shield size={13} /> Admin Panel
                      </Link>
                    )}
                    <div className="mx-4 my-2 h-px bg-white/8" />
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-red-400 hover:bg-red-500/10 transition-colors text-left">
                      <LogOut size={13} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                      Login
                    </Link>
                    <div className="px-4 py-2">
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase bg-[#e8ff00] text-black font-bold hover:bg-white transition-colors rounded-sm">
                        Register
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
};
