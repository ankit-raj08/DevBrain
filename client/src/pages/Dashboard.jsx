import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import ErrorForm from "../components/ErrorForm";
import ErrorList from "../components/ErrorList";
import Analytics from "../components/Analytics";
import DevAssistant from "../components/DevAssistant";
import ThemeToggle from "../components/ThemeToggle";
import GuidePage from "../components/GuidePage";

const NAV = [
  { id: "home",      label: "Home",         icon: "🏠" },
  { id: "errors",    label: "Error Log",    icon: "⚡" },
  { id: "analytics", label: "Analytics",    icon: "📊" },
  { id: "assistant", label: "AI Assistant", icon: "🤖" },
  { id: "guide",     label: "Guide",        icon: "📖" },
];

const SEV_BORDER = { low: "border-l-blue-400", medium: "border-l-yellow-400", high: "border-l-orange-400", critical: "border-l-red-500" };
const SEV_BADGE  = {
  low:      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  medium:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high:     "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

/* Clickable stat card */
function StatCard({ label, value, sub, accentClass, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-1 text-left w-full transition hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 ${accentClass}`}
    >
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
      <span className="text-xs text-blue-500 mt-1">Click to view →</span>
    </button>
  );
}

/* Compact error row for home page */
function ErrorRow({ error, onSelect }) {
  return (
    <button
      onClick={() => onSelect(error)}
      className={`w-full text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-l-4 ${SEV_BORDER[error.severity] || "border-l-gray-300"} px-4 py-3 hover:shadow-md transition flex items-center gap-3`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${SEV_BADGE[error.severity]}`}>{error.severity?.toUpperCase()}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${error.resolved ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
            {error.resolved ? "✓ Resolved" : "Open"}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{error.errorMessage}</p>
        {error.description && <p className="text-xs text-gray-400 truncate">{error.description}</p>}
      </div>
      <span className="text-xs text-gray-400 shrink-0">{timeAgo(error.createdAt)}</span>
    </button>
  );
}

/* Error detail modal */
function ErrorDetailModal({ error, onClose, fetchErrors }) {
  const [explanation, setExplanation] = useState("");
  const [fix, setFix]                 = useState("");
  const [loading, setLoading]         = useState("");

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!error) return null;

  const explain = async () => {
    setLoading("explain");
    try { const r = await API.post("/ai/explain", { errorMessage: error.errorMessage }); setExplanation(r.data.explanation); }
    catch (_) { setExplanation("AI unavailable."); }
    finally { setLoading(""); }
  };
  const fix_ = async () => {
    setLoading("fix");
    try { const r = await API.post("/ai/fix", { errorMessage: error.errorMessage, codeSnippet: error.codeSnippet }); setFix(r.data.fix); }
    catch (_) { setFix("AI unavailable."); }
    finally { setLoading(""); }
  };
  const resolve = async () => {
    try { await API.post(`/errors/${error._id}/resolve`); fetchErrors(); onClose(); }
    catch (_) {}
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEV_BADGE[error.severity]}`}>{error.severity?.toUpperCase()}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${error.resolved ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
                {error.resolved ? "✓ Resolved" : "Open"}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{timeAgo(error.createdAt)}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{error.errorMessage}</h2>
          </div>
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none shrink-0">×</button>
        </div>

        <div className="p-6 space-y-4">
          {error.description && <p className="text-sm text-gray-600 dark:text-gray-300">{error.description}</p>}

          {error.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {error.tags.map((t, i) => <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">#{t}</span>)}
            </div>
          )}

          {error.codeSnippet && (
            <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto font-mono whitespace-pre-wrap">{error.codeSnippet}</pre>
          )}

          {explanation && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">🤖 AI Explanation</p>
              <pre className="whitespace-pre-wrap text-sm text-emerald-800 dark:text-emerald-200 font-sans">{explanation}</pre>
            </div>
          )}

          {fix && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">🔧 AI Fix Suggestion</p>
              <pre className="whitespace-pre-wrap text-sm text-purple-800 dark:text-purple-200 font-sans">{fix}</pre>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={explain} disabled={loading === "explain"} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 transition disabled:opacity-50">
              {loading === "explain" ? "⏳" : "🤖"} Explain
            </button>
            <button onClick={fix_} disabled={loading === "fix"} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 transition disabled:opacity-50">
              {loading === "fix" ? "⏳" : "🔧"} Fix
            </button>
            <button onClick={resolve} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${error.resolved ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200" : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 hover:bg-green-100"}`}>
              {error.resolved ? "↩ Reopen" : "✓ Resolve"}
            </button>
            <button onClick={onClose} className="ml-auto text-xs font-medium px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition">
              Close <span className="opacity-50 ml-1">Esc</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [errors, setErrors]           = useState([]);
  const [stats, setStats]             = useState(null);
  const [activeNav, setActiveNav]     = useState("home");
  const [searchQuery, setSearch]      = useState("");
  const [activeTag, setActiveTag]     = useState("");
  const [severityFilter, setSeverity] = useState("");
  const [statusFilter, setStatus]     = useState("");
  const [refresh, setRefresh]         = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [selectedError, setSelected]  = useState(null);

  const fetchErrors = useCallback(async () => {
    try { const r = await API.get("/errors"); setErrors(r.data); setRefresh(p => !p); } catch (_) {}
  }, []);

  const fetchStats = useCallback(async () => {
    try { const r = await API.get("/analytics"); setStats(r.data); } catch (_) {}
  }, []);

  useEffect(() => { fetchErrors(); fetchStats(); }, []);

  /* Global keyboard shortcuts */
  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape")  { setShowForm(false); setSelected(null); }
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        setActiveNav("errors"); setShowForm(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const refresh_ = () => { fetchErrors(); fetchStats(); };

  const filteredErrors = errors.filter(e => {
    const ms = e.errorMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const mt = !activeTag      || e.tags?.includes(activeTag);
    const mv = !severityFilter || e.severity === severityFilter;
    const mu = !statusFilter   || (statusFilter === "open" ? !e.resolved : e.resolved);
    return ms && mt && mv && mu;
  });

  const openCount     = errors.filter(e => !e.resolved).length;
  const criticalCount = errors.filter(e => e.severity === "critical" && !e.resolved).length;
  const recentErrors  = [...errors].slice(0, 6);

  const clearFilters = () => { setActiveTag(""); setSeverity(""); setStatus(""); setSearch(""); };
  const hasFilters   = activeTag || severityFilter || statusFilter || searchQuery;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-200">

      {/* ── Fixed Sidebar ── */}
      <aside className="w-56 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
        {/* Logo */}
        <button
          onClick={() => setActiveNav("home")}
          className="px-6 py-5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
        >
          <span className="text-2xl">🧠</span>
          <div className="text-left">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">DevBrain</h1>
            <p className="text-xs text-gray-400 mt-0.5">Error Intelligence</p>
          </div>
        </button>

        {/* Nav items - scrollable if needed */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left
                ${activeNav === item.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* Theme toggle — always pinned at bottom */}
        <div className="shrink-0 px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <ThemeToggle />
          <p className="text-xs text-gray-400 mt-3 px-3">Press <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded">N</kbd> to log error</p>
        </div>
      </aside>

      {/* ── Main scrollable area ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Sticky topbar */}
        <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {NAV.find(n => n.id === activeNav)?.label}
            </h2>
            <p className="text-xs text-gray-400">
              {openCount} open
              {criticalCount > 0 && <span className="text-red-500 ml-1">· {criticalCount} critical</span>}
            </p>
          </div>
          {activeNav === "errors" && (
            <button
              onClick={() => setShowForm(p => !p)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {showForm ? "✕ Cancel" : "+ Log Error"}
            </button>
          )}
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── HOME PAGE ── */}
          {activeNav === "home" && (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Logged"  value={errors.length}            sub="all time"        accentClass="border-l-4 border-l-blue-400"   onClick={() => { setActiveNav("errors"); clearFilters(); }} />
                <StatCard label="Open"          value={openCount}                sub="unresolved"      accentClass="border-l-4 border-l-orange-400"  onClick={() => { setActiveNav("errors"); clearFilters(); setStatus("open"); }} />
                <StatCard label="Resolved"      value={errors.length - openCount} sub="fixed"          accentClass="border-l-4 border-l-green-400"   onClick={() => { setActiveNav("errors"); clearFilters(); setStatus("resolved"); }} />
                <StatCard label="Critical Open" value={criticalCount}             sub="needs attention" accentClass="border-l-4 border-l-red-500"     onClick={() => { setActiveNav("errors"); clearFilters(); setSeverity("critical"); setStatus("open"); }} />
              </div>

              {/* Recent errors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Errors</h3>
                  <button onClick={() => setActiveNav("errors")} className="text-xs text-blue-500 hover:underline">View all →</button>
                </div>
                {recentErrors.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="font-medium">No errors logged yet</p>
                    <button onClick={() => { setActiveNav("errors"); setShowForm(true); }} className="mt-3 text-sm text-blue-500 hover:underline">Log your first error →</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentErrors.map(err => <ErrorRow key={err._id} error={err} onSelect={setSelected} />)}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "⚡", title: "Log an Error", desc: "Record a new error with code snippet and tags", nav: "errors", form: true },
                  { icon: "🤖", title: "Ask AI Assistant", desc: "Get help debugging or understanding errors", nav: "assistant", form: false },
                  { icon: "📖", title: "Read the Guide", desc: "Learn how to get the most out of DevBrain", nav: "guide", form: false },
                ].map(a => (
                  <button key={a.title} onClick={() => { setActiveNav(a.nav); if (a.form) setShowForm(true); }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── ERROR LOG ── */}
          {activeNav === "errors" && (
            <div className="space-y-5">
              {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <ErrorForm fetchErrors={() => { refresh_(); setShowForm(false); }} />
                </div>
              )}

              {/* Filter bar */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-3 items-center">
                <input
                  type="text" placeholder="Search errors... (or press / to focus)"
                  value={searchQuery} onChange={e => setSearch(e.target.value)}
                  className="flex-1 min-w-48 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select value={severityFilter} onChange={e => setSeverity(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All severities</option>
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🔵 Low</option>
                </select>
                <select value={statusFilter} onChange={e => setStatus(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All statuses</option>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-3 py-2 rounded-lg transition">
                    ✕ Clear filters
                  </button>
                )}
                {activeTag && (
                  <span onClick={() => setActiveTag("")} className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition">
                    #{activeTag} ×
                  </span>
                )}
              </div>

              <ErrorList errors={filteredErrors} fetchErrors={refresh_} setActiveTag={setActiveTag} />

              {filteredErrors.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-medium">No errors match your filters</p>
                  {hasFilters && <button onClick={clearFilters} className="mt-2 text-sm text-blue-500 hover:underline">Clear all filters</button>}
                </div>
              )}
            </div>
          )}

          {activeNav === "analytics" && <Analytics stats={stats} />}
          {activeNav === "assistant" && <div className="max-w-2xl"><DevAssistant /></div>}
          {activeNav === "guide"     && <GuidePage onStart={() => { setActiveNav("errors"); setShowForm(true); }} />}

        </main>
      </div>

      {/* Error detail modal */}
      {selectedError && (
        <ErrorDetailModal
          error={selectedError}
          onClose={() => setSelected(null)}
          fetchErrors={refresh_}
        />
      )}
    </div>
  );
}
