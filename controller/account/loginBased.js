const Account = require("../../model/account");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { phone, password, fingerPrint } = req.body;
  try {
    if (!phone || !password)
      return res.status(400).send({ error: "Invalid username or password" });

    const account = await Account.findOne({ phone: phone, verified: true });

    if (!account)
      return res.status(400).send({ error: "Invalid username or password" });

    const isSimilar = await bcrypt.compare(password, account.password);

    if (!isSimilar)
      return res.status(400).send({ error: "Invalid username or password" });

    if (account.fingerPrint != fingerPrint)
      return res.status(401).send({ error: "Unsuccessful login request" });

    // set an http-only cookie here, sameSite="strict"
    const token = await account.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Please try again later" });
  }
};

const logout = async (req, res) => {};

const authCustomer = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const auth = jwt.verify(token, process.env.secretJWT);
      try {
        if (auth) {
          req.phone = auth.phone;
          req._id = auth._id;

          if (auth.role != "customer") {
            return res.status(401).send({ error: "not authorized" });
          }
          next();
        }
      } catch (error) {
        res.status(400).send({
          error: "not authorized",
        });
      }
    } else {
      res.status(400).send({
        error: "not authorized",
      });
    }
  } catch (error) {
    res.status(500).send("Internal server error" + error.message);
  }
};
const authMerchant = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const auth = jwt.verify(token, process.env.secretJWT);
      try {
        if (auth) {
          req.phone = auth.phone;
          req._id = auth._id;

          if (auth.role != "merchant") {
            return res.status(401).send({ error: "not authorized" });
          }
          next();
        }
      } catch (error) {
        res.status(400).send({
          error: "not authorized",
        });
      }
    } else {
      res.status(400).send({
        error: "not authorized",
      });
    }
  } catch (error) {
    res.status(500).send("Internal server error" + error.message);
  }
};

module.exports = { login, logout, authCustomer, authMerchant };
