const Customer = require("../../model/customer");
const Transaction = require("../../model/transaction");
const axios = require("axios");

const detailCustomer = async (req, res) => {
  const { name, accountNumber } = req.body;

  try {
    if (!(name && accountNumber)) {
      return res.status(400).send({ error: "bad request" });
    }
    const detail = await Customer.create({
      name,
      accountNumber,
      accountId: req._id,
    });

    res
      .status(201)
      .send({ message: "Details filled successfully", data: detail });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

const detailMerchant = async (req, res) => {
  const { name, accountNumber } = req.body;

  try {
    if (!(name && accountNumber)) {
      return res.status(400).send({ error: "bad request" });
    }
    const detail = await Customer.create({
      name,
      accountNumber,
      accountId: req._id,
    });

    res
      .status(201)
      .send({ message: "Details filled successfully", data: detail });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

async function sendNotification(phoneNumber, message) {
  try {
    const data = {
      id: "22569",
      domain: "bizfyspot.com",
      to: phoneNumber,
      otp: message,
    };
    let response = await axios.post("https://sms.yegara.com/api3/send", data);

    return response.data.status;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function makeTransaction(req, res) {
  try {
    const { customerId, merchantId, amount, item } = req.body;

    console.log(req.body);
    if (!(customerId && merchantId && amount && item))
      return res.status(400).json({ error: "Invalid input" });
    if (req.phone != customerId)
      return res.status(402).json({ error: "forbidden!" });

    let response = await fetch("http://localhost:5000/transfer", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: customerId,
        receiverId: merchantId,
        amount: amount,
        gatewayId: process.env.gatewayId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      res.status(400).send({
        error: "transaction can not be processed",
        reason: error.error,
      });
    } else {
      await Transaction.create({
        customerId: customerId,
        merchantId: merchantId,
        amount: amount,
        item: item,
      });
      await sendNotification("+251913208901", `1111`);
      return res
        .status(201)
        .send({ message: "Transaction processed successfully" });
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to make transaction" });
  }
}

module.exports = {
  detailCustomer,
  detailMerchant,
  sendNotification,
  makeTransaction,
};
