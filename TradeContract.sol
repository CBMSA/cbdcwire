// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeContract {
    address public admin;
    mapping(address => uint256) public balances;
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == admin, "Only admin can mint");
        balances[to] += amount;
        emit Mint(to, amount);
    }

    function burn(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        emit Burn(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
}
