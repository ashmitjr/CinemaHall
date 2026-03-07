import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-md">
            <h2 className="font-display text-6xl mb-6 tracking-tighter">CINEMA TRIAL</h2>
            <p className="font-body text-muted text-sm leading-relaxed">
              A BRUTALIST EDITORIAL ARCHIVE FOR THE CINEPHILE. RAW, UNFILTERED, AND UNAPOLOGETIC. 
              DISCOVER THE DEPTHS OF CINEMA THROUGH OUR CURATED DATABASE.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">Navigation</span>
              <Link to="/" className="font-mono text-xs hover:text-accent transition-colors uppercase">Trending</Link>
              <Link to="/search?type=movie" className="font-mono text-xs hover:text-accent transition-colors uppercase">Movies</Link>
              <Link to="/search?type=tv" className="font-mono text-xs hover:text-accent transition-colors uppercase">TV Shows</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">Account</span>
              <Link to="/favorites" className="font-mono text-xs hover:text-accent transition-colors uppercase">Favorites</Link>
              <Link to="/history" className="font-mono text-xs hover:text-accent transition-colors uppercase">History</Link>
              <Link to="/login" className="font-mono text-xs hover:text-accent transition-colors uppercase">Login</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">Legal</span>
              <a href="#" className="font-mono text-xs hover:text-accent transition-colors uppercase">Terms</a>
              <a href="#" className="font-mono text-xs hover:text-accent transition-colors uppercase">Privacy</a>
              <a href="#" className="font-mono text-xs hover:text-accent transition-colors uppercase">API</a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/30">
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            © 2026 CINEMA TRIAL. NO RIGHTS RESERVED.
          </span>
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            POWERED BY TMDB
          </span>
        </div>
      </div>
    </footer>
  );
};
