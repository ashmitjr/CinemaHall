import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { Menu, X, User, LogOut, Heart, History, Shield } from "lucide-react";
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
    <nav className="sticky top-0 z-50 bg-black text-white border-b-4 border-white px-6 md:px-12 py-5 flex items-center justify-between overflow-x-hidden">

      {/* LOGO */}
      <Link
        to="/"
        className="font-mono text-xl md:text-2xl tracking-widest border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition"
      >
        CINEMA.TRIAL
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="font-mono text-sm tracking-widest border-2 border-transparent px-4 py-2 hover:border-white transition"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* DESKTOP USER MENU */}
      <div className="hidden md:flex items-center gap-6">

        {isAuth ? (
          <div className="relative group">

            <button className="flex items-center gap-2 font-mono border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition">
              <User size={16} />
              {user?.username.toUpperCase()}
            </button>

            <div className="absolute right-0 top-full mt-2 w-52 bg-black border-2 border-white opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">

              <Link
                to="/favorites"
                className="flex items-center gap-3 px-4 py-3 border-b border-white font-mono text-xs hover:bg-white hover:text-black"
              >
                <Heart size={14} /> FAVORITES
              </Link>

              <Link
                to="/history"
                className="flex items-center gap-3 px-4 py-3 border-b border-white font-mono text-xs hover:bg-white hover:text-black"
              >
                <History size={14} /> HISTORY
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 border-b border-white font-mono text-xs hover:bg-white hover:text-black"
                >
                  <Shield size={14} /> ADMIN
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 font-mono text-xs hover:bg-red-600"
              >
                <LogOut size={14} /> LOGOUT
              </button>

            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="font-mono border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition"
          >
            LOGIN
          </Link>
        )}
      </div>

      {/* MOBILE BUTTON */}
      <button
        className="md:hidden border-2 border-white p-2"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[60]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25 }}
              className="fixed right-0 top-0 h-full w-4/5 bg-black border-l-4 border-white z-[70] p-8 flex flex-col gap-10"
            >

              {/* CLOSE */}
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg tracking-widest">
                  NAVIGATION
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="border-2 border-white p-2"
                >
                  <X size={22} />
                </button>
              </div>

              {/* LINKS */}
              <div className="flex flex-col gap-8">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-mono border-b-2 border-white pb-2"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t-2 border-white pt-6 flex flex-col gap-6">

                  {isAuth ? (
                    <>
                      <Link
                        to="/favorites"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 font-mono text-lg"
                      >
                        <Heart size={20} /> FAVORITES
                      </Link>

                      <Link
                        to="/history"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 font-mono text-lg"
                      >
                        <History size={20} /> HISTORY
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 font-mono text-lg"
                        >
                          <Shield size={20} /> ADMIN
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 font-mono text-lg text-red-500"
                      >
                        <LogOut size={20} /> LOGOUT
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-mono border-2 border-white px-6 py-3 text-center"
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

    </nav>
  );
};

export default Navbar;