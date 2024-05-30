const mongoose = require("mongoose");

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
    fingerprint: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  this.tokens.push(token);
  await this.save();
  return token;
};

module.exports = mongoose.model("users", userSchema);
