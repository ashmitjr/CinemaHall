import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTransition } from "../../components/common/PageTransition";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    posterPath: "",
    overview: "",
    tmdbId: "",
    releaseDate: "",
    trailerUrl: "",
    genre: "",
    category: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/admin/movies");
      setMovies(res.data.data);
    } catch (error) {
      console.error("Movies fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await api.patch(`/admin/movies/${editingMovie._id}`, formData);
      } else {
        await api.post("/admin/movies", formData);
      }
      fetchMovies();
      handleClose();
    } catch (error) {
      console.error("Save movie error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS MOVIE?")) return;
    try {
      await api.delete(`/admin/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Delete movie error:", error);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || "",
      posterPath: movie.posterPath || "",
      overview: movie.overview || "",
      tmdbId: movie.tmdbId || "",
      releaseDate: movie.releaseDate || "",
      trailerUrl: movie.trailerUrl || "",
      genre: movie.genre || "",
      category: movie.category || "",
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setFormData({
      title: "",
      posterPath: "",
      overview: "",
      tmdbId: "",
      releaseDate: "",
      trailerUrl: "",
      genre: "",
      category: "",
    });
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <h1 className="font-display text-8xl md:text-[10rem] uppercase tracking-tighter leading-none">Movies</h1>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus size={18} /> Add Movie
            </Button>
          </div>

          <div className="bg-surface border border-border overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="p-6 uppercase tracking-widest text-muted">Title</th>
                  <th className="p-6 uppercase tracking-widest text-muted">Genre</th>
                  <th className="p-6 uppercase tracking-widest text-muted">Release</th>
                  <th className="p-6 uppercase tracking-widest text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie._id} className="border-b border-border hover:bg-white/5 transition-colors">
                    <td className="p-6 font-display text-2xl uppercase tracking-tight">{movie.title}</td>
                    <td className="p-6 uppercase">{movie.genre || "N/A"}</td>
                    <td className="p-6 uppercase">{movie.releaseDate || "N/A"}</td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(movie)} className="p-2 border border-border hover:border-accent text-muted hover:text-accent transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(movie._id)} className="p-2 border border-border hover:border-danger text-muted hover:text-danger transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingMovie ? "Edit Movie" : "Add Movie"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="TMDB ID"
              required
              value={formData.tmdbId}
              onChange={(e) => setFormData({ ...formData, tmdbId: e.target.value })}
            />
          </div>
          <Input
            label="Poster URL"
            value={formData.posterPath}
            onChange={(e) => setFormData({ ...formData, posterPath: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Release Date"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            />
            <Input
              label="Genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
          </div>
          <Input
            label="Trailer YouTube Link"
            value={formData.trailerUrl}
            onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
          />
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-muted tracking-widest">Description</label>
            <textarea
              className="bg-transparent border border-border p-4 font-body text-sm focus:border-accent outline-none transition-colors h-32 resize-none"
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full py-4">
            {editingMovie ? "UPDATE ENTRY" : "SAVE TO ARCHIVE"}
          </Button>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default ManageMovies;
