import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { setCredentials } from "../features/auth/authSlice";

const FilmGrain = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let id;
    const draw = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      const img = ctx.createImageData(c.width, c.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 18;
      }
      ctx.putImageData(img, 0, 0);
      id = setTimeout(draw, 80);
    };
    draw();
    return () => clearTimeout(id);
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 3 }} />;
};

const STATS = [
  { label: "FILMS ARCHIVED", value: "847K" },
  { label: "MEMBERS",        value: "12K"  },
  { label: "REVIEWS",        value: "2.1M" },
];

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [clock,    setClock]    = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick(); const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      dispatch(setCredentials(data.data));
      setSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally { setLoading(false); }
  };

  const ready = email.length > 3 && password.length > 2;

  const fields = [
    { label: "EMAIL ADDRESS", id: "email", type: "email",    value: email,    set: setEmail,    idx: "01" },
    { label: "PASSWORD",      id: "pass",  type: "password", value: password, set: setPassword, idx: "02" },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ backgroundColor: "#060606", color: "#f0f0f0" }}>
      <FilmGrain />
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 2,
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
      }} />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-[44%] relative overflow-hidden"
        style={{ borderRight: "1px solid #141414" }}>
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: "var(--color-accent)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(90deg,#0e0e0e 0,#0e0e0e 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#0e0e0e 0,#0e0e0e 1px,transparent 1px,transparent 56px)",
          opacity: 0.6,
        }} />
        <div className="relative z-10 flex flex-col h-full px-14 py-12">
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-2 h-2" style={{ backgroundColor: "var(--color-accent)" }} />
            <span className="font-mono text-xs tracking-[0.5em]" style={{ color: "#444444" }}>CINEMA TRIAL</span>
          </div>
          <div className="my-auto">
            <p className="font-mono text-[10px] tracking-[0.5em] mb-5" style={{ color: "#333333" }}>ACCESS TERMINAL</p>
            <h1 className="font-display uppercase text-white leading-none mb-8"
              style={{ fontSize: "clamp(3.5rem, 6vw, 6.5rem)", lineHeight: 0.88 }}>
              ENTER<br />THE<br /><span style={{ color: "var(--color-accent)" }}>VAULT</span>
            </h1>
            <p className="font-mono text-xs leading-relaxed max-w-[260px]"
              style={{ color: "#444444", letterSpacing: "0.04em" }}>
              THE DEFINITIVE DARK ARCHIVE FOR OBSESSIVE CINEPHILES. RAW. UNFILTERED.
            </p>
          </div>
          <div className="grid grid-cols-3 mt-auto" style={{ borderTop: "1px solid #1a1a1a" }}>
            {STATS.map((s, i) => (
              <div key={i} className="py-6"
                style={{ borderRight: i < 2 ? "1px solid #1a1a1a" : "none", paddingLeft: i > 0 ? 16 : 0 }}>
                <p className="font-display text-2xl text-white">{s.value}</p>
                <p className="font-mono mt-1" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#444444" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col" style={{ position: "relative", zIndex: 5 }}>
        <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: "1px solid #141414" }}>
          <span className="font-mono text-[10px] tracking-[0.5em]" style={{ color: "#333333" }}>AUTH / LOGIN</span>
          <span className="font-mono text-[10px]" style={{ color: "#2a2a2a" }}>{clock}</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }} className="w-full max-w-md">

            <div className="mb-10">
              <h2 className="font-display uppercase text-white" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: 0.9 }}>
                SIGN IN
              </h2>
              <p className="font-mono text-xs mt-3 tracking-widest" style={{ color: "#444444" }}>
                AUTHORIZATION REQUIRED
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="mb-6 px-4 py-3 font-mono text-xs tracking-widest overflow-hidden"
                  style={{ border: "1px solid #ff2d2d", borderLeft: "3px solid #ff2d2d", color: "#ff2d2d" }}>
                  ERROR — {error.toUpperCase()}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mb-6 px-4 py-3 font-mono text-xs tracking-widest flex items-center gap-3"
                  style={{ border: "1px solid #e8ff00", borderLeft: "3px solid #e8ff00", color: "var(--color-accent)" }}>
                  <motion.div className="w-2 h-2" style={{ backgroundColor: "var(--color-accent)" }}
                    animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                  ACCESS GRANTED — REDIRECTING
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {fields.map(f => (
                <div key={f.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs" style={{ color: focused === f.id ? "var(--color-accent)" : "#252525" }}>{f.idx}</span>
                    <label className="font-mono text-xs tracking-[0.4em]"
                      style={{ color: focused === f.id ? "var(--color-accent)" : "#555555" }}>{f.label}</label>
                  </div>
                  <div style={{
                    borderBottom: `2px solid ${focused === f.id ? "var(--color-accent)" : f.value ? "#333" : "#1e1e1e"}`,
                    transition: "border-color 0.05s", position: "relative",
                  }}>
                    <input type={f.type} required value={f.value}
                      onChange={e => f.set(e.target.value)}
                      onFocus={() => setFocused(f.id)} onBlur={() => setFocused(null)}
                      className="w-full bg-transparent font-mono text-sm text-white outline-none py-3 tracking-wider"
                      style={{ caretColor: "var(--color-accent)" }} />
                    {f.value && focused !== f.id && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2"
                        style={{ backgroundColor: "var(--color-accent)" }} />
                    )}
                  </div>
                </div>
              ))}

              <motion.button type="submit" disabled={loading || success}
                whileTap={ready ? { scale: 0.98 } : {}}
                className="w-full py-4 font-mono text-xs tracking-[0.5em] uppercase mt-2"
                style={{
                  backgroundColor: ready ? "var(--color-accent)" : "transparent",
                  color:           ready ? "#000000" : "#333333",
                  border:          `1px solid ${ready ? "var(--color-accent)" : "#1e1e1e"}`,
                  transition:      "all 0.08s",
                  cursor:          ready ? "crosshair" : "default",
                }}>
                {loading
                  ? <span className="flex items-center justify-center gap-3">
                      <motion.span className="w-3 h-3 border border-current inline-block"
                        style={{ borderTopColor: "transparent" }}
                        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                      AUTHENTICATING
                    </span>
                  : ready ? "ENTER THE VAULT →" : "FILL ALL FIELDS"
                }
              </motion.button>
            </form>

            <div className="mt-10 pt-8 flex items-center justify-between" style={{ borderTop: "1px solid #111111" }}>
              <span className="font-mono text-xs tracking-widest" style={{ color: "#333333" }}>NO ACCOUNT?</span>
              <Link to="/register"
                className="font-mono text-xs tracking-widest px-4 py-2"
                style={{ border: "1px solid #1e1e1e", color: "#555555", transition: "all 0.05s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#555555"; }}>
                REQUEST ACCESS →
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="px-8 py-4 flex items-center gap-4" style={{ borderTop: "1px solid #141414" }}>
          <motion.div className="w-1.5 h-1.5" style={{ backgroundColor: "var(--color-accent)" }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
          <span className="font-mono text-[10px] tracking-[0.4em]" style={{ color: "#333333" }}>SYSTEM ONLINE</span>
          <span className="font-mono text-[10px] ml-auto" style={{ color: "#1e1e1e" }}>CINEMA TRIAL v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default Login;