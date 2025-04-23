const express = require('express');
const Web3 = require('web3');

const app = express();
const web3 = new Web3('http://localhost:8545'); // Geth RPC URL

app.get('/balance/:address', async (req, res) => {
    const balance = await web3.eth.getBalance(req.params.address);
    res.send({ balance: web3.utils.fromWei(balance, "ether") });
});

app.listen(3000, () => {
    console.log("Backend API running on port 3000");
});


const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const port = 3000;

// Connect to local geth node
const web3 = new Web3("http://localhost:8545"); // Adjust if needed

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // So /Account.html is accessible

// Registration route
app.post("/api/register", async (req, res) => {
  const { name, phone, idnumber, country, password } = req.body;

  try {
    // 1. Create new Ethereum account (Geth-style)
    const account = web3.eth.accounts.create();

    // 2. Encrypt with password and save to keystore file
    const keystore = account.encrypt(password);
    const keystoreDir = path.join(__dirname, "keystore");
    await fs.ensureDir(keystoreDir);

    const filename = `UTC--${new Date().toISOString()}--${account.address}.json`;
    const filepath = path.join(keystoreDir, filename);

    await fs.writeJson(filepath, keystore);

    // 3. Save user data (for demo: console or in-memory DB)
    console.log("User registered:", {
      name,
      phone,
      idnumber,
      country,
      walletAddress: account.address,
      keystoreFile: filename
    });

    // 4. Redirect to account page
    return res.redirect("/Account.html");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Registration failed.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`CBDC Wallet server running at http://localhost:${port}`);
});