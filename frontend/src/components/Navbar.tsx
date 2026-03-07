import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { Menu, X, User, LogOut, Heart, History, Shield, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "SEARCH", path: "/search" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="text-2xl font-display text-accent tracking-tighter">
        CINEMA TRIAL
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="font-mono text-sm hover:text-accent transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-6">
        {isAuth ? (
          <div className="relative group">
            <button className="flex items-center gap-2 font-mono text-sm border border-border px-4 py-2 hover:border-accent">
              <User size={16} />
              {user?.username.toUpperCase()}
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border hidden group-hover:block">
              <Link to="/favorites" className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-black font-mono text-xs">
                <Heart size={14} /> FAVORITES
              </Link>
              <Link to="/history" className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-black font-mono text-xs">
                <History size={14} /> HISTORY
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-black font-mono text-xs">
                  <Shield size={14} /> ADMIN
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600 hover:text-white font-mono text-xs text-left"
              >
                <LogOut size={14} /> LOGOUT
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="font-mono text-sm border border-border px-6 py-2 hover:bg-accent hover:text-black transition-all"
          >
            LOGIN
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-4/5 bg-surface z-[70] p-8 flex flex-col gap-8"
            >
              <div className="flex justify-between items-center">
                <span className="font-display text-xl text-accent">MENU</span>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-4xl hover:text-accent"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-border" />
                {isAuth ? (
                  <>
                    <Link to="/favorites" onClick={() => setIsOpen(false)} className="font-mono text-lg flex items-center gap-3">
                      <Heart size={20} /> FAVORITES
                    </Link>
                    <Link to="/history" onClick={() => setIsOpen(false)} className="font-mono text-lg flex items-center gap-3">
                      <History size={20} /> HISTORY
                    </Link>
                    {user?.role === "admin" && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="font-mono text-lg flex items-center gap-3">
                        <Shield size={20} /> ADMIN
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="font-mono text-lg flex items-center gap-3 text-red-500"
                    >
                      <LogOut size={20} /> LOGOUT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="font-display text-4xl text-accent"
                  >
                    LOGIN
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
