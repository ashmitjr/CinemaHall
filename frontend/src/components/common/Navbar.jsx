import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../features/auth/authSlice";
import api from "../../services/api";
import { Search, X, Menu, ChevronDown, Film, Tv, TrendingUp, Star, User, Heart, Clock, Shield, LogOut } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const { isAuth, user } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => {
    const [p] = path.split("?");
    return p === "/" ? location.pathname === "/" : location.pathname.startsWith(p);
  };

  const navLinks = [
    { name: "Trending", path: "/", icon: TrendingUp },
    { name: "Movies",   path: "/search?type=movie", icon: Film },
    { name: "TV Shows", path: "/search?type=tv",    icon: Tv },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-[#080808]/98 backdrop-blur-md border-b border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-gradient-to-b from-black/80 to-transparent border-b border-transparent"
      }`}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1 group">
            <span className="font-mono text-white font-bold tracking-[0.15em] text-base uppercase group-hover:text-[#e8ff00] transition-colors duration-200">Cinema</span>
            <span className="font-mono text-[#e8ff00] font-bold tracking-[0.15em] text-base uppercase">Trial</span>
          </Link>

          {/* Divider */}
          <div className="hidden lg:block h-5 w-px bg-white/10" />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-150 ${
                  isActive(link.path)
                    ? "bg-[#e8ff00] text-black font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                }`}>
                <link.icon size={12} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">

            {/* Search bar */}
            <div className="flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    ref={searchRef}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onSubmit={handleSearch}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search films..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/8 border border-white/15 rounded-sm px-3 py-2 font-mono text-[11px] tracking-widest text-white outline-none placeholder-white/30 focus:border-[#e8ff00]/50 transition-colors"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-150 ${
                  isSearchOpen ? "bg-[#e8ff00] text-black" : "text-white/50 hover:text-white hover:bg-white/8"
                }`}>
                {isSearchOpen ? <X size={15} /> : <Search size={15} />}
              </button>
            </div>

            {/* Auth */}
            {isAuth ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 pl-3 pr-2 py-2 rounded-sm font-mono text-[11px] tracking-[0.12em] uppercase transition-all duration-150 ${
                    isDropdownOpen ? "bg-[#e8ff00] text-black" : "text-white/60 hover:text-white hover:bg-white/8"
                  }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isDropdownOpen ? "bg-black/20" : "bg-white/10"}`}>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block max-w-[120px] truncate">{user?.name?.toUpperCase()}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-[calc(100%+8px)] right-0 w-52 bg-[#0e0e0e] border border-white/10 rounded-sm shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">Signed in as</p>
                        <p className="font-mono text-[11px] tracking-wider text-white mt-0.5 truncate">{user?.email}</p>
                      </div>

                      {/* Links */}
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

                      {/* Logout */}
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
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase bg-[#e8ff00] text-black hover:bg-white transition-colors rounded-sm font-bold">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-sm transition-all">
              <Menu size={18} />
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
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-xs bg-[#0a0a0a] border-l border-white/10 z-[120] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <span className="font-mono text-sm tracking-widest text-white/80 uppercase">Menu</span>
                <button onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded-sm transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      isActive(link.path) ? "text-[#e8ff00] bg-[#e8ff00]/8" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}>
                    <link.icon size={14} />
                    {link.name}
                  </Link>
                ))}

                <div className="mx-4 my-3 h-px bg-white/8" />

                {isAuth ? (
                  <>
                    <div className="px-5 py-3">
                      <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">Account</p>
                      <p className="font-mono text-xs text-white truncate">{user?.name}</p>
                    </div>
                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                      <Heart size={14} /> Favorites
                    </Link>
                    <Link to="/history" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                      <Clock size={14} /> History
                    </Link>
                    {user?.role === "admin" && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase text-[#e8ff00] hover:bg-[#e8ff00]/8 transition-colors">
                        <Shield size={14} /> Admin Panel
                      </Link>
                    )}
                    <div className="mx-4 my-2 h-px bg-white/8" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase text-red-400 hover:bg-red-500/10 transition-colors text-left">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 mx-4 my-2 px-4 py-3 font-mono text-[11px] tracking-[0.2em] uppercase bg-[#e8ff00] text-black font-bold hover:bg-white transition-colors rounded-sm justify-center">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
