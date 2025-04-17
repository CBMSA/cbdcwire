const Web3 = require('web3');
const contractABI = require('./TradeDocumentABI.json');
const contractAddress = '0x...'; // deployed contract address

const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function issueTradeDoc(docId, hash, metadata, recipient, adminPrivateKey) {
  const data = contract.methods.issueDocument(docId, hash, metadata, recipient).encodeABI();
  const tx = {
    to: contractAddress,
    data,
    gas: 2000000,
  };

  const signed = await web3.eth.accounts.signTransaction(tx, adminPrivateKey);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return receipt;
}