const mongoose = require("mongoose");

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
    otp: [
      {
        type: Number,
      },
    ],
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
