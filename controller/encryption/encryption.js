const forge = require("node-forge");
const fs = require("fs");
const NodeRSA = require("node-rsa");

const generateRSAKeys = () => {
  const { pki } = forge;
  const keypair = pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

  const publicKeyPem = pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = pki.privateKeyToPem(keypair.privateKey);

  fs.writeFileSync("public_key.pem", publicKeyPem);
  fs.writeFileSync("private_key.pem", privateKeyPem);

  console.log("Keys generated and saved to files.");
};

const publicKeyPem = fs.readFileSync("public_key.pem", "utf8");
const privateKeyPem = fs.readFileSync("private_key.pem", "utf8");

const publicKey = new NodeRSA(publicKeyPem);
const privateKey = new NodeRSA(privateKeyPem);

// Endpoint to encrypt data
const encrypt = (data) => {
  const encryptedData = publicKey.encrypt(data, "base64");

  return encryptedData;
};

// Endpoint to decrypt data
const decrypt = (encryptedData) => {
  const decryptedData = privateKey.decrypt(encryptedData, "utf8");

  return decryptedData;
};

module.exports = {
  encrypt,
  decrypt,
};
