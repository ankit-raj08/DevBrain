import { createContext, useState, useEffect } from "react";
export const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return <ThemeContext.Provider value={{ darkMode, toggleTheme: () => setDarkMode(p => !p) }}>{children}</ThemeContext.Provider>;
}
