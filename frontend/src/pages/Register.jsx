import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { PageTransition } from "../components/common/PageTransition";

// ─── Typewriter hook ──────────────────────────────────────────────────────────
const useTypewriter = (text, speed = 60, delay = 0) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text]);
  return { displayed, done };
};

// ─── Glitch text ──────────────────────────────────────────────────────────────
const GlitchText = ({ text }) => {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const loop = () => {
      setTimeout(() => {
        setGlitch(true);
        setTimeout(() => { setGlitch(false); loop(); }, 150);
      }, 2500 + Math.random() * 3000);
    };
    loop();
  }, []);
  return (
    <span className="relative inline-block">
      <span style={{ opacity: glitch ? 0 : 1 }}>{text}</span>
      {glitch && (
        <>
          <span
            className="absolute inset-0 text-[#ff2d2d]"
            style={{ clipPath: "inset(20% 0 55% 0)", transform: "translateX(-4px)" }}
          >{text}</span>
          <span
            className="absolute inset-0 text-[#e8ff00]"
            style={{ clipPath: "inset(55% 0 10% 0)", transform: "translateX(4px)" }}
          >{text}</span>
        </>
      )}
    </span>
  );
};

// ─── Film grain ───────────────────────────────────────────────────────────────
const FilmGrain = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let timer;
    const draw = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 28;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 22;
      }
      ctx.putImageData(img, 0, 0);
      timer = setTimeout(draw, 80);
    };
    draw();
    return () => clearTimeout(timer);
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[4]" />;
};

// ─── Animated counter (matches Login) ────────────────────────────────────────
const Counter = ({ target, suffix = "", delay = 0 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / 40;
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(interval); }
        else setVal(Math.floor(start));
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return <>{val}{suffix}</>;
};

// ─── Fields definition ────────────────────────────────────────────────────────
const FIELDS = [
  { key: "name",     label: "FULL NAME",     type: "text",     placeholder: "WHO ARE YOU?",      idx: "01" },
  { key: "email",    label: "EMAIL ADDRESS", type: "email",    placeholder: "YOUR@DOMAIN.COM",   idx: "02" },
  { key: "password", label: "ACCESS CODE",  type: "password", placeholder: "MIN 8 CHARACTERS",  idx: "03" },
];

