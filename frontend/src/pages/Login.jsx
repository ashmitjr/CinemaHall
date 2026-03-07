import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { PageTransition } from "../components/common/PageTransition";

/* ─── Typewriter ─────────────────────────────────────────── */
const useTypewriter = (text, speed = 55, delay = 0) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text]);
  return { displayed, done };
};

/* ─── Glitch ─────────────────────────────────────────────── */
const GlitchText = ({ text }) => {
  const [g, setG] = useState(false);
  useEffect(() => {
    const loop = () => setTimeout(() => {
      setG(true);
      setTimeout(() => { setG(false); loop(); }, 160);
    }, 2600 + Math.random() * 3200);
    loop();
  }, []);
  return (
    <span className="relative inline-block">
      <span style={{ opacity: g ? 0 : 1 }}>{text}</span>
      {g && <>
        <span className="absolute inset-0 text-[#ff2d2d]" style={{ clipPath: "inset(15% 0 58% 0)", transform: "translateX(-5px)" }}>{text}</span>
        <span className="absolute inset-0 text-[#e8ff00]" style={{ clipPath: "inset(52% 0 8% 0)",  transform: "translateX(5px)"  }}>{text}</span>
      </>}
    </span>
  );
};

/* ─── Film Grain ─────────────────────────────────────────── */
const FilmGrain = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let timer;
    const draw = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      const img = ctx.createImageData(c.width, c.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 26;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 18;
      }
      ctx.putImageData(img, 0, 0);
      timer = setTimeout(draw, 80);
    };
    draw();
    return () => clearTimeout(timer);
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[4]" />;
};

