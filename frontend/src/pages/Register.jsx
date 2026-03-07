import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { PageTransition } from "../components/common/PageTransition";

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", formData);
      dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "REGISTRATION FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <motion.div initial="initial" animate="animate" variants={stagger}>

            {/* Header */}
            <motion.div variants={fadeUp} className="mb-12 border-b border-[#222222] pb-8">
              <p className="font-mono text-[9px] tracking-[0.4em] text-[#555555] mb-3">
                CINEMA TRIAL / ACCESS
              </p>
              <h1 className="font-display text-7xl leading-none tracking-tight text-white uppercase">
                CREATE<br />ACCOUNT
              </h1>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-0">

              {/* Name field */}
              <motion.div variants={fadeUp} className="border border-[#222222] focus-within:border-[#e8ff00]"
                style={{ transition: "border-color 0.05s linear" }}>
                <label className="block font-mono text-[8px] tracking-[0.35em] text-[#555555] px-4 pt-3">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange("name")}
                  placeholder="YOUR NAME"
                  className="w-full bg-transparent px-4 pb-3 pt-1 font-mono text-sm tracking-widest text-white outline-none placeholder-[#333333]"
                />
              </motion.div>

              {/* Email field */}
              <motion.div variants={fadeUp} className="border border-t-0 border-[#222222] focus-within:border-[#e8ff00]"
                style={{ transition: "border-color 0.05s linear" }}>
                <label className="block font-mono text-[8px] tracking-[0.35em] text-[#555555] px-4 pt-3">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="YOUR@EMAIL.COM"
                  className="w-full bg-transparent px-4 pb-3 pt-1 font-mono text-sm tracking-widest text-white outline-none placeholder-[#333333]"
                />
              </motion.div>

              {/* Password field */}
              <motion.div variants={fadeUp} className="border border-t-0 border-[#222222] focus-within:border-[#e8ff00]"
                style={{ transition: "border-color 0.05s linear" }}>
                <label className="block font-mono text-[8px] tracking-[0.35em] text-[#555555] px-4 pt-3">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange("password")}
                  placeholder="MIN 8 CHARACTERS"
                  className="w-full bg-transparent px-4 pb-3 pt-1 font-mono text-sm tracking-widest text-white outline-none placeholder-[#333333]"
                />
              </motion.div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-t-0 border-[#ff2d2d] px-4 py-3"
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#ff2d2d]">
                    ERROR / {error}
                  </p>
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="mt-0 w-full bg-[#e8ff00] text-black font-mono text-[11px] tracking-[0.3em] py-5 uppercase disabled:opacity-50 hover:bg-white"
                style={{ transition: "background-color 0.05s linear" }}
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT —"}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div variants={fadeUp} className="mt-8 border-t border-[#1a1a1a] pt-6 flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#444444]">
                ALREADY A MEMBER?
              </span>
              <Link
                to="/login"
                className="font-mono text-[9px] tracking-[0.2em] text-[#e8ff00] hover:text-white border-b border-[#e8ff00] pb-0.5"
                style={{ transition: "color 0.05s linear" }}
              >
                SIGN IN —
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;