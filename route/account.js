const express = require("express");
const accountController = require("../controller/account/accountCreate");
const loginController = require("../controller/account/loginBased");
const customerController = require("../controller/account/customer");

const router = express.Router();

// account creation api's
router.post("/account", accountController.createAccount);
router.post("/verifyOtp", accountController.verifyOtpInput);
router.post("/resendOtp", accountController.regenerateOtp);

// login based api's
router.post("/login", loginController.login);

// customer based api's
router.post(
  "/customer/detail",
  loginController.authCustomer,
  customerController.detailCustomer
);

router.post(
  "/transaction",
  loginController.authCustomer,
  customerController.makeTransaction
);

// customer based api's
router.post(
  "/merchant/detail",
  loginController.authMerchant,
  customerController.detailMerchant
);

module.exports = router;
