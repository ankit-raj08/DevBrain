import ErrorTrendChart from "./ErrorTrendChart";
const SEV = {
  low:      { bar: "bg-blue-400",   text: "text-blue-600 dark:text-blue-400" },
  medium:   { bar: "bg-yellow-400", text: "text-yellow-600 dark:text-yellow-400" },
  high:     { bar: "bg-orange-400", text: "text-orange-600 dark:text-orange-400" },
  critical: { bar: "bg-red-500",    text: "text-red-600 dark:text-red-400" },
};
export default function Analytics({ stats }) {
  if (!stats) return <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-2">📊</div><p>Loading analytics...</p></div>;
  const maxTag = Math.max(...(stats.tagStats?.map(t => t.count) || [1]));
  const sevMap = Object.fromEntries((stats.severityStats || []).map(s => [s._id, s.count]));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[["Total", stats.totalErrors, "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"],
          ["Open", stats.openErrors, "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300"],
          ["Resolved", stats.resolvedErrors, "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"]
        ].map(([l, v, c]) => (
          <div key={l} className={`rounded-xl border p-4 ${c}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{l}</p>
            <p className="text-3xl font-bold mt-1">{v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Severity Breakdown</h2>
        <div className="space-y-3">
          {["critical","high","medium","low"].map(s => {
            const c = sevMap[s] || 0;
            const p = stats.totalErrors ? Math.round((c / stats.totalErrors) * 100) : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <span className={`text-xs font-semibold w-16 capitalize ${SEV[s]?.text}`}>{s}</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className={`${SEV[s]?.bar} h-2 rounded-full transition-all duration-500`} style={{ width: `${p}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-6 text-right">{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      {stats.tagStats?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Most Common Tags</h2>
          <div className="space-y-2">
            {stats.tagStats.map(t => (
              <div key={t._id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-24 truncate">#{t._id}</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full transition-all" style={{ width: `${(t.count / maxTag) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-6 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.trends?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Error Trends (last 14 days)</h2>
          <ErrorTrendChart trends={stats.trends} />
        </div>
      )}

      {stats.totalErrors === 0 && (
        <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-2">📭</div><p>No data yet — log your first error to see analytics.</p></div>
      )}
    </div>
  );
}
