const express = require('express');
const Web3 = require('web3');
const axios = require('axios');
const app = express();
app.use(express.json());

const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_PROJECT_ID");
const contractABI = []; // Replace with ABI
const contractAddress = "YOUR_DEPLOYED_CBDC_CONTRACT_ADDRESS";
const contract = new web3.eth.Contract(contractABI, contractAddress);
const adminPrivateKey = "YOUR_ADMIN_PRIVATE_KEY";
const adminAccount = web3.eth.accounts.privateKeyToAccount(adminPrivateKey);

async function sendSignedTransaction(tx) {
    const gas = await tx.estimateGas({ from: adminAccount.address });
    const data = tx.encodeABI();
    const txData = {
        from: adminAccount.address,
        to: contractAddress,
        data,
        gas
    };
    const signedTx = await web3.eth.accounts.signTransaction(txData, adminPrivateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

app.post("/mint-cbdc", async (req, res) => {
    const { recipient, ethAmount } = req.body;
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=zar");
        const ethPriceZAR = response.data.ethereum.zar;
        const amountToMint = ethAmount * ethPriceZAR;

        const tx = contract.methods.mint(recipient, Math.floor(amountToMint));
        const receipt = await sendSignedTransaction(tx);
        res.send({ status: "success", receipt });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

app.post("/burn-cbdc", async (req, res) => {
    const { userAddress, amount } = req.body;
    try {
        const tx = contract.methods.burn(amount);
        const receipt = await sendSignedTransaction(tx);
        res.send({ status: "success", receipt });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

app.post("/freeze-account", async (req, res) => {
    const { target } = req.body;
    try {
        const tx = contract.methods.freezeAccount(target);
        const receipt = await sendSignedTransaction(tx);
        res.send({ status: "success", receipt });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

app.post("/send-to-bank", async (req, res) => {
    const { sender, bankAddress, amount } = req.body;
    try {
        const tx = contract.methods.sendToBank(bankAddress, amount);
        const receipt = await sendSignedTransaction(tx);
        res.send({ status: "success", receipt });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
