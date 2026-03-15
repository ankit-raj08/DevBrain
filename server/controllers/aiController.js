const OpenAI = require("openai");
const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
const MODEL = "llama3-8b-8192";

const explainError = async (req, res) => {
  const { errorMessage } = req.body;
  if (!errorMessage) return res.status(400).json({ message: "errorMessage required" });
  try {
    const r = await groq.chat.completions.create({ model: MODEL, max_tokens: 400, temperature: 0.4, messages: [
      { role: "system", content: "You are DevBrain, an expert debugging assistant. Explain the error: what it means, common causes, and a concrete example. Plain text, no markdown." },
      { role: "user", content: `Explain this error: ${errorMessage}` }
    ]});
    res.json({ explanation: r.choices[0].message.content });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const suggestFix = async (req, res) => {
  const { errorMessage, codeSnippet } = req.body;
  if (!errorMessage) return res.status(400).json({ message: "errorMessage required" });
  try {
    const r = await groq.chat.completions.create({ model: MODEL, max_tokens: 500, temperature: 0.3, messages: [
      { role: "system", content: "You are DevBrain. Give a specific fix: root cause in 1 sentence, then fixed code or steps. Plain text only." },
      { role: "user", content: codeSnippet ? `Error: ${errorMessage}\n\nCode:\n${codeSnippet}` : `Error: ${errorMessage}` }
    ]});
    res.json({ fix: r.choices[0].message.content });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const devAssistant = async (req, res) => {
  const { question, history = [] } = req.body;
  if (!question) return res.status(400).json({ message: "question required" });
  try {
    const r = await groq.chat.completions.create({ model: MODEL, max_tokens: 600, temperature: 0.5, messages: [
      { role: "system", content: "You are DevBrain Assistant, a smart developer AI. Help debug errors, explain concepts, suggest best practices. Concise and practical. Plain text only." },
      ...history.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
      { role: "user", content: question }
    ]});
    res.json({ reply: r.choices[0].message.content });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { explainError, suggestFix, devAssistant };
