
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const BANK_ACCOUNTS = [
  { name: 'Commercial Bank', address: '0xCOMMERCIAL_BANK_ACCOUNT' },
  { name: 'Merchant Bank', address: '0xMERCHANT_BANK_ACCOUNT' },
  { name: 'Credit Card Processor', address: '0xCREDIT_CARD_ACCOUNT' },
  { name: 'Savings Bank', address: '0xSAVINGS_ACCOUNT' },
  { name: 'Investment Fund', address: '0xINVESTMENT_ACCOUNT' }
];

const CONTRACT_ADDRESS = "0xYourSmartContractAddress";

export default function FinancialTrackingApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const ethSigner = provider.getSigner();
    const userAddress = await ethSigner.getAddress();
    setSigner(ethSigner);
    setAddress(userAddress);

    const stockContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, ethSigner);
    setContract(stockContract);

    const newBalances = {};
    for (const account of BANK_ACCOUNTS) {
      const bal = await stockContract.balanceOf(account.address);
      newBalances[account.name] = ethers.utils.formatUnits(bal, 18);
    }
    setBalances(newBalances);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Financial Monitoring Dashboard</h1>
      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p className="mb-4">Connected as: <strong>{address}</strong></p>
          <h2 className="text-xl font-semibold mb-2">📊 Tracked Institution Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BANK_ACCOUNTS.map((account) => (
              <div key={account.address} className="p-4 border rounded-xl shadow">
                <p className="font-semibold">{account.name}</p>
                <p className="text-sm text-gray-500">{account.address}</p>
                <p className="mt-2 text-lg">{balances[account.name] || 'Loading...'} TOKEN</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
