
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SADCCBDC is ERC20, Ownable {
    mapping(address => bool) public frozenAccounts;

    constructor() ERC20("SADC CBDC", "SADC") {
        transferOwnership(0x0aC945DBDC9D1f64752deDf7a40776FE84b8bbc8);
    }

    modifier notFrozen(address account) {
        require(!frozenAccounts[account], "Account is frozen");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external notFrozen(msg.sender) {
        _burn(msg.sender, amount);
    }

    function freezeAccount(address account) external onlyOwner {
        frozenAccounts[account] = true;
    }

    function unfreezeAccount(address account) external onlyOwner {
        frozenAccounts[account] = false;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal override
    {
        require(!frozenAccounts[from], "Sender is frozen");
        require(!frozenAccounts[to], "Recipient is frozen");
        super._beforeTokenTransfer(from, to, amount);
    }
}
