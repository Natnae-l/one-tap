const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("merchants", merchantSchema);
