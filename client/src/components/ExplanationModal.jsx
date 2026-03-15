import { useEffect } from "react";
export default function ExplanationModal({ explanation, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  if (!explanation) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">🤖 AI Explanation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">×</button>
        </div>
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">{explanation}</pre>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-400">Press Esc to close</span>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Close</button>
        </div>
      </div>
    </div>
  );
}
