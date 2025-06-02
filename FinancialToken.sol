
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FinancialToken {
    string public name = "Financial Token";
    string public symbol = "FIN";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balances;
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * (10 ** uint256(decimals));
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
