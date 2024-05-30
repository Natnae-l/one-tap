const Account = require("../model/account");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const roles = ["merchant", "customer"];
async function createAccount(req, res) {
  verifyOtp();
  try {
    const { phone, password, role } = req.body;

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
    const hashedOtp = await bcrypt.hash(String(generateOtp()), 8);

    await Account.create({
      phone,
      password: hashedPassword,
      role,
      otp: [{ otp: hashedOtp }],
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).send({ error: "error" + error.message });
  }
}

function generateOtp() {
  return Math.round(Math.random() * 10e3);
}

async function verifyOtp(otpInfo, hash) {
  let same = false;

  // give a 3 minute life span for the otp
  const expired =
    Date.parse("2024-05-30T10:22:40.512+00:00") + 180000 < Date.now();

  if (!expired) {
    same = await bcrypt.compare(otpInfo.otp, hash);
  }
  return same;
}

module.exports = {
  createAccount,
};
