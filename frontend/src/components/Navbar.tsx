import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../features/auth/authSlice";
import api from "../services/api";

/* ─── Nav links ──────────────────────────────────── */
const NAV_LINKS = [
  { label: "HOME",   path: "/"       },
  { label: "SEARCH", path: "/search" },
];

/* ─── Themes ─────────────────────────────────────── */
const THEMES = [
  { key: "dark",  label: "D", title: "DARK"  },
  { key: "light", label: "L", title: "LIGHT" },
  { key: "sepia", label: "S", title: "SEPIA" },
];

/* ─── useTheme ───────────────────────────────────── */
const useTheme = () => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("ct-theme") || "dark"
  );
  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("ct-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return [theme, setTheme];
};

/* ═══════════════════════════════════════════════════ */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector(s => s.auth);

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [scrolled,     setScrolled]     = useState(false);
  const [theme,        setTheme]        = useTheme();

  const searchRef   = useRef(null);
  const dropdownRef = useRef(null);

  /* Close on route change */
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  /* Scroll detection */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Focus search input */
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const h = (e) => {
      if (
        e.key === "/" &&
        !searchOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setDropdownOpen(false);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [searchOpen]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* ══ MAIN NAVBAR ══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-[50]"
        style={{
          backgroundColor: scrolled ? "rgba(6,6,6,0.97)" : "#060606",
          borderBottom:    `1px solid ${scrolled ? "#1e1e1e" : "#141414"}`,
          transition:      "background-color 0.2s, border-color 0.2s",
        }}>

        {/* Accent line — top */}
        <div className="h-[2px] w-full bg-[#e8ff00]" />

        <div className="flex items-stretch h-[54px] px-5 md:px-10 max-w-[1800px] mx-auto">

          {/* ─ LOGO ─ */}
          <Link to="/"
            className="flex items-center font-display uppercase text-white shrink-0 pr-8"
            style={{
              fontSize:      "1.55rem",
              lineHeight:    1,
              borderRight:   "1px solid #1a1a1a",
              letterSpacing: "0.04em",
            }}>
            CINEMA<span style={{ color: "#e8ff00" }}>TRIAL</span>
          </Link>

          {/* ─ DESKTOP LINKS ─ */}
          <div className="hidden md:flex items-stretch">
            {NAV_LINKS.map(link => {
              const active = isActive(link.path);
              return (
                <Link key={link.label} to={link.path}
                  className="flex items-center font-mono text-xs tracking-[0.4em] px-6"
                  style={{
                    color:           active ? "#000000" : "#666666",
                    backgroundColor: active ? "#e8ff00" : "transparent",
                    borderRight:     "1px solid #1a1a1a",
                    transition:      "background-color 0.05s, color 0.05s",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#666666"; }}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ─ SPACER ─ */}
          <div className="flex-1" />

          {/* ─ SEARCH ─ */}
          <div className="hidden md:flex items-stretch" style={{ borderLeft: "1px solid #1a1a1a" }}>
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form key="open"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleSearch}
                  className="flex items-center overflow-hidden"
                  style={{ borderRight: "1px solid #1a1a1a" }}>
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="SEARCH ARCHIVE..."
                    className="h-full px-4 bg-transparent font-mono text-xs tracking-widest text-white outline-none placeholder-[#2a2a2a] w-full"
                    style={{ caretColor: "#e8ff00" }}
                  />
                  <button type="button" onClick={() => setSearchOpen(false)}
                    className="px-4 font-mono text-sm text-[#444444] hover:text-[#ff2d2d] shrink-0"
                    style={{ transition: "color 0.05s" }}>×</button>
                </motion.form>
              ) : (
                <motion.button key="closed"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-5 font-mono text-xs tracking-[0.4em] text-[#555555] hover:text-white"
                  style={{ transition: "color 0.05s" }}>
                  ⌕
                  <span className="hidden lg:inline">SEARCH</span>
                  <span className="hidden lg:inline font-mono text-[10px] px-1.5 py-0.5 text-[#2a2a2a]"
                    style={{ border: "1px solid #1e1e1e" }}>/</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ─ THEME TOGGLE ─ */}
          <div className="hidden md:flex items-center gap-1.5 px-4" style={{ borderLeft: "1px solid #1a1a1a" }}>
            {THEMES.map(t => (
              <button key={t.key} onClick={() => setTheme(t.key)} title={t.title}
                className="font-mono text-[10px] w-6 h-6 flex items-center justify-center"
                style={{
                  border:     `1px solid ${theme === t.key ? "#e8ff00" : "#1e1e1e"}`,
                  color:      theme === t.key ? "#e8ff00" : "#333333",
                  transition: "all 0.05s",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ─ AUTH ─ */}
          <div className="hidden md:flex items-stretch" style={{ borderLeft: "1px solid #1a1a1a" }}>
            {isAuth ? (
              <div ref={dropdownRef} className="relative flex items-stretch">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-3 px-5 font-mono text-xs tracking-[0.35em]"
                  style={{
                    color:           dropdownOpen ? "#000000" : "#888888",
                    backgroundColor: dropdownOpen ? "#e8ff00" : "transparent",
                    transition:      "all 0.05s",
                  }}>
                  <span className="w-5 h-5 flex items-center justify-center font-mono text-[10px] shrink-0"
                    style={{ border: `1px solid ${dropdownOpen ? "#000" : "#333333"}` }}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span className="hidden lg:inline max-w-[90px] truncate">
                    {(user?.name || "ACCOUNT").toUpperCase()}
                  </span>
                  <span style={{ fontSize: "8px" }}>{dropdownOpen ? "▲" : "▼"}</span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 top-full w-52 z-10"
                      style={{
                        backgroundColor: "#0a0a0a",
                        border:          "1px solid #2a2a2a",
                        borderTop:       "2px solid #e8ff00",
                        marginTop:       "1px",
                      }}>

                      {/* User info */}
                      <div className="px-4 py-4" style={{ borderBottom: "1px solid #1a1a1a" }}>
                        <p className="font-mono text-xs text-white truncate">{user?.name}</p>
                        <p className="font-mono text-[10px] text-[#333333] truncate mt-0.5">{user?.email}</p>
                      </div>

                      {[
                        { label: "FAVORITES", path: "/favorites", symbol: "♥" },
                        { label: "HISTORY",   path: "/history",   symbol: "◷" },
                      ].map(item => (
                        <Link key={item.path} to={item.path}
                          className="flex items-center gap-3 px-4 py-3 font-mono text-xs text-[#666666] hover:text-white hover:bg-[#111111]"
                          style={{ borderBottom: "1px solid #111111", transition: "all 0.05s" }}>
                          <span className="text-[#333333] shrink-0">{item.symbol}</span>
                          {item.label}
                        </Link>
                      ))}

                      {user?.role === "admin" && (
                        <Link to="/admin"
                          className="flex items-center gap-3 px-4 py-3 font-mono text-xs text-[#e8ff00] hover:bg-[#111111]"
                          style={{ borderBottom: "1px solid #111111", transition: "background-color 0.05s" }}>
                          <span style={{ fontSize: "10px" }}>⬡</span>
                          ADMIN PANEL
                        </Link>
                      )}

                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 font-mono text-xs text-[#555555] hover:text-[#ff2d2d]"
                        style={{ transition: "color 0.05s" }}>
                        <span>→</span> SIGN OUT
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center px-6 font-mono text-xs tracking-[0.4em] text-[#888888] hover:text-black hover:bg-[#e8ff00]"
                style={{ transition: "all 0.05s" }}>
                LOGIN
              </Link>
            )}
          </div>

          {/* ─ MOBILE MENU BUTTON ─ */}
          <button
            className="md:hidden flex items-center px-4 font-mono text-xs tracking-widest text-[#666666] hover:text-white"
            style={{ borderLeft: "1px solid #1a1a1a", transition: "color 0.05s" }}
            onClick={() => setDrawerOpen(true)}>
            MENU
          </button>

        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: "56px" }} />

      {/* ══ MOBILE DRAWER ══ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60]"
              style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed right-0 top-0 h-full z-[70] flex flex-col overflow-y-auto"
              style={{
                width:           "min(340px, 88vw)",
                backgroundColor: "#060606",
                borderLeft:      "1px solid #1e1e1e",
                borderTop:       "2px solid #e8ff00",
              }}>

              {/* Header */}
              <div className="flex items-center justify-between px-7 py-5"
                style={{ borderBottom: "1px solid #1a1a1a" }}>
                <span className="font-display text-2xl text-white uppercase">MENU</span>
                <button onClick={() => setDrawerOpen(false)}
                  className="font-mono text-xs tracking-widest text-[#444444] hover:text-white px-3 py-2"
                  style={{ border: "1px solid #1e1e1e", transition: "color 0.05s" }}>
                  CLOSE ×
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col" style={{ borderBottom: "1px solid #1a1a1a" }}>
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link.path);
                  return (
                    <Link key={link.label} to={link.path}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-5 px-7 py-5"
                      style={{
                        borderBottom: "1px solid #111111",
                        borderLeft:   active ? "3px solid #e8ff00" : "3px solid transparent",
                        color:        active ? "#e8ff00" : "#888888",
                        transition:   "all 0.05s",
                      }}>
                      <span className="font-mono text-xs text-[#333333]">{String(i+1).padStart(2,"0")}</span>
                      <span className="font-display uppercase" style={{ fontSize: "2rem", lineHeight: 1 }}>
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Auth section */}
              <div className="flex flex-col px-7 py-6 gap-4">
                {isAuth ? (
                  <>
                    <div className="flex items-center gap-3 mb-2 pb-5"
                      style={{ borderBottom: "1px solid #1a1a1a" }}>
                      <div className="w-8 h-8 flex items-center justify-center font-mono text-xs text-[#e8ff00] shrink-0"
                        style={{ border: "1px solid #e8ff00" }}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-white truncate">{user?.name}</p>
                        <p className="font-mono text-[10px] text-[#333333] truncate">{user?.email}</p>
                      </div>
                    </div>

                    {[
                      { label: "FAVORITES", path: "/favorites", symbol: "♥" },
                      { label: "HISTORY",   path: "/history",   symbol: "◷" },
                    ].map(item => (
                      <Link key={item.path} to={item.path}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-4 font-mono text-sm tracking-widest text-[#666666] hover:text-white py-2"
                        style={{ transition: "color 0.05s" }}>
                        <span className="text-[#333333]">{item.symbol}</span>
                        {item.label}
                      </Link>
                    ))}

                    {user?.role === "admin" && (
                      <Link to="/admin" onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-4 font-mono text-sm tracking-widest text-[#e8ff00] py-2">
                        <span>⬡</span> ADMIN PANEL
                      </Link>
                    )}

                    <button onClick={handleLogout}
                      className="flex items-center gap-4 font-mono text-sm tracking-widest text-[#555555] hover:text-[#ff2d2d] py-2 mt-2"
                      style={{ transition: "color 0.05s" }}>
                      <span>→</span> SIGN OUT
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link to="/login" onClick={() => setDrawerOpen(false)}
                      className="w-full text-center font-mono text-xs tracking-[0.4em] py-4 text-black bg-[#e8ff00]">
                      LOGIN
                    </Link>
                    <Link to="/register" onClick={() => setDrawerOpen(false)}
                      className="w-full text-center font-mono text-xs tracking-[0.4em] py-4 text-[#666666]"
                      style={{ border: "1px solid #1e1e1e" }}>
                      CREATE ACCOUNT
                    </Link>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <div className="mt-auto px-7 py-5" style={{ borderTop: "1px solid #1a1a1a" }}>
                <p className="font-mono text-[10px] tracking-[0.5em] text-[#333333] mb-3">THEME</p>
                <div className="flex gap-2">
                  {THEMES.map(t => (
                    <button key={t.key} onClick={() => setTheme(t.key)}
                      className="flex-1 font-mono text-xs py-2"
                      style={{
                        border:          `1px solid ${theme === t.key ? "#e8ff00" : "#1e1e1e"}`,
                        color:           theme === t.key ? "#e8ff00" : "#333333",
                        backgroundColor: theme === t.key ? "rgba(232,255,0,0.05)" : "transparent",
                        transition:      "all 0.05s",
                      }}>
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;