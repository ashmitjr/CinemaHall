import React from "react";
import { Link } from "react-router-dom";

const COL1 = [
  { label: "TRENDING", to: "/" },
  { label: "MOVIES", to: "/search?type=movie" },
  { label: "TV SHOWS", to: "/search?type=tv" },
  { label: "SEARCH", to: "/search" },
];

const COL2 = [
  { label: "FAVORITES", to: "/favorites" },
  { label: "HISTORY", to: "/history" },
  { label: "LOGIN", to: "/login" },
  { label: "REGISTER", to: "/register" },
];

const COL3 = [
  { label: "TERMS", href: "#" },
  { label: "PRIVACY", href: "#" },
  { label: "API", href: "#" },
];

const linkStyle = {
  base: {
    color: "#9a9a9a",
    transition: "all 0.18s ease",
    fontFamily: "monospace",
    fontSize: "11px",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
  },
  hover: {
    color: "var(--color-accent)",
    transform: "translateX(4px)",
  },
};

const FooterLink = ({ to, href, children }) => {
  const [hov, setHov] = React.useState(false);
  const style = { ...linkStyle.base, ...(hov ? linkStyle.hover : {}) };

  if (to)
    return (
      <Link
        to={to}
        style={style}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </Link>
    );

  return (
    <a
      href={href}
      style={style}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
};

export const Footer = () => (
  <footer style={{ backgroundColor: "#060606", borderTop: "1px solid #151515" }}>
    <div className="max-w-[1800px] mx-auto px-8 md:px-12">

      {/* GRID */}
      <div
        className="grid grid-cols-1 md:grid-cols-4"
        style={{ borderBottom: "1px solid #151515" }}
      >

        {/* BRAND */}
        <div
          className="py-16 pr-12 md:col-span-1"
          style={{ borderRight: "1px solid #151515" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 shrink-0" style={{ backgroundColor: "var(--color-accent)" }} />
            <span
              className="font-mono text-xs tracking-[0.5em]"
              style={{ color: "#6f6f6f" }}
            >
              EST. 2026
            </span>
          </div>

          <h2
            className="font-display uppercase text-white leading-none mb-6"
            style={{
              fontSize: "clamp(3rem, 5vw, 5rem)",
              lineHeight: 0.88,
            }}
          >
            CINEMA
            <br />
            <span style={{ color: "var(--color-accent)" }}>TRIAL</span>
          </h2>

          <p
            className="font-mono text-xs leading-relaxed"
            style={{
              color: "#777",
              letterSpacing: "0.04em",
              maxWidth: 260,
            }}
          >
            A BRUTALIST EDITORIAL ARCHIVE FOR THE CINEPHILE. RAW, UNFILTERED,
            AND UNAPOLOGETIC.
          </p>
        </div>

        {/* NAVIGATION */}
        {[
          { title: "NAVIGATE", links: COL1 },
          { title: "ACCOUNT", links: COL2 },
          { title: "LEGAL", links: COL3 },
        ].map((col, i) => (
          <div
            key={i}
            className="py-16 px-10"
            style={{ borderRight: i < 2 ? "1px solid #151515" : "none" }}
          >
            <p
              className="font-mono mb-8"
              style={{
                fontSize: "9px",
                letterSpacing: "0.5em",
                color: "#555",
              }}
            >
              {col.title}
            </p>

            <div className="flex flex-col gap-6">
              {col.links.map((l, j) => (
                <FooterLink key={j} to={l.to} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6">

        <div className="flex items-center gap-6">
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "#555" }}
          >
            © 2026 CINEMA TRIAL
          </span>

          <span style={{ color: "#333" }}>—</span>

          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "#555" }}
          >
            NO RIGHTS RESERVED
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-1.5"
            style={{ backgroundColor: "#444" }}
          />

          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "#555" }}
          >
            POWERED BY TMDB API
          </span>
        </div>
      </div>
    </div>
  </footer>
);