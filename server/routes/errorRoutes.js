const express = require("express");
const router = express.Router();
const {
  createError, getErrors, deleteError, toggleResolved, findSimilarErrors
} = require("../controllers/errorController");

router.get("/",                  getErrors);
router.post("/similar",          findSimilarErrors);
router.post("/",                 createError);
router.delete("/:id",            deleteError);
router.post("/:id/resolve",      toggleResolved);
router.patch("/:id/resolve",     toggleResolved);

module.exports = router;