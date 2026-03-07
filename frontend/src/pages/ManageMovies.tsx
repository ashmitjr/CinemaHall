import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Film, Link as LinkIcon, Type, Image as ImageIcon } from "lucide-react";

const ManageMovies = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    tmdbId: "",
    type: "movie",
    posterPath: "",
    overview: "",
  });

  const fetchMovies = async () => {
    try {
      const { data } = await api.get("/admin/movies");
      setMovies(data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenModal = (movie: any = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        tmdbId: movie.tmdbId,
        type: movie.type,
        posterPath: movie.posterPath,
        overview: movie.overview,
      });
    } else {
      setEditingMovie(null);
      setFormData({ title: "", tmdbId: "", type: "movie", posterPath: "", overview: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await api.patch(`/admin/movies/${editingMovie._id}`, formData);
      } else {
        await api.post("/admin/movies", formData);
      }
      fetchMovies();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const deleteMovie = async (id: string) => {
    if (!window.confirm("DELETE THIS MOVIE?")) return;
    try {
      await api.delete(`/admin/movies/${id}`);
      setMovies(movies.filter(m => m._id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-mono text-accent animate-pulse">
      INDEXING ARCHIVES...
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 md:px-12 py-12 min-h-screen"
    >
      <div className="flex justify-between items-end mb-12">
        <h1 className="text-6xl md:text-8xl">MANAGE MOVIES</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent text-black px-8 py-4 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> ADD MOVIE
        </button>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="p-6 uppercase tracking-widest">Title</th>
              <th className="p-6 uppercase tracking-widest">TMDB ID</th>
              <th className="p-6 uppercase tracking-widest">Type</th>
              <th className="p-6 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id} className="border-b border-border hover:bg-white/5 transition-colors">
                <td className="p-6 font-display text-xl">{movie.title}</td>
                <td className="p-6 text-gray-400">{movie.tmdbId}</td>
                <td className="p-6">
                  <span className="bg-border px-2 py-1 uppercase text-[10px]">{movie.type}</span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => handleOpenModal(movie)}
                      className="p-2 border border-accent text-accent hover:bg-accent hover:text-black"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteMovie(movie._id)}
                      className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/90 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit bg-surface border border-border z-[110] p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl">{editingMovie ? "EDIT MOVIE" : "ADD NEW MOVIE"}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-gray-500 uppercase flex items-center gap-2">
                      <Type size={12} /> Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-gray-500 uppercase flex items-center gap-2">
                      <LinkIcon size={12} /> TMDB ID
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tmdbId}
                      onChange={(e) => setFormData({ ...formData, tmdbId: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-gray-500 uppercase flex items-center gap-2">
                      <Film size={12} /> Media Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="bg-transparent border-b border-border py-2 font-mono outline-none focus:border-accent"
                    >
                      <option value="movie" className="bg-surface">MOVIE</option>
                      <option value="tv" className="bg-surface">TV SHOW</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-gray-500 uppercase flex items-center gap-2">
                      <ImageIcon size={12} /> Poster Path
                    </label>
                    <input
                      type="text"
                      value={formData.posterPath}
                      onChange={(e) => setFormData({ ...formData, posterPath: e.target.value })}
                      className="w-full"
                      placeholder="/example.jpg"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-gray-500 uppercase">Overview</label>
                  <textarea
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    className="bg-transparent border border-border p-4 font-body outline-none focus:border-accent h-32 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-black py-4 text-xl font-bold hover:bg-white transition-colors"
                >
                  {editingMovie ? "UPDATE ARCHIVE" : "SAVE TO ARCHIVE"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageMovies;
