import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { PageTransition } from "../../components/common/PageTransition";
import { motion } from "framer-motion";
import { Users, Film, Heart, History, Shield } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    favorites: 0,
    history: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, m, f, h] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/movies"),
          api.get("/admin/favorites-count"),
          api.get("/admin/history-count"),
        ]);
        setStats({
          users: u.data.data.length,
          movies: m.data.data.length,
          favorites: f.data.data,
          history: h.data.data,
        });
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Movies", value: stats.movies, icon: Film },
    { label: "Total Favorites", value: stats.favorites, icon: Heart },
    { label: "Total History", value: stats.history, icon: History },
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="container mx-auto">
          <h1 className="font-display text-8xl md:text-[10rem] mb-12 uppercase tracking-tighter flex items-center gap-6">
            <Shield size={80} className="text-accent" /> Admin
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-surface border border-border p-8 flex flex-col gap-4">
                <stat.icon size={24} className="text-muted" />
                <span className="font-mono text-6xl text-accent leading-none">{stat.value}</span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/movies"
              className="bg-surface border border-border p-12 hover:border-accent transition-all group"
            >
              <h2 className="font-display text-6xl mb-4 uppercase tracking-tight group-hover:text-accent">Manage Movies</h2>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Add, edit, or remove entries from the archive.</p>
            </Link>
            <Link
              to="/admin/users"
              className="bg-surface border border-border p-12 hover:border-accent transition-all group"
            >
              <h2 className="font-display text-6xl mb-4 uppercase tracking-tight group-hover:text-accent">Manage Users</h2>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Monitor users and manage access permissions.</p>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
