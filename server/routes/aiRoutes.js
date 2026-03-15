const express = require("express");
const router = express.Router();
const { explainError, suggestFix, devAssistant } = require("../controllers/aiController");
router.post("/explain",   explainError);
router.post("/fix",       suggestFix);
router.post("/assistant", devAssistant);
module.exports = router;
