const express = require("express");
const {
  analyzeFace
} = require("../controllers/gemini/analyzeFace");

const router = express.Router();

router.post("/analyzeface", analyzeFace);



module.exports = router;