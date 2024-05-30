const express = require("express");
const accountController = require("../controller/account");

const router = express.Router();

router.post("/account", accountController.createAccount);

module.exports = router;