/* ─── Counter ────────────────────────────────────────────── */
const Counter = ({ target, suffix = "", delay = 0 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const step = target / 45;
      const iv = setInterval(() => {
        n += step;
        if (n >= target) { setVal(target); clearInterval(iv); }
        else setVal(Math.floor(n));
      }, 28);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return <>{val.toLocaleString()}{suffix}</>;
};

/* ─── Field row ──────────────────────────────────────────── */
const FIELDS = [
  { key: "email",    label: "EMAIL ADDRESS", type: "email",    placeholder: "your@email.com",    idx: "01" },
  { key: "password", label: "PASSWORD",      type: "password", placeholder: "Enter your password", idx: "02" },
];

/* ═══════════════════════════════════════════════════════════ */
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mouse, setMouse]   = useState({ x: 0, y: 0 });
  const [now, setNow]       = useState(new Date());

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { displayed: headline } = useTypewriter("WELCOME BACK.", 65, 600);
  const { displayed: sub }      = useTypewriter("YOUR VAULT IS WAITING.", 40, 1900);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const handleChange = (field) => (e) =>
    setFormData(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", formData);
      dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "AUTHENTICATION FAILED");
      setLoading(false);
    }
  };

  const filled = Object.values(formData).filter(Boolean).length;
  const pct    = (filled / 2) * 100;

  return (
    <PageTransition>
      <FilmGrain />

      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[5]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)" }} />

      {/* Cursor glow */}
      <div className="pointer-events-none fixed z-[3] w-[600px] h-[600px] rounded-full"
        style={{ left: mouse.x - 300, top: mouse.y - 300,
          background: "radial-gradient(circle, rgba(232,255,0,0.05) 0%, transparent 65%)",
          transition: "left 0.1s ease-out, top 0.1s ease-out" }} />

      <div className="min-h-screen bg-[#060606] flex relative overflow-hidden">

        {/* Film strip — left */}
        <div className="hidden xl:flex flex-col w-10 border-r border-[#161616] shrink-0 overflow-hidden">
          {Array(40).fill(null).map((_, i) => (
            <div key={i} className="w-full shrink-0 border-b border-[#161616] flex items-center justify-center" style={{ height: "3rem" }}>
              <div className="w-5 h-7 border border-[#1c1c1c] bg-[#0a0a0a]" />
            </div>
          ))}
        </div>

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col w-[44%] relative overflow-hidden border-r-2 border-[#e8ff00]">

          {/* Grid bg */}
          <div className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(#0d0d0d 1px,transparent 1px),linear-gradient(90deg,#0d0d0d 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

          {/* Top sweep line */}
          <motion.div className="absolute top-0 left-0 w-full h-[2px] bg-[#e8ff00] z-10"
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut", delay: 0.1 }} />

          {/* Header */}
          <div className="relative z-10 px-10 py-5 border-b border-[#161616] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div className="w-2 h-2 bg-[#e8ff00]"
                animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} />
              <span className="font-mono text-xs tracking-[0.4em] text-[#e8ff00]">SYSTEM ONLINE</span>
            </div>
            <span className="font-mono text-xs tracking-widest text-[#555555]">
              {now.toTimeString().slice(0, 8)}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 py-10">
            <p className="font-mono text-xs tracking-[0.3em] text-[#2a2a2a] mb-8 select-none">
              {"// ".repeat(14)}
            </p>

            {/* Big type */}
            <div className="relative mb-10">
              <div className="absolute -left-4 top-0 bottom-0 w-[3px] bg-[#e8ff00]" />
              <h1 className="font-display leading-[0.88] text-white uppercase"
                style={{ fontSize: "clamp(4rem, 6.5vw, 6.5rem)" }}>
                <GlitchText text="CINEMA" />
              </h1>
              <h1 className="font-display leading-[0.88] uppercase"
                style={{ fontSize: "clamp(4rem, 6.5vw, 6.5rem)", color: "#e8ff00" }}>
                TRIAL
              </h1>
              <h1 className="font-display leading-[0.88] uppercase"
                style={{ fontSize: "clamp(4rem, 6.5vw, 6.5rem)", color: "transparent", WebkitTextStroke: "1px #222222" }}>
                ARCHIVE
              </h1>
            </div>

            {/* Typewriter */}
            <div className="pl-4 border-l-2 border-[#222222] space-y-2 mb-10">
              <p className="font-mono text-sm tracking-[0.2em] text-[#777777]">
                {headline}<span className="text-[#e8ff00] animate-pulse">_</span>
              </p>
              <p className="font-mono text-xs tracking-[0.15em] text-[#444444]">
                {sub}
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                ["01", "10,000+ FILMS & TV SERIES"],
                ["02", "PERSONAL FAVORITES VAULT"],
                ["03", "AUTO WATCH HISTORY TRACKING"],
                ["04", "EMBEDDED HD TRAILERS"],
                ["05", "ADMIN CONTENT CONTROLS"],
              ].map(([n, text], i) => (
                <motion.div key={n} className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + i * 0.12 }}>
                  <span className="font-mono text-xs text-[#444444] shrink-0 w-6">{n}</span>
                  <div className="w-4 h-[1px] bg-[#333333] shrink-0" />
                  <span className="font-mono text-xs tracking-[0.2em] text-[#555555]">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 border-t border-[#161616] grid grid-cols-3">
            {[
              { target: 10000, suffix: "+", label: "TITLES",  delay: 700  },
              { target: 100,   suffix: "%", label: "FREE",    delay: 900  },
              { target: 256,   suffix: "b", label: "ENCRYPT", delay: 1100 },
            ].map(({ target, suffix, label, delay }, i) => (
              <div key={label}
                className={`px-6 py-6 group cursor-default ${i < 2 ? "border-r border-[#161616]" : ""}`}>
                <p className="font-display text-4xl text-[#444444] group-hover:text-[#e8ff00] leading-none"
                  style={{ transition: "color 0.05s linear" }}>
                  <Counter target={target} suffix={suffix} delay={delay} />
                </p>
                <p className="font-mono text-xs tracking-[0.35em] text-[#444444] mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#161616]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.4em] text-[#555555]">AUTH</span>
              <span className="font-mono text-sm text-[#333333]">/</span>
              <span className="font-mono text-xs tracking-[0.4em] text-[#e8ff00]">SIGN IN</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tracking-widest text-[#444444] hidden md:block">
                {now.toDateString().toUpperCase()}
              </span>
              <Link to="/"
                className="font-mono text-xs tracking-[0.3em] text-[#666666] hover:text-[#e8ff00] border border-[#222222] hover:border-[#e8ff00] px-4 py-2"
                style={{ transition: "color 0.05s, border-color 0.05s" }}>
                ← HOME
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-12">
            <div className="w-full max-w-[420px]">

              {/* ── Success ── */}
              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <motion.div
                      className="w-20 h-20 border-2 border-[#e8ff00] flex items-center justify-center mx-auto mb-8 relative"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 180, damping: 14 }}>
                      <span className="font-display text-2xl text-[#e8ff00]">OK</span>
                      <motion.div className="absolute inset-0 border-2 border-[#e8ff00]"
                        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                        transition={{ duration: 1, repeat: Infinity }} />
                    </motion.div>
                    <p className="font-display text-5xl text-white uppercase mb-3">ACCESS GRANTED</p>
                    <p className="font-mono text-sm tracking-[0.4em] text-[#777777] mb-2">IDENTITY VERIFIED</p>
                    <p className="font-mono text-xs tracking-[0.3em] text-[#555555] mb-10">ENTERING THE VAULT...</p>
                    <motion.div className="h-[2px] bg-[#e8ff00] mx-auto"
                      initial={{ width: 0 }} animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "linear" }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {!success && (
                <motion.div initial="initial" animate="animate"
                  variants={{ animate: { transition: { staggerChildren: 0.07 } } }}>

                  {/* Heading */}
                  <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                    className="mb-10">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-8 h-[1px] bg-[#e8ff00] inline-block" />
                      <span className="font-mono text-xs tracking-[0.5em] text-[#e8ff00]">RETURNING MEMBER</span>
                    </div>
                    <h2 className="font-display leading-[0.88] text-white uppercase"
                      style={{ fontSize: "clamp(3.5rem, 5vw, 5rem)" }}>SIGN</h2>
                    <h2 className="font-display leading-[0.88] uppercase"
                      style={{ fontSize: "clamp(3.5rem, 5vw, 5rem)", color: "#e8ff00" }}>IN</h2>
                  </motion.div>

                  {/* Progress bar */}
                  <motion.div variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }} className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-xs tracking-[0.3em] text-[#555555]">FORM STATUS</span>
                      <span className="font-mono text-xs tracking-widest"
                        style={{ color: pct === 100 ? "#e8ff00" : "#666666" }}>
                        {filled}/2 COMPLETE
                      </span>
                    </div>
                    <div className="h-[1px] bg-[#1a1a1a] relative overflow-hidden">
                      <motion.div className="absolute inset-y-0 left-0 bg-[#e8ff00]"
                        animate={{ width: `${pct}%` }} transition={{ duration: 0.2 }} />
                    </div>
                    <div className="flex mt-1.5 gap-1">
                      {[0, 1].map((i) => (
                        <div key={i} className="flex-1 h-[2px]"
                          style={{ backgroundColor: i < filled ? "#e8ff00" : "#1a1a1a", transition: "background-color 0.15s" }} />
                      ))}
                    </div>
                  </motion.div>

                  {/* Fields */}
                  <form onSubmit={handleSubmit}>
                    {FIELDS.map((f, i) => {
                      const isFoc  = focused === f.key;
                      const hasVal = !!formData[f.key];
                      return (
                        <motion.div key={f.key}
                          variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0, transition: { delay: i * 0.08 } } }}>
                          <div style={{
                            borderLeft: `2px solid ${isFoc ? "#e8ff00" : hasVal ? "#444444" : "#1e1e1e"}`,
                            borderBottom: `1px solid ${isFoc ? "#2a2a2a" : "#111111"}`,
                            transition: "border-color 0.05s linear",
                            padding: "16px 14px 16px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            backgroundColor: isFoc ? "#0d0d0d" : "transparent",
                          }}>
                            <span className="font-mono text-xs shrink-0 w-6 text-right"
                              style={{ color: isFoc ? "#e8ff00" : "#444444", transition: "color 0.05s" }}>
                              {f.idx}
                            </span>
                            <div className="flex-1 min-w-0">
                              <label className="block font-mono text-xs mb-2 tracking-[0.35em]"
                                style={{ color: isFoc ? "#e8ff00" : "#777777", transition: "color 0.05s" }}>
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
                                className="w-full bg-transparent font-mono text-sm tracking-wider text-white outline-none placeholder-[#333333]"
                              />
                            </div>
                            <div className="w-4 shrink-0 flex items-center justify-center">
                              {hasVal && !isFoc && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-[#e8ff00]" />
                              )}
                              {isFoc && (
                                <motion.div className="w-[1px] h-5 bg-[#e8ff00]"
                                  animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.75 }} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ borderLeft: "2px solid #ff2d2d", padding: "14px 14px 14px 16px", backgroundColor: "#0a0606" }}>
                          <div className="flex items-center gap-3">
                            <motion.div className="w-2 h-2 bg-[#ff2d2d] shrink-0"
                              animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                            <p className="font-mono text-sm tracking-wider text-[#ff2d2d]">
                              ERROR — {error}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }}
                      className="mt-8">
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative overflow-hidden group"
                        style={{
                          backgroundColor: filled === 2 ? "#e8ff00" : "#0e0e0e",
                          border: `1px solid ${filled === 2 ? "#e8ff00" : "#2a2a2a"}`,
                          transition: "background-color 0.1s, border-color 0.1s",
                        }}>
                        <div className="flex items-center justify-between px-6 py-5">
                          <span className="font-mono text-sm tracking-[0.3em] uppercase"
                            style={{ color: filled === 2 ? "#000000" : "#666666" }}>
                            {loading ? "AUTHENTICATING..." : filled < 2 ? `${filled}/2 FIELDS REQUIRED` : "ENTER THE VAULT"}
                          </span>
                          {filled === 2 && !loading && (
                            <motion.div initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                              className="w-7 h-7 bg-black flex items-center justify-center shrink-0">
                              <span className="font-mono text-base text-[#e8ff00] font-bold">→</span>
                            </motion.div>
                          )}
                        </div>
                        {loading && (
                          <motion.div className="absolute bottom-0 left-0 h-[3px] bg-black/25"
                            initial={{ width: 0 }} animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "linear" }} />
                        )}
                      </motion.button>

                      <p className="mt-3 text-right font-mono text-xs tracking-wider text-[#555555]">
                        FORGOT PASSWORD? — CONTACT ADMIN
                      </p>
                    </motion.div>

                    {/* Register link */}
                    <motion.div variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                      className="mt-8 pt-6 border-t border-[#161616] flex items-center justify-between">
                      <span className="font-mono text-xs tracking-[0.3em] text-[#555555]">NO ACCOUNT YET?</span>
                      <Link to="/register"
                        className="font-mono text-sm tracking-[0.25em] text-[#888888] hover:text-[#e8ff00] flex items-center gap-2 group"
                        style={{ transition: "color 0.05s" }}>
                        <span className="inline-block h-[1px] bg-current w-5 group-hover:w-8 transition-all duration-150" />
                        REQUEST ACCESS
                      </Link>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-[#161616]">
            <span className="font-mono text-xs tracking-[0.35em] text-[#444444]">END-TO-END ENCRYPTED</span>
            <span className="font-mono text-xs tracking-[0.35em] text-[#444444]">JWT + BCRYPT + SSL</span>
          </div>
        </div>

        {/* Film strip — right */}
        <div className="hidden xl:flex flex-col w-10 border-l border-[#161616] shrink-0 overflow-hidden">
          {Array(40).fill(null).map((_, i) => (
            <div key={i} className="w-full shrink-0 border-b border-[#161616] flex items-center justify-center" style={{ height: "3rem" }}>
              <div className="w-5 h-7 border border-[#1c1c1c] bg-[#0a0a0a]" />
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;