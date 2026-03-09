import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl border-[3px] border-white p-10">
        <h1 className="text-4xl md:text-5xl font-mono tracking-widest mb-6">CREATE ACCESS</h1>
        <p className="font-mono text-xs opacity-70 mb-10 tracking-widest">
          REGISTER TO ENTER THE CINEMA ARCHIVE DATABASE
        </p>
        {error && (
          <div className="border border-red-500 text-red-400 font-mono text-xs px-4 py-3 mb-6 tracking-widest">
            ERROR — {error.toUpperCase()}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-widest">NAME</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="bg-black border-[3px] border-white px-4 py-3 font-mono outline-none focus:bg-white focus:text-black transition" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-widest">EMAIL</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-[3px] border-white px-4 py-3 font-mono outline-none focus:bg-white focus:text-black transition" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-widest">PASSWORD</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-[3px] border-white px-4 py-3 font-mono outline-none focus:bg-white focus:text-black transition" />
          </div>
          <button type="submit" disabled={loading}
            className="border-[3px] border-white py-4 font-mono tracking-widest hover:bg-white hover:text-black transition disabled:opacity-50">
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>
        <div className="mt-10 pt-6 border-t-[3px] border-white text-center">
          <p className="font-mono text-xs mb-4 tracking-widest">ALREADY AUTHORIZED?</p>
          <Link to="/login" className="border-[3px] border-white px-6 py-3 font-mono hover:bg-white hover:text-black transition">
            LOGIN
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
