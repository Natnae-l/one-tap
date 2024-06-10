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

/**
 * @swagger
 * /account:
 *   post:
 *     summary: Create an account
 *     description: Endpoint to create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               password:
 *                 type: string
 *                 description: The password for the account
 *               role:
 *                 type: string
 *                 description: The role of the user (either "merchant" or "customer")
 *               fingerPrint:
 *                 type: string
 *                 description: A fingerprint for additional security
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *     responses:
 *       '201':
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *       '400':
 *         description: Invalid request or account already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request or account already exists
 */

/**
 * @swagger
 * /verifyOtp:
 *   post:
 *     summary: Verify account OTP
 *     description: Endpoint to verify the OTP sent during account creation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               fingerPrint:
 *                 type: string
 *                 description: A fingerprint for additional security
 *     responses:
 *       '200':
 *         description: Account verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified
 *       '400':
 *         description: Invalid OTP or information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid OTP or information not found
 */

/**
 * @swagger
 * /resendOtp:
 *   post:
 *     summary: Resend OTP for account verification
 *     description: Endpoint to resend OTP for account verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               fingerPrint:
 *                 type: string
 *                 description: A fingerprint for additional security
 *     responses:
 *       '200':
 *         description: OTP regenerated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP regenerated successfully
 *       '400':
 *         description: Invalid phone number or information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid phone number or information not found
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to the system
 *     description: Endpoint for user authentication and login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               password:
 *                 type: string
 *                 description: The password for the account
 *               fingerPrint:
 *                 type: string
 *                 description: A fingerprint for additional security
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       '400':
 *         description: Invalid username, password, or fingerprint
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid username, password, or fingerprint
 */

/**
 * @swagger
 * /customer/detail:
 *   post:
 *     summary: Retrieve customer details
 *     description: Endpoint to retrieve details of a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the customer
 *               accountNumber:
 *                 type: string
 *                 description: The account number of the customer
 *     responses:
 *       '201':
 *         description: Details filled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Details filled successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     accountNumber:
 *                       type: string
 *                       example: AC123456
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad request
 */

/**
 * @swagger
 * /merchant/detail:
 *   post:
 *     summary: Retrieve merchant details
 *     description: Endpoint to retrieve details of a merchant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the merchant
 *               accountNumber:
 *                 type: string
 *                 description: The account number of the merchant
 *     responses:
 *       '201':
 *         description: Details filled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Details filled successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 */

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Make a transaction
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - merchantId
 *               - amount
 *               - item
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer
 *               merchantId:
 *                 type: string
 *                 description: The ID of the merchant
 *               amount:
 *                 type: number
 *                 description: The amount to be transferred
 *               item:
 *                 type: string
 *                 description: The item being purchased
 *     responses:
 *       201:
 *         description: Transaction processed successfully
 *       400:
 *         description: Invalid input or transaction cannot be processed
 *       402:
 *         description: Forbidden
 *       500:
 *         description: Failed to make transaction
 */
