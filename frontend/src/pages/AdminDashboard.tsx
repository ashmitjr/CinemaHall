import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Film, Ban, CheckCircle, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, movies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, m] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/movies"),
        ]);
        setStats({ users: u.data.data.length, movies: m.data.data.length });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 md:px-12 py-12 min-h-screen"
    >
      <h1 className="text-6xl md:text-8xl mb-12 flex items-center gap-4">
        <Shield size={60} className="text-accent" /> COMMAND CENTER
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-surface border border-border p-10 hover:border-accent transition-colors">
          <div className="flex items-center justify-between mb-6">
            <Users size={40} className="text-accent" />
            <span className="font-mono text-6xl">{stats.users}</span>
          </div>
          <h2 className="text-4xl mb-4">MANAGE USERS</h2>
          <p className="font-body text-gray-400 mb-8">CONTROL ACCESS, BAN MALICIOUS ACTORS, AND MONITOR GROWTH.</p>
          <button 
            onClick={() => window.location.href = "/admin/users"}
            className="w-full border border-accent text-accent py-4 hover:bg-accent hover:text-black"
          >
            OPEN USER MANAGEMENT
          </button>
        </div>

        <div className="bg-surface border border-border p-10 hover:border-accent transition-colors">
          <div className="flex items-center justify-between mb-6">
            <Film size={40} className="text-accent" />
            <span className="font-mono text-6xl">{stats.movies}</span>
          </div>
          <h2 className="text-4xl mb-4">MANAGE MOVIES</h2>
          <p className="font-body text-gray-400 mb-8">ADD CUSTOM CONTENT, EDIT METADATA, AND CURATE THE LIBRARY.</p>
          <button 
            onClick={() => window.location.href = "/admin/movies"}
            className="w-full border border-accent text-accent py-4 hover:bg-accent hover:text-black"
          >
            OPEN MOVIE MANAGEMENT
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
