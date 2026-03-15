import { useState, useEffect, useRef } from "react";
import API from "../services/api";

const SEV_BADGE = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const IC = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function ErrorForm({ fetchErrors }) {
  const [form, setForm]             = useState({ errorMessage: "", codeSnippet: "", description: "", tags: "", severity: "medium" });
  const [similar, setSimilar]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [err, setErr]               = useState("");
  const debounce                    = useRef(null);

  useEffect(() => {
    clearTimeout(debounce.current);
    if (form.errorMessage.trim().length < 8) { setSimilar([]); return; }
    debounce.current = setTimeout(async () => {
      try { const r = await API.post("/errors/similar", { errorMessage: form.errorMessage }); setSimilar(r.data); } catch (_) {}
    }, 600);
    return () => clearTimeout(debounce.current);
  }, [form.errorMessage]);

  const set = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setErr(""); };

  const submit = async e => {
    e.preventDefault();
    if (!form.errorMessage.trim()) { setErr("Error message is required."); return; }
    setLoading(true);
    try {
      await API.post("/errors", { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) });
      setForm({ errorMessage: "", codeSnippet: "", description: "", tags: "", severity: "medium" });
      setSimilar([]);
      fetchErrors();
    } catch (_) { setErr("Failed to log. Is the server running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white">Log New Error</h2>
      {err && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg px-4 py-2 text-sm">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Error Message *</label>
          <input name="errorMessage" value={form.errorMessage} onChange={set} placeholder="e.g. Cannot read properties of undefined" className={IC} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Severity</label>
          <select name="severity" value={form.severity} onChange={set} className={IC}>
            <option value="low">🔵 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="critical">🔴 Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Code Snippet</label>
        <textarea name="codeSnippet" value={form.codeSnippet} onChange={set} rows={3} placeholder="Paste relevant code..." className={`${IC} font-mono`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={set} rows={2} placeholder="What were you doing?" className={IC} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={set} placeholder="react, api, mongodb" className={IC} />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-2">⚠️ Similar errors already logged</p>
          <div className="space-y-1.5">
            {similar.map(e => (
              <div key={e._id} className="flex items-center gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded font-medium ${SEV_BADGE[e.severity]}`}>{e.severity}</span>
                <span className="truncate flex-1 text-yellow-800 dark:text-yellow-200">{e.errorMessage}</span>
                <span className={`shrink-0 px-1.5 py-0.5 rounded ${e.resolved ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-500"}`}>
                  {e.resolved ? "✓ resolved" : "open"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-400">* required · Press Esc to cancel</p>
        <button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-6 py-2 rounded-lg transition flex items-center gap-2">
          {loading ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Logging...</>) : "Log Error"}
        </button>
      </div>
    </div>
  );
}
