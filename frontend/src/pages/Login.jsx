import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      dispatch(setCredentials(data.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-xl border-[3px] border-white"
      >
        <div className="border-b-[3px] border-white px-8 py-6 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-mono tracking-widest">ACCESS TERMINAL</h1>
          <span className="text-[10px] font-mono border border-white px-2 py-1">v1.0</span>
        </div>
        <div className="p-10">
          <p className="font-mono text-xs opacity-70 tracking-widest mb-10">
            AUTHORIZATION REQUIRED TO ENTER CINEMA ARCHIVE
          </p>
          {error && (
            <div className="border border-red-500 text-red-400 font-mono text-xs px-4 py-3 mb-6 tracking-widest">
              ERROR — {error.toUpperCase()}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="font-mono text-[10px] tracking-widest uppercase">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-black border-[3px] border-white px-5 py-4 font-mono tracking-wide outline-none transition focus:bg-white focus:text-black" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-mono text-[10px] tracking-widest uppercase">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-[3px] border-white px-5 py-4 font-mono tracking-wide outline-none transition focus:bg-white focus:text-black" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="border-[3px] border-white py-4 font-mono tracking-widest uppercase hover:bg-white hover:text-black transition disabled:opacity-50">
              {loading ? "AUTHENTICATING..." : "Authenticate"}
            </motion.button>
          </form>
        </div>
        <div className="border-t-[3px] border-white px-10 py-8 text-center">
          <p className="font-mono text-xs tracking-widest mb-4">NO ACCESS KEY?</p>
          <Link to="/register"
            className="inline-block border-[3px] border-white px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition">
            REQUEST ACCESS
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
