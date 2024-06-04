const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    merchantId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transactions", transactionSchema);
