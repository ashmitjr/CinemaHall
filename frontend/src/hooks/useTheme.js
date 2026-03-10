import { useState, useEffect } from "react";
import { applyTheme, getStoredTheme, THEMES } from "../utils/themes";

export const useTheme = () => {
  const [activeTheme, setActiveTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  const switchTheme = (key) => {
    setActiveTheme(key);
    applyTheme(key);
  };

  return { activeTheme, switchTheme, themes: THEMES };
};
