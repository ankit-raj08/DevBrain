import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} className="flex items-center gap-2 w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <span>{darkMode ? "☀️" : "🌙"}</span>
      <span>{darkMode ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
