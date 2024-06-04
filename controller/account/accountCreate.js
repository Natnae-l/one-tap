const Account = require("../../model/account");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const axios = require("axios");
const Pulsar = require("pulsar-client");
const { encrypt } = require("../encryption/encryption");

require("dotenv").config();

const client = new Pulsar.Client({
  serviceUrl: process.env.pulsarUrl,
});
let producer;
(async () => {
  producer = await client.createProducer({
    topic: "pay",
  });
})();

const roles = ["merchant", "customer"];

async function createAccount(req, res) {
  try {
    const { phone, password, role, fingerPrint, email } = req.body;

    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    if (!roles.includes(role)) {
      return res
        .status(400)
        .json({ error: 'Role must be either "merchant" or "customer"' });
    }

    // check if account exist
    const account = await Account.findOne({ phone: phone });

    if (account)
      return res.status(400).send({ error: "Account already exist" });

    const hashedPassword = await bcrypt.hash(password, 8);
    const generatedOtp = String(generateOtp());
    const hashedOtp = await bcrypt.hash(generatedOtp, 8);

    await Account.create({
      phone,
      password: hashedPassword,
      role,
      otp: [{ otp: hashedOtp }],
      fingerPrint: fingerPrint,
      email: email,
    });

    const otpSent = await sendOtp(phone, generatedOtp);

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).send({ error: "error" + error.message });
  }
}

async function verifyOtpInput(req, res) {
  try {
    const { otp, phone, fingerPrint } = req.body;

    // if (String(otp).length != 4) {
    //   return res.status(400).send({ error: "Invalid otp" });
    // }

    const otpInfo = await Account.findOne(
      { phone: phone, fingerPrint: fingerPrint },
      {
        otp: 1,
        email: 1,
      }
    );

    if (!otpInfo)
      return res.status(401).send({ error: "Information not found" });

    const verified = await verifyOtp(otp, otpInfo);

    if (!verified) {
      return res.status(400).send({ error: "Invalid otp" });
    }

    await Account.findOneAndUpdate(
      { phone: phone },
      {
        verified: true,
      }
    );

    let data = encrypt({
      email: otpInfo.email,
      message: "Account verified successfully",
    });

    await producer.send({
      data: Buffer.from(JSON.stringify(data)),
    });
    res.status(200).send({ message: "Account verified" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "internal server error" });
  }
}

// regenerate otp for further application of account verification
async function regenerateOtp(req, res) {
  try {
    const { phone, fingerPrint } = req.body;

    if (!phone) return res.status(400).send({ error: "Invalid phone number" });

    const account = await Account.findOne({
      phone: phone,
      fingerPrint: fingerPrint,
    });

    if (!account)
      return res.status(400).send({ error: "Invalid phone number" });

    const generatedOtp = generateOtp();
    const newHashedOtp = await bcrypt.hash(String(generatedOtp), 8);

    await Account.findOneAndUpdate(
      {
        phone,
      },
      {
        otp: [{ otp: newHashedOtp }],
      }
    );

    await sendOtp(phone, generatedOtp);

    res.status(200).send({ message: "Otp generated successfully" });
  } catch (error) {
    res.status(400).send({ error: "Invalid input" });
  }
}

// generates a random otp
function generateOtp() {
  return Math.round(+Math.random().toFixed(4) * 1e4);
}

// a function to verify an otp with the given one
async function verifyOtp(otp, otpInfo) {
  try {
    let same = false;

    otpInfo = otpInfo.otp[0];

    // give a 3 minute life span for the otp
    const expired = Date.parse(otpInfo.expiresAt) + 180000 < Date.now();

    if (!expired) {
      same = await bcrypt.compare(otp, otpInfo.otp);
    }
    return same;
  } catch (error) {
    console.log("here", error.message);
    throw new Error("verification error");
  }
}

async function sendOtp(phoneNumber, otp) {
  try {
    const data = {
      id: "22569",
      domain: "bizfyspot.com",
      to: phoneNumber,
      otp,
    };
    let response = await axios.post("https://sms.yegara.com/api3/send", data);

    return response.data.status;
  } catch (error) {
    throw new Error(error.name);
  }
}

module.exports = {
  createAccount,
  verifyOtpInput,
  regenerateOtp,
};
