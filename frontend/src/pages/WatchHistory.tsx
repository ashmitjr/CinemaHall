import React, { useEffect, useState } from "react";
import api from "../services/api";
import { IMG_BASE } from "../services/tmdb";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Clock } from "lucide-react";

const WatchHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/watch-history");
        setHistory(data.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO CLEAR YOUR ENTIRE HISTORY?")) return;
    try {
      await api.delete("/watch-history");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">
      RETRACING YOUR STEPS...
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 md:px-12 py-12 min-h-screen"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <h1 className="text-6xl md:text-8xl">HISTORY</h1>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="font-mono text-xs text-red-500 border border-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors"
          >
            CLEAR ALL HISTORY
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <motion.div
              key={item._id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-6 bg-surface border border-border p-4 hover:border-accent group"
            >
              <div className="w-20 h-28 bg-border flex-shrink-0">
                <img
                  src={`${IMG_BASE}/w200${item.posterPath}`}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow">
                <Link to={`/movie/${item.tmdbId}?type=${item.type}`} className="text-2xl hover:text-accent transition-colors block mb-2">
                  {item.title}
                </Link>
                <div className="flex items-center gap-4 font-mono text-[10px] text-gray-500 uppercase">
                  <span className="bg-border px-2 py-1 text-white">{item.type}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>WATCHED ON {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center gap-4 border border-dashed border-border">
          <span className="font-mono text-2xl text-gray-500 uppercase">NO HISTORY FOUND</span>
          <p className="font-mono text-xs text-gray-600">START WATCHING TO BUILD YOUR LEGACY</p>
        </div>
      )}
    </motion.div>
  );
};

export default WatchHistory;