// ─── Register page ────────────────────────────────────────────────────────────
const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [mouse,    setMouse]    = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { displayed: headline } = useTypewriter("ENTER THE VAULT.", 65, 500);
  const { displayed: sub }      = useTypewriter("YOUR FILM ARCHIVE AWAITS.", 42, 1800);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const handleChange = (field) => (e) =>
    setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", formData);
      dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "ACCESS DENIED");
      setLoading(false);
    }
  };

  const filled = Object.values(formData).filter(Boolean).length;
  const pct    = (filled / 3) * 100;

  return (
    <PageTransition>
      <FilmGrain />

      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)",
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none fixed z-[3] w-[600px] h-[600px] rounded-full"
        style={{
          left:       mouse.x - 300,
          top:        mouse.y - 300,
          background: "radial-gradient(circle, rgba(232,255,0,0.05) 0%, transparent 65%)",
          transition: "left 0.1s ease-out, top 0.1s ease-out",
        }}
      />

      <div className="min-h-screen bg-[#060606] flex relative overflow-hidden">

        {/* Film strip — left */}
        <div className="hidden xl:flex flex-col w-10 border-r border-[#181818] shrink-0 overflow-hidden">
          {Array(40).fill(null).map((_, i) => (
            <div
              key={i}
              className="w-full shrink-0 border-b border-[#181818] flex items-center justify-center"
              style={{ height: "3rem" }}
            >
              <div className="w-5 h-7 border border-[#1e1e1e] bg-[#0a0a0a]" />
            </div>
          ))}
        </div>

        {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col w-[44%] relative overflow-hidden border-r-2 border-[#e8ff00]">

          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(#0d0d0d 1px,transparent 1px),linear-gradient(90deg,#0d0d0d 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Top reveal line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px] bg-[#e8ff00] z-10"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut", delay: 0.1 }}
          />

          {/* Header bar */}
          <div className="relative z-10 px-10 py-6 border-b border-[#181818] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 bg-[#e8ff00]"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
              <span className="font-mono text-[8px] tracking-[0.45em] text-[#e8ff00]">SYSTEM ONLINE</span>
            </div>
            <span className="font-mono text-[8px] tracking-[0.35em] text-[#444444]">CINEMA TRIAL / 2025</span>
          </div>

          {/* Main type block */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 py-10">

            {/* Slash decoration */}
            <p className="font-mono text-[9px] tracking-[0.3em] text-[#222222] mb-8 select-none">
              {"// ".repeat(12)}
            </p>

            {/* Giant headline */}
            <div className="relative mb-10">
              <div className="absolute -left-4 top-0 bottom-0 w-[3px] bg-[#e8ff00]" />
              <h1
                className="font-display leading-[0.9] text-white uppercase"
                style={{ fontSize: "clamp(3.5rem, 6.5vw, 6.5rem)" }}
              >
                <GlitchText text="CINEMA" />
              </h1>
              <h1
                className="font-display leading-[0.9] uppercase"
                style={{ fontSize: "clamp(3.5rem, 6.5vw, 6.5rem)", color: "#e8ff00" }}
              >
                TRIAL
              </h1>
              <h1
                className="font-display leading-[0.9] uppercase select-none"
                style={{
                  fontSize: "clamp(3.5rem, 6.5vw, 6.5rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px #1e1e1e",
                }}
              >
                VAULT
              </h1>
            </div>

            {/* Typewriter lines */}
            <div className="pl-4 border-l-2 border-[#1e1e1e] space-y-2 mb-10">
              <p className="font-mono text-[11px] tracking-[0.2em] text-[#555555]">
                {headline}<span className="text-[#e8ff00] animate-pulse">_</span>
              </p>
              <p className="font-mono text-[9px] tracking-[0.15em] text-[#333333]">
                {sub}
              </p>
            </div>

            {/* Feature bullets — numbered, matching Login */}
            <div className="space-y-3">
              {[
                ["01", "BROWSE 10,000+ TITLES"],
                ["02", "TRACK YOUR WATCH HISTORY"],
                ["03", "BUILD YOUR FAVORITES VAULT"],
                ["04", "EMBEDDED HD TRAILERS"],
                ["05", "ADMIN CONTENT CONTROLS"],
              ].map(([n, text], i) => (
                <motion.div
                  key={n}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.12, duration: 0.4 }}
                >
                  <span className="font-mono text-[8px] text-[#333333] shrink-0">{n}</span>
                  <div className="w-4 h-[1px] bg-[#2a2a2a] shrink-0" />
                  <span className="font-mono text-[8px] tracking-[0.25em] text-[#3a3a3a]">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated stats — same Counter component as Login */}
          <div className="relative z-10 border-t border-[#181818] grid grid-cols-3">
            {[
              { target: 10000, suffix: "+", label: "TITLES",  delay: 800  },
              { target: 100,   suffix: "%", label: "FREE",    delay: 1000 },
              { target: 256,   suffix: "B", label: "SECURE",  delay: 1200 },
            ].map(({ target, suffix, label, delay }, i) => (
              <div
                key={label}
                className={`px-6 py-6 group cursor-default ${i < 2 ? "border-r border-[#181818]" : ""}`}
              >
                <p
                  className="font-display text-3xl text-[#333333] group-hover:text-[#e8ff00] leading-none"
                  style={{ transition: "color 0.05s linear" }}
                >
                  <Counter target={target} suffix={suffix} delay={delay} />
                </p>
                <p className="font-mono text-[7px] tracking-[0.4em] text-[#2a2a2a] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ───────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col">

          {/* Top breadcrumb bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#181818]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[7px] tracking-[0.5em] text-[#333333]">AUTH</span>
              <span className="font-mono text-[7px] text-[#2a2a2a]">/</span>
              <span className="font-mono text-[7px] tracking-[0.5em] text-[#e8ff00]">REGISTER</span>
            </div>
            <Link
              to="/"
              className="font-mono text-[7px] tracking-[0.4em] text-[#444444] hover:text-[#e8ff00] border border-[#1e1e1e] hover:border-[#e8ff00] px-3 py-1.5"
              style={{ transition: "color 0.05s linear, border-color 0.05s linear" }}
            >
              ← HOME
            </Link>
          </div>

          {/* Form area */}
          <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-12">
            <div className="w-full max-w-[400px]">

              {/* Success state */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      className="w-20 h-20 border-2 border-[#e8ff00] flex items-center justify-center mx-auto mb-8 relative"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 180, damping: 14 }}
                    >
                      <span className="font-display text-2xl text-[#e8ff00]">OK</span>
                      <motion.div
                        className="absolute inset-0 border-2 border-[#e8ff00]"
                        animate={{ scale: [1, 1.4, 1.4], opacity: [1, 0, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                    <p className="font-display text-5xl text-white uppercase mb-2">ACCESS GRANTED</p>
                    <p className="font-mono text-[8px] tracking-[0.5em] text-[#555555] mb-2">IDENTITY VERIFIED</p>
                    <p className="font-mono text-[8px] tracking-[0.4em] text-[#333333] mb-10">ENTERING THE VAULT...</p>
                    <motion.div
                      className="h-[2px] bg-[#e8ff00] mx-auto"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!success && (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
                >
                  {/* Page heading */}
                  <motion.div
                    variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                    className="mb-10"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-8 h-[1px] bg-[#e8ff00]" />
                      <span className="font-mono text-[7px] tracking-[0.6em] text-[#e8ff00]">NEW MEMBER</span>
                    </div>
                    <h2
                      className="font-display leading-none text-white uppercase mb-1"
                      style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
                    >
                      REQUEST
                    </h2>
                    <h2
                      className="font-display leading-none uppercase"
                      style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", color: "#e8ff00" }}
                    >
                      ACCESS
                    </h2>
                  </motion.div>

                  {/* Progress */}
                  <motion.div
                    variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                    className="mb-8"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-[7px] tracking-[0.4em] text-[#444444]">FORM STATUS</span>
                      <span
                        className="font-mono text-[7px] tracking-[0.3em]"
                        style={{ color: pct === 100 ? "#e8ff00" : "#555555" }}
                      >
                        {filled}/3 COMPLETE
                      </span>
                    </div>
                    <div className="h-[1px] bg-[#181818] relative overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-[#e8ff00]"
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    {/* Segment markers */}
                    <div className="flex mt-1 gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-[2px]"
                          style={{
                            backgroundColor: i < filled ? "#e8ff00" : "#181818",
                            transition: "background-color 0.15s",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Fields */}
                  <form onSubmit={handleSubmit}>
                    <div>
                      {FIELDS.map((f, i) => {
                        const isFoc  = focused === f.key;
                        const hasVal = !!formData[f.key];
                        return (
                          <motion.div
                            key={f.key}
                            variants={{
                              initial: { opacity: 0, x: -18 },
                              animate: { opacity: 1, x: 0, transition: { delay: i * 0.08 } },
                            }}
                          >
                            <div
                              style={{
                                borderLeft:   `2px solid ${isFoc ? "#e8ff00" : hasVal ? "#333333" : "#1a1a1a"}`,
                                borderBottom: `1px solid ${isFoc ? "#252525" : "#111111"}`,
                                transition:   "border-color 0.05s linear",
                                padding:      "14px 12px 14px 14px",
                                display:      "flex",
                                alignItems:   "center",
                                gap:          "14px",
                              }}
                            >
                              <span
                                className="font-mono shrink-0 w-6 text-right"
                                style={{
                                  fontSize:   "8px",
                                  color:      isFoc ? "#e8ff00" : "#333333",
                                  transition: "color 0.05s linear",
                                }}
                              >
                                {f.idx}
                              </span>
                              <div className="flex-1 min-w-0">
                                <label
                                  className="block font-mono mb-1.5"
                                  style={{
                                    fontSize:      "7px",
                                    letterSpacing: "0.4em",
                                    color:         isFoc ? "#e8ff00" : "#555555",
                                    transition:    "color 0.05s linear",
                                  }}
                                >
                                  {f.label}
                                </label>
                                <input
                                  type={f.type}
                                  required
                                  value={formData[f.key]}
                                  onChange={handleChange(f.key)}
                                  onFocus={() => setFocused(f.key)}
                                  onBlur={() => setFocused(null)}
                                  placeholder={f.placeholder}
                                  style={{ caretColor: "#e8ff00" }}
                                  className="w-full bg-transparent font-mono text-sm tracking-widest text-white outline-none placeholder-[#2a2a2a]"
                                />
                              </div>
                              <div className="w-4 shrink-0 flex items-center justify-center">
                                {hasVal && !isFoc && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-1.5 h-1.5 bg-[#e8ff00]"
                                  />
                                )}
                                {isFoc && (
                                  <motion.div
                                    className="w-[1px] h-4 bg-[#e8ff00]"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.75 }}
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              borderLeft: "2px solid #ff2d2d",
                              padding:    "12px 12px 12px 14px",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <motion.div
                                className="w-2 h-2 bg-[#ff2d2d] shrink-0"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                              />
                              <p
                                className="font-mono text-[#ff2d2d]"
                                style={{ fontSize: "10px", letterSpacing: "0.2em" }}
                              >
                                ERROR — {error}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit */}
                    <motion.div
                      variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }}
                      className="mt-8"
                    >
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative overflow-hidden group"
                        style={{
                          backgroundColor: filled === 3 ? "#e8ff00" : "#0a0a0a",
                          border:          `1px solid ${filled === 3 ? "#e8ff00" : "#1e1e1e"}`,
                          transition:      "background-color 0.1s linear, border-color 0.1s linear",
                        }}
                      >
                        <div className="flex items-center justify-between px-6 py-5">
                          <span
                            className="font-mono text-[11px] tracking-[0.35em] uppercase"
                            style={{ color: filled === 3 ? "#000" : "#444444" }}
                          >
                            {loading
                              ? "VERIFYING..."
                              : filled < 3
                              ? `${filled}/3 FIELDS REQUIRED`
                              : "REQUEST ACCESS"}
                          </span>
                          {filled === 3 && !loading && (
                            <motion.div
                              initial={{ x: -8, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="w-6 h-6 bg-black flex items-center justify-center shrink-0"
                            >
                              <span className="font-mono text-[#e8ff00] text-sm font-bold">→</span>
                            </motion.div>
                          )}
                        </div>
                        {loading && (
                          <motion.div
                            className="absolute bottom-0 left-0 h-[3px] bg-black/20"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "linear" }}
                          />
                        )}
                      </motion.button>

                      {/* Helper note */}
                      <div className="mt-3 flex justify-end">
                        <span className="font-mono text-[7px] tracking-[0.3em] text-[#333333] cursor-default">
                          REGISTRATION IS FREE — NO CARD REQUIRED
                        </span>
                      </div>
                    </motion.div>

                    {/* Login link */}
                    <motion.div
                      variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                      className="mt-8 pt-6 border-t border-[#111111] flex items-center justify-between"
                    >
                      <span className="font-mono text-[7px] tracking-[0.3em] text-[#333333]">
                        ALREADY A MEMBER?
                      </span>
                      <Link
                        to="/login"
                        className="font-mono text-[9px] tracking-[0.3em] text-[#555555] hover:text-[#e8ff00] flex items-center gap-2 group"
                        style={{ transition: "color 0.05s linear" }}
                      >
                        <span className="w-5 h-[1px] bg-current group-hover:w-8 transition-all duration-150" />
                        SIGN IN
                      </Link>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-8 py-3 border-t border-[#111111]">
            <span className="font-mono text-[7px] tracking-[0.4em] text-[#2a2a2a]">
              END-TO-END ENCRYPTED
            </span>
            <span className="font-mono text-[7px] tracking-[0.4em] text-[#2a2a2a]">
              JWT + BCRYPT + SSL
            </span>
          </div>
        </div>

        {/* Film strip — right */}
        <div className="hidden xl:flex flex-col w-10 border-l border-[#181818] shrink-0 overflow-hidden">
          {Array(40).fill(null).map((_, i) => (
            <div
              key={i}
              className="w-full shrink-0 border-b border-[#181818] flex items-center justify-center"
              style={{ height: "3rem" }}
            >
              <div className="w-5 h-7 border border-[#1e1e1e] bg-[#0a0a0a]" />
            </div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
};

export default Register;