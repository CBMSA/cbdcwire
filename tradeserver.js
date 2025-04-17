const express = require("express");
const app = express();
const dotenv = require("dotenv");
const Web3 = require("web3");
const fs = require("fs");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve HTML

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const contractABI = JSON.parse(fs.readFileSync("./TradeContractABI.json"));
const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

web3.eth.accounts.wallet.add(account);

app.post("/mint", async (req, res) => {
  const { to, amount } = req.body;
  try {
    const tx = contract.methods.mint(to, amount);
    const gas = await tx.estimateGas({ from: account.address });
    const result = await tx.send({ from: account.address, gas });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
