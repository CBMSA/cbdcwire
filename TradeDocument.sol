// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeDocument {
    address public admin;

    struct Document {
        string docHash;
        string metadata;
        address issuer;
        address recipient;
        uint timestamp;
    }

    mapping(bytes32 => Document) public documents;

    constructor() {
        admin = msg.sender;
    }

    function issueDocument(
        bytes32 docId,
        string memory docHash,
        string memory metadata,
        address recipient
    ) external {
        require(msg.sender == admin, "Only admin can issue");
        documents[docId] = Document(docHash, metadata, msg.sender, recipient, block.timestamp);
    }

    function getDocument(bytes32 docId) external view returns (Document memory) {
        return documents[docId];
    }
}