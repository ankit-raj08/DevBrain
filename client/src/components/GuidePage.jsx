const STEPS = [
  { icon: "⚡", title: "Log an Error", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700", iconBg: "bg-blue-100 dark:bg-blue-900",
    steps: ["Click + Log Error in the top right, or press N anywhere", "Fill in the error message (required)", "Add a code snippet to get better AI fix suggestions", "Choose severity: Low → Medium → High → Critical", "Add comma-separated tags like react, api, mongodb"]
  },
  { icon: "🤖", title: "Use AI Features", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700", iconBg: "bg-purple-100 dark:bg-purple-900",
    steps: ["Click Explain on any error card to understand what went wrong", "Click Fix to get a specific code fix suggestion", "Use the AI Assistant tab to have a full debugging conversation", "The assistant remembers context within a session"]
  },
  { icon: "📊", title: "Track & Analyse", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700", iconBg: "bg-emerald-100 dark:bg-emerald-900",
    steps: ["Visit Analytics to see severity breakdown and tag frequency", "The trend chart shows errors over the last 14 days", "Click stat cards on the Home page to filter by status", "Resolved count shows how productive your debugging sessions were"]
  },
  { icon: "🔍", title: "Search & Filter", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700", iconBg: "bg-amber-100 dark:bg-amber-900",
    steps: ["Use the search bar to find errors by message text", "Filter by severity (Low / Medium / High / Critical)", "Filter by status (Open / Resolved)", "Click any tag badge to filter by that tag", "Click ✕ Clear filters to reset everything at once"]
  },
  { icon: "✓", title: "Resolve Errors", color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700", iconBg: "bg-green-100 dark:bg-green-900",
    steps: ["Click ✓ Resolve on any error card when you fix it", "Resolved errors turn grey and show a ✓ badge", "Click ↩ Reopen if you need to revisit it", "Use status filter to view only Open or Resolved errors", "Resolved count on Home updates in real time"]
  },
];

const SHORTCUTS = [
  { key: "N",   desc: "Open Log Error form (anywhere on the page)" },
  { key: "Esc", desc: "Close any open modal or form" },
  { key: "/",   desc: "Focus the search bar (on Error Log page)" },
];

export default function GuidePage({ onStart }) {
  return (
    <div className="max-w-3xl space-y-10">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-3xl font-bold mb-2">Welcome to DevBrain</h1>
        <p className="text-blue-100 text-lg mb-6">Your personal error intelligence platform. Log errors, get AI explanations and fixes, track patterns — all in one place.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onStart} className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm">
            🚀 Log Your First Error
          </button>
          <div className="flex items-center gap-2 text-blue-200 text-sm">
            <span>Powered by LLaMA 3 via Groq</span>
          </div>
        </div>
      </div>

      {/* Feature steps */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">How to use DevBrain</h2>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div key={i} className={`rounded-xl border p-5 ${s.color}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center text-lg`}>{s.icon}</div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{s.title}</h3>
              </div>
              <ol className="space-y-1.5 ml-12">
                {s.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="shrink-0 w-5 h-5 bg-white dark:bg-gray-700 rounded-full text-xs flex items-center justify-center font-medium text-gray-500 mt-0.5">{j+1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">⌨️ Keyboard Shortcuts</h2>
        <div className="space-y-2">
          {SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center gap-3">
              <kbd className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold min-w-12 text-center border border-gray-200 dark:border-gray-600">{s.key}</kbd>
              <span className="text-sm text-gray-600 dark:text-gray-300">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">💡 Pro Tips</h2>
        <ul className="space-y-2">
          {[
            "Always paste the code snippet — AI fix suggestions are much more specific when it can see the code",
            "Use consistent tags (e.g. always use 'react' not 'React' or 'ReactJS') for better analytics",
            "The similar errors panel shows up automatically as you type — check it before logging duplicates",
            "Click any error on the Home page to open a detail view with AI actions built in",
            "Dark mode preference is saved automatically — toggle it with the button at the bottom of the sidebar",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-blue-400 mt-0.5">→</span> {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
