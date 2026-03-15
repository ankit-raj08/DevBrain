const mongoose = require("mongoose");
const errorSchema = new mongoose.Schema({
  errorMessage: { type: String, required: true },
  codeSnippet:  { type: String, default: "" },
  description:  { type: String, default: "" },
  tags:         { type: [String], default: [] },
  severity:     { type: String, enum: ["low","medium","high","critical"], default: "medium" },
  resolved:     { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model("Error", errorSchema);
