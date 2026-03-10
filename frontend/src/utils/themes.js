export const THEMES = {
  red: {
    name: "Cinema Red",
    accent: "#E50914",
    accentHover: "#ff0f1a",
    accentText: "#ffffff",
    label: "RED",
  },
  blue: {
    name: "Arctic Blue",
    accent: "#0EA5E9",
    accentHover: "#38bdf8",
    accentText: "#ffffff",
    label: "BLUE",
  },
  emerald: {
    name: "Emerald",
    accent: "#10B981",
    accentHover: "#34d399",
    accentText: "#ffffff",
    label: "GREEN",
  },
  amber: {
    name: "Amber",
    accent: "#F59E0B",
    accentHover: "#fbbf24",
    accentText: "#000000",
    label: "AMBER",
  },
  purple: {
    name: "Purple Haze",
    accent: "#8B5CF6",
    accentHover: "#a78bfa",
    accentText: "#ffffff",
    label: "PURPLE",
  },
  yellow: {
    name: "Neon Yellow",
    accent: "#e8ff00",
    accentHover: "#f0ff4d",
    accentText: "#000000",
    label: "NEON",
  },
};

export const applyTheme = (themeKey) => {
  const theme = THEMES[themeKey] || THEMES.red;
  const root = document.documentElement;
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-accent-hover", theme.accentHover);
  root.style.setProperty("--color-accent-text", theme.accentText);
  localStorage.setItem("cinema-theme", themeKey);
};

export const getStoredTheme = () => localStorage.getItem("cinema-theme") || "red";
