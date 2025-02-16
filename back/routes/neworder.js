const express = require("express");
const {
  newOrderCreate,
} = require("../controllers/neworder/orderProcess");

const router = express.Router();

router.post('/ordercall',newOrderCreate);

module.exports = router;