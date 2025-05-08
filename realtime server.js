const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"); // Replace with your Infura or node URL

app.use(cors());
app.use(bodyParser.json());

// Treasury wallet
const TREASURY_WALLET = "0xYourTreasuryWalletAddress"; // Replace with Treasury wallet address
const PRIVATE_KEY = "YourPrivateKey"; // Replace with your wallet private key

// Initiate a transaction
app.post("/api/transactions", async (req, res) => {
  const { fromWallet, toBankAccount, amount } = req.body;

  if (!fromWallet || !toBankAccount || !amount) {
    return res.status(400).json({ success: false, message: "Invalid input." });
  }

  try {
    // Simulate CBDC transfer to bank account (replace with actual logic)
    const transaction = await web3.eth.accounts.signTransaction(
      {
        to: TREASURY_WALLET, // Sending tax to Treasury
        value: web3.utils.toWei(amount.toString(), "ether"),
        gas: 2000000,
      },
      PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(transaction.rawTransaction);
    console.log("Transaction successful:", receipt);

    return res.json({ success: true, message: "Transaction successful.", receipt });
  } catch (err) {
    console.error("Transaction failed:", err);
    return res.status(500).json({ success: false, message: "Transaction failed." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));