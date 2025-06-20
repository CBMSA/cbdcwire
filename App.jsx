
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










// File: app.jsx (React Frontend with TailwindCSS)

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';

const mockAPI = async (tx) => {
  return new Promise(resolve => setTimeout(() => resolve({ status: 'success', ...tx }), 1200));
};

export default function CBDCPlatform() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('Flutterwave');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleTransfer = async () => {
    setLoading(true);
    const txId = uuidv4();
    const tx = {
      id: txId,
      amount,
      destination,
      timestamp: new Date().toISOString(),
    };
    const result = await mockAPI(tx);
    setTransactions([result, ...transactions]);
    setLoading(false);
    setStatus(`Transaction ${txId} completed.`);
    setAmount('');
  };

  const downloadHistory = () => {
    const csv = [
      'Transaction ID,Amount,Destination,Timestamp',
      ...transactions.map(t => `${t.id},${t.amount},${t.destination},${t.timestamp}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transaction_history.csv';
    link.click();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">SADC CBDC Trading & Issuance Platform</h1>

      <Card className="mb-6">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Issue / Transfer CBDC</h2>
          <input
            type="number"
            placeholder="Amount in ZAR"
            className="border p-2 rounded w-full"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full"
            value={destination}
            onChange={e => setDestination(e.target.value)}
          >
            <option value="Flutterwave">Flutterwave</option>
            <option value="Paystack">Paystack</option>
            <option value="Mukuru">Mukuru</option>
            <option value="Binance">Binance</option>
          </select>
          <Button onClick={handleTransfer} disabled={loading}>
            {loading ? 'Processing...' : 'Send CBDC'}
          </Button>
          {status && <p className="text-green-600">{status}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Real-time Transactions</h2>
        <Button variant="outline" onClick={downloadHistory}>Download History</Button>
      </div>

      <ul className="space-y-2">
        {transactions.map(tx => (
          <li key={tx.id} className="border rounded p-3 bg-gray-50">
            <p><strong>ID:</strong> {tx.id}</p>
            <p><strong>Amount:</strong> R{tx.amount}</p>
            <p><strong>To:</strong> {tx.destination}</p>
            <p><strong>Time:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Sui Move Smart Contract Example (for on-chain issuance) ---
// File: cbdc.move
//
// module sadc_cbdc::CBDC {
//     use sui::coin::{self, Coin};
//     use sui::tx_context::TxContext;
//     use sui::object::{Self, UID};
//     use sui::balance::Balance;
//     use sui::transfer;
//     use sui::address::Address;
//
//     struct CBDC has key, store {
//         id: UID,
//         balance: Balance<u64>,
//     }
//
//     public fun mint(recipient: address, amount: u64, ctx: &mut TxContext) {
//         let cbdc = CBDC {
//             id: object::new(ctx),
//             balance: balance::new(amount),
//         };
//         transfer::transfer(cbdc, recipient);
//     }
// }


✅ The code has been updated to include:

1. Transaction ID generation using uuidv4


2. CSV download of real-time transaction history


3. Basic structure for a Sui Move smart contract for CBDC minting and transfer



🔜 Next Steps Available:

🔧 Setup backend (Node.js) to:

Handle biometric login

Secure API proxies to Paystack, Flutterwave, etc.


🔗 Enable real deposit via Flutterwave, Paystack, or Mukuru APIs

📱 Build the mobile version with biometric authentication

💡 Add wallet generation + blockchain balance check using Sui


Would you like me to begin with the Node.js backend with biometric + API routes, or focus on connecting the Sui blockchain live?




