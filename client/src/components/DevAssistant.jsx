import { useState, useRef, useEffect } from "react";
import API from "../services/api";
const STARTERS = ["Why does 'map is not a function' happen?", "How do I fix CORS errors in Express?", "What is the difference between null and undefined?"];
export default function DevAssistant() {
  const [question, setQuestion] = useState("");
  const [chat, setChat]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, loading]);
  const ask = async () => {
    if (!question.trim() || loading) return;
    const q = question;
    setChat(p => [...p, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const r = await API.post("/ai/assistant", { question: q, history: chat });
      setChat(p => [...p, { role: "assistant", text: r.data.reply }]);
    } catch (_) {
      setChat(p => [...p, { role: "assistant", text: "Sorry, could not reach AI. Check GROQ_API_KEY in server .env" }]);
    } finally { setLoading(false); }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col" style={{ height: "520px" }}>
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <span className="text-xl">🤖</span>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">DevBrain Assistant</h2>
          <p className="text-xs text-gray-400">Powered by LLaMA 3 via Groq</p>
        </div>
        {chat.length > 0 && <button onClick={() => setChat([])} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Clear</button>}
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {chat.length === 0 && (
          <div className="text-center text-gray-400 mt-6">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm mb-4">Ask me anything about an error, a bug, or a concept.</p>
            <div className="flex flex-col gap-2 items-center">
              {STARTERS.map(q => <button key={q} onClick={() => setQuestion(q)} className="text-xs border border-gray-200 dark:border-gray-600 rounded-full px-4 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">{q}</button>)}
            </div>
          </div>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm"}`}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); }}} placeholder="Ask about an error... (Enter to send)" disabled={loading}
          className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
        <button onClick={ask} disabled={loading || !question.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Send</button>
      </div>
    </div>
  );
}
