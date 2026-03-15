import { useState } from "react";
import API from "../services/api";
import ExplanationModal from "./ExplanationModal";
import FixModal from "./FixModal";

const SEV_BADGE = {
  low:      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
  medium:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700",
  high:     "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-700",
  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-700",
};
const SEV_LEFT = {
  low: "border-l-blue-400", medium: "border-l-yellow-400", high: "border-l-orange-400", critical: "border-l-red-500"
};

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

function ErrorCard({ error, fetchErrors, setActiveTag }) {
  const [explanation, setExplanation] = useState("");
  const [fix, setFix]                 = useState("");
  const [loadingAI, setLoadingAI]     = useState("");
  const [expanded, setExpanded]       = useState(false);

  const handleResolve = async () => {
    try { await API.post(`/errors/${error._id}/resolve`); fetchErrors(); }
    catch (e) { console.error("Resolve failed:", e.response?.status, e.response?.data); }
  };

  const explainError = async () => {
    setLoadingAI("explain");
    try { const r = await API.post("/ai/explain", { errorMessage: error.errorMessage }); setExplanation(r.data.explanation); }
    catch (_) { setExplanation("Could not reach AI. Check GROQ_API_KEY in server .env"); }
    finally { setLoadingAI(""); }
  };

  const suggestFix = async () => {
    setLoadingAI("fix");
    try { const r = await API.post("/ai/fix", { errorMessage: error.errorMessage, codeSnippet: error.codeSnippet }); setFix(r.data.fix); }
    catch (_) { setFix("Could not reach AI. Check GROQ_API_KEY in server .env"); }
    finally { setLoadingAI(""); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this error log?")) return;
    try { await API.delete(`/errors/${error._id}`); fetchErrors(); }
    catch (_) {}
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${SEV_LEFT[error.severity] || "border-l-gray-300"} transition-all hover:shadow-md ${error.resolved ? "opacity-60" : ""}`}>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEV_BADGE[error.severity]}`}>{error.severity?.toUpperCase()}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${error.resolved ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
                {error.resolved ? "✓ Resolved" : "Open"}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{timeAgo(error.createdAt)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setExpanded(p => !p)}>
              {error.errorMessage}
            </h3>
          </div>
        </div>

        {error.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{error.description}</p>}

        {error.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {error.tags.map((tag, i) => (
              <span key={i} onClick={() => setActiveTag(tag)} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {error.codeSnippet && !expanded && (
          <button onClick={() => setExpanded(true)} className="text-xs text-blue-500 hover:underline mb-3 block">Show code ▼</button>
        )}
        {error.codeSnippet && expanded && (
          <>
            <pre className="bg-gray-900 dark:bg-black text-green-400 text-xs p-3 rounded-lg mb-4 overflow-x-auto font-mono whitespace-pre-wrap">{error.codeSnippet}</pre>
            <button onClick={() => setExpanded(false)} className="text-xs text-blue-500 hover:underline mb-3 block">Hide code ▲</button>
          </>
        )}

        <div className="flex flex-wrap gap-2">
          <button onClick={explainError} disabled={loadingAI === "explain"} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 transition disabled:opacity-50">
            {loadingAI === "explain" ? "⏳" : "🤖"} Explain
          </button>
          <button onClick={suggestFix} disabled={loadingAI === "fix"} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 transition disabled:opacity-50">
            {loadingAI === "fix" ? "⏳" : "🔧"} Fix
          </button>
          <button onClick={handleResolve} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${error.resolved ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200" : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 hover:bg-green-100"}`}>
            {error.resolved ? "↩ Reopen" : "✓ Resolve"}
          </button>
          <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 transition ml-auto">
            🗑 Delete
          </button>
        </div>
      </div>

      <ExplanationModal explanation={explanation} onClose={() => setExplanation("")} />
      <FixModal         fix={fix}                 onClose={() => setFix("")} />
    </div>
  );
}

export default function ErrorList({ errors, fetchErrors, setActiveTag }) {
  if (!errors?.length) return null;
  return (
    <div className="space-y-3">
      {errors.map(e => <ErrorCard key={e._id} error={e} fetchErrors={fetchErrors} setActiveTag={setActiveTag} />)}
    </div>
  );
}
