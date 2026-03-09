import React, { useEffect, useState } from "react";
import api from "../services/api";
import { PageTransition } from "../components/common/PageTransition";
import { IMG_BASE } from "../services/tmdb";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/watch-history");
        setHistory(res.data.data);
      } catch (error) {
        console.error("History fetch error:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await api.delete("/watch-history");
      setHistory([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Clear history error:", error);
    }
  };

  if (loading) return <div className="h-screen bg-background flex items-center justify-center font-mono text-accent">RETRACING STEPS...</div>;
  if (fetchError) return <div className="h-screen bg-background flex items-center justify-center font-mono text-red-500">FAILED TO LOAD HISTORY.</div>;

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <h1 className="font-display text-8xl md:text-[10rem] uppercase tracking-tighter leading-none">History</h1>
            {history.length > 0 && (
              <Button variant="danger" onClick={() => setIsModalOpen(true)}>Clear History</Button>
            )}
          </div>
          {history.length > 0 ? (
            <div className="flex flex-col gap-4">
              {history.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-6 bg-surface border border-border p-4 hover:border-accent transition-colors group">
                  <div className="w-20 h-28 flex-shrink-0 border border-border overflow-hidden">
                    <img
                      src={item.poster ? `${IMG_BASE}/w200${item.poster}` : "/no-poster.png"}
                      alt=""
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-3xl uppercase tracking-tight">{item.title}</h3>
                      <Badge>{item.movieType}</Badge>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted uppercase tracking-widest">
                      <Clock size={12} />
                      <span>Watched {new Date(item.watchedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center gap-8 border border-dashed border-border">
              <h2 className="font-display text-6xl md:text-8xl text-border uppercase text-center">Nothing watched yet</h2>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Clear History">
        <div className="space-y-8">
          <p className="font-body text-muted">ARE YOU SURE YOU WANT TO WIPE YOUR WATCH HISTORY? THIS ACTION IS PERMANENT.</p>
          <div className="flex gap-4">
            <Button variant="danger" className="flex-grow" onClick={handleClearHistory}>YES, WIPE IT</Button>
            <Button variant="outline" className="flex-grow" onClick={() => setIsModalOpen(false)}>CANCEL</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default WatchHistory;
