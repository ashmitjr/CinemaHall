import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../features/auth/authSlice";
import api from "../services/api";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      dispatch(setUser(data.data.user));
      dispatch(setAccessToken(data.data.accessToken));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "LOGIN FAILED. CHECK CREDENTIALS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-surface p-10 border border-border"
      >
        <h1 className="text-6xl mb-10 text-center">LOGIN</h1>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 mb-8 font-mono text-xs uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-gray-400 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-gray-400 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black py-5 text-xl font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "ENTER CINEMA"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs text-gray-500">
          NEW HERE? <Link to="/register" className="text-accent hover:underline">CREATE ACCOUNT</Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
