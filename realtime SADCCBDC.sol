// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SADCCBDC {
    address public admin;
    mapping(address => uint256) public balances;
    mapping(address => bool) public frozenAccounts;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event TransferToBank(address indexed bank, uint256 amount);
    event AccountFrozen(address indexed account);
    event AccountUnfrozen(address indexed account);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier notFrozen(address account) {
        require(!frozenAccounts[account], "Account is frozen");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the deployer as admin
    }

    function mint(address recipient, uint256 amount) external onlyAdmin {
        balances[recipient] += amount;
        emit Mint(recipient, amount);
    }

    function burn(uint256 amount) external notFrozen(msg.sender) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        emit Burn(msg.sender, amount);
    }

    function freezeAccount(address account) external onlyAdmin {
        frozenAccounts[account] = true;
        emit AccountFrozen(account);
    }

    function unfreezeAccount(address account) external onlyAdmin {
        frozenAccounts[account] = false;
        emit AccountUnfrozen(account);
    }

    function sendToBank(address bank, uint256 amount) external notFrozen(msg.sender) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[bank] += amount;
        emit TransferToBank(bank, amount);
    }
}
