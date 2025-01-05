const express = require("express");
const {
  getMenusBycafeName
} = require("../controllers/cafe/menu");

const router = express.Router();

router.get('/getmenus/:cafeName',getMenusBycafeName);

module.exports = router;