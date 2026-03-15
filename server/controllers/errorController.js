const ErrorModel = require("../models/Error");

const createError = async (req, res) => {
  try {
    const { errorMessage, codeSnippet, description, tags, severity } = req.body;
    if (!errorMessage?.trim()) return res.status(400).json({ message: "errorMessage is required" });
    const saved = await new ErrorModel({
      errorMessage: errorMessage.trim(), codeSnippet: codeSnippet || "",
      description: description || "", tags: Array.isArray(tags) ? tags.filter(t => t.trim()) : [],
      severity: severity || "medium", resolved: false
    }).save();
    res.status(201).json(saved);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getErrors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.resolved !== undefined) filter.resolved = req.query.resolved === "true";
    if (req.query.tag) filter.tags = req.query.tag;
    res.json(await ErrorModel.find(filter).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteError = async (req, res) => {
  try {
    const err = await ErrorModel.findByIdAndDelete(req.params.id);
    if (!err) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const toggleResolved = async (req, res) => {
  console.log("Toggling resolved for", req.params.id);
  try {
    const err = await ErrorModel.findById(req.params.id);
    if (!err) return res.status(404).json({ message: "Not found" });
    err.resolved = !err.resolved;
    res.json(await err.save());
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const findSimilarErrors = async (req, res) => {
  try {
    const { errorMessage } = req.body;
    if (!errorMessage) return res.json([]);
    const words = errorMessage.split(" ").filter(w => w.length > 3).slice(0, 4);
    if (!words.length) return res.json([]);
    const regex = new RegExp(words.join("|"), "i");
    res.json(await ErrorModel.find({ errorMessage: { $regex: regex } }).sort({ createdAt: -1 }).limit(4));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { createError, getErrors, deleteError, toggleResolved, findSimilarErrors };
