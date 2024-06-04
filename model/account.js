const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "merchant", "admin"],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: [otpSchema],
    email: { type: String, required: true },
    tokens: [String],
    fingerPrint: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    { phone: this.phone, _id: this._id, role: this.role },
    process.env.secretJWT
  );
  this.tokens.push(token);
  await this.save();
  return token;
};

module.exports = mongoose.model("users", userSchema);
