const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    accountNumber: { type: Number },
    amount: { type: Number },
    accountId: {
      // this is owners accountId and it is used as account number too
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banks", merchantSchema);
