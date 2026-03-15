const express = require("express");
const router = express.Router();
const ErrorModel = require("../models/Error");

router.get("/", async (req, res) => {
  try {
    const [totalErrors, openErrors, resolvedErrors, tagStats, severityStats, trends] = await Promise.all([
      ErrorModel.countDocuments(),
      ErrorModel.countDocuments({ resolved: false }),
      ErrorModel.countDocuments({ resolved: true }),
      ErrorModel.aggregate([{ $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
      ErrorModel.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]),
      ErrorModel.aggregate([{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $limit: 14 }])
    ]);
    res.json({ totalErrors, openErrors, resolvedErrors, tagStats, severityStats, trends });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
