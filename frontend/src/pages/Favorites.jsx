import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { PageTransition } from "../components/common/PageTransition";
import { MovieCard } from "../components/common/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/favorites");
        setFavorites(res.data.data);
      } catch (error) {
        console.error("Favorites fetch error:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFav = async (movieId) => {
    try {
      await api.delete(`/favorites/${movieId}`);
      setFavorites((prev) => prev.filter((item) => item.movieId !== movieId));
    } catch (error) {
      console.error("Remove favorite error:", error);
    }
  };

  if (loading) return <div className="h-screen bg-background flex items-center justify-center font-mono text-accent">OPENING VAULT...</div>;
  if (fetchError) return <div className="h-screen bg-background flex items-center justify-center font-mono text-red-500">FAILED TO LOAD VAULT.</div>;

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="container mx-auto">
          <h1 className="font-display text-8xl md:text-[10rem] mb-12 uppercase tracking-tighter">Your Vault</h1>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {favorites.map((fav) => (
                  <motion.div key={fav.id} layout
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group">
                    <MovieCard
                      item={{ id: fav.movieId, title: fav.title, poster_path: fav.poster }}
                      type={fav.movieType}
                    />
                    <button onClick={() => removeFav(fav.movieId)}
                      className="absolute top-2 right-2 z-20 bg-danger text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center gap-8 border border-dashed border-border">
              <h2 className="font-display text-6xl md:text-8xl text-border uppercase text-center">Your vault is empty</h2>
              <Link to="/search" className="font-mono text-accent text-xs tracking-widest hover:underline uppercase">
                Start Exploring
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Favorites;
