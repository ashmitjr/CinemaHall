import React, { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get("/favorites");
        setFavorites(data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (id: string) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(favorites.filter(f => f._id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">
      LOADING YOUR VAULT...
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 md:px-12 py-12 min-h-screen"
    >
      <h1 className="text-6xl md:text-8xl mb-12">FAVORITES</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <AnimatePresence>
            {favorites.map((fav) => (
              <motion.div
                key={fav._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <MovieCard item={{ ...fav, id: fav.tmdbId }} type={fav.type} />
                <button
                  onClick={() => removeFavorite(fav._id)}
                  className="absolute top-2 left-2 bg-red-600 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center gap-4 border border-dashed border-border">
          <span className="font-mono text-2xl text-gray-500 uppercase">YOUR VAULT IS EMPTY</span>
          <p className="font-mono text-xs text-gray-600">START ADDING MOVIES TO SEE THEM HERE</p>
        </div>
      )}
    </motion.div>
  );
};

export default Favorites;
