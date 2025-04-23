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
