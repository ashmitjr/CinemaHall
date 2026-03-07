import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../features/auth/authSlice";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isAuth, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "TRENDING", path: "/" },
    { name: "MOVIES", path: "/search?type=movie" },
    { name: "TV SHOWS", path: "/search?type=tv" },
    { name: "SEARCH", path: "/search" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[90] transition-none border-b border-[#222222] ${
          isScrolled ? "bg-[#0a0a0a]" : "bg-[#0a0a0a]/95"
        }`}
      >
        {/* Top ticker bar */}
        <div className="border-b border-[#222222] overflow-hidden">
          <div className="flex whitespace-nowrap animate-[ticker_20s_linear_infinite]">
            {Array(6).fill(null).map((_, i) => (
              <span key={i} className="font-mono text-[10px] tracking-[0.3em] text-[#333333] px-8 py-1 inline-block">
                CINEMA TRIAL &nbsp;/&nbsp; DISCOVER &nbsp;/&nbsp; WATCH &nbsp;/&nbsp; EXPLORE &nbsp;/&nbsp; ARCHIVE &nbsp;/&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 flex items-stretch justify-between h-14">

          {/* Logo — hard left, bordered right */}
          <Link
            to="/"
            className="font-display text-[2rem] tracking-[0.05em] leading-none flex items-center pr-8 border-r border-[#222222] hover:text-[#e8ff00] transition-none group"
          >
            <span className="group-hover:text-[#e8ff00]">CINEMA</span>
            <span className="text-[#e8ff00] ml-1">TRIAL</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-stretch">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-mono text-[10px] tracking-[0.25em] flex items-center px-6 border-r border-[#222222] transition-none relative
                  ${isActive(link.path)
                    ? "bg-[#e8ff00] text-black"
                    : "text-[#888888] hover:text-white hover:bg-[#111111]"
                  }`}
              >
                {isActive(link.path) && (
                  <span className="mr-2 text-black font-bold">—</span>
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-stretch ml-auto">

            {/* Search */}
            <div className="flex items-stretch border-l border-[#222222]">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "linear" }}
                    onSubmit={handleSearch}
                    className="overflow-hidden flex items-center border-r border-[#222222]"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="TYPE TO SEARCH..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full bg-[#111111] border-none px-4 font-mono text-[11px] tracking-widest text-white outline-none placeholder-[#444444]"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`px-5 font-mono text-[10px] tracking-[0.2em] transition-none flex items-center gap-2
                  ${isSearchOpen ? "bg-[#e8ff00] text-black" : "text-[#888888] hover:text-white hover:bg-[#111111]"}`}
              >
                {isSearchOpen ? "CLOSE" : "SEARCH"}
              </button>
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-stretch border-l border-[#222222]">
              {isAuth ? (
                <div className="relative flex items-stretch">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`px-6 font-mono text-[10px] tracking-[0.2em] flex items-center gap-3 transition-none
                      ${isDropdownOpen ? "bg-[#e8ff00] text-black" : "text-[#888888] hover:text-white hover:bg-[#111111]"}`}
                  >
                    <span className="w-2 h-2 bg-[#e8ff00] inline-block" />
                    {user?.name?.toUpperCase() || "ACCOUNT"}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, ease: "linear" }}
                          className="absolute top-full right-0 w-56 bg-[#0a0a0a] border border-[#222222] border-t-[#e8ff00]"
                        >
                          {/* Dropdown header */}
                          <div className="px-4 py-3 border-b border-[#222222]">
                            <p className="font-mono text-[9px] tracking-[0.3em] text-[#555555]">LOGGED IN AS</p>
                            <p className="font-mono text-[11px] tracking-widest text-white mt-1">{user?.name?.toUpperCase()}</p>
                          </div>

                          <Link
                            to="/favorites"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center justify-between px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-[#888888] hover:bg-[#111111] hover:text-white border-b border-[#1a1a1a] transition-none"
                          >
                            FAVORITES <span className="text-[#333333]">—</span>
                          </Link>
                          <Link
                            to="/history"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center justify-between px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-[#888888] hover:bg-[#111111] hover:text-white border-b border-[#1a1a1a] transition-none"
                          >
                            HISTORY <span className="text-[#333333]">—</span>
                          </Link>
                          {user?.role === "admin" && (
                            <Link
                              to="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center justify-between px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-[#e8ff00] hover:bg-[#e8ff00] hover:text-black border-b border-[#1a1a1a] transition-none"
                            >
                              ADMIN PANEL <span>*</span>
                            </Link>
                          )}
                          <button
                            onClick={() => { dispatch(logout()); setIsDropdownOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-[#ff2d2d] hover:bg-[#ff2d2d] hover:text-white transition-none text-left"
                          >
                            LOGOUT <span>X</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 font-mono text-[10px] tracking-[0.2em] text-[#888888] hover:bg-[#e8ff00] hover:text-black flex items-center transition-none"
                >
                  LOGIN
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden px-5 border-l border-[#222222] font-mono text-[10px] tracking-widest text-[#888888] hover:text-white hover:bg-[#111111] transition-none"
              onClick={() => setIsMenuOpen(true)}
            >
              MENU
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-[100]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "linear" }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-xs bg-[#0a0a0a] border-r-2 border-[#e8ff00] z-[110] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#222222]">
                <span className="font-display text-2xl tracking-tight">NAVIGATION</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="font-mono text-[10px] tracking-widest text-[#888888] hover:text-white px-3 py-2 border border-[#222222] hover:border-white transition-none"
                >
                  CLOSE
                </button>
              </div>

              {/* Nav links — large brutal typography */}
              <div className="flex flex-col flex-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-display text-5xl px-6 py-5 border-b border-[#1a1a1a] flex items-center justify-between transition-none
                      ${isActive(link.path) ? "text-[#e8ff00]" : "text-white hover:text-[#e8ff00] hover:bg-[#111111]"}`}
                  >
                    {link.name}
                    <span className="font-mono text-[11px] tracking-widest text-[#333333]">0{i + 1}</span>
                  </Link>
                ))}

                <div className="border-t-2 border-[#222222] mt-auto">
                  {isAuth ? (
                    <>
                      <div className="px-6 py-4 border-b border-[#1a1a1a]">
                        <p className="font-mono text-[9px] tracking-[0.3em] text-[#555555]">ACCOUNT</p>
                        <p className="font-mono text-sm tracking-widest text-white mt-1">{user?.name?.toUpperCase()}</p>
                      </div>
                      <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-mono text-xs tracking-widest text-[#888888] hover:text-white border-b border-[#1a1a1a] transition-none">
                        FAVORITES
                      </Link>
                      <Link to="/history" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-mono text-xs tracking-widest text-[#888888] hover:text-white border-b border-[#1a1a1a] transition-none">
                        HISTORY
                      </Link>
                      {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-mono text-xs tracking-widest text-[#e8ff00] hover:bg-[#e8ff00] hover:text-black border-b border-[#1a1a1a] transition-none">
                          ADMIN PANEL
                        </Link>
                      )}
                      <button
                        onClick={() => { dispatch(logout()); setIsMenuOpen(false); }}
                        className="w-full text-left px-6 py-4 font-mono text-xs tracking-widest text-[#ff2d2d] hover:bg-[#ff2d2d] hover:text-white transition-none"
                      >
                        LOGOUT
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-5 font-display text-4xl text-[#e8ff00] hover:bg-[#e8ff00] hover:text-black transition-none"
                    >
                      LOGIN
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-[calc(theme(spacing.14)+1.5rem)]" />
    </>
  );
};