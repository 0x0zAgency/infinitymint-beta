//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import '../IMM.sol';

contract DefaultMinter is IMM {
    constructor(address IMSDestination) IMM(IMSDestination) {}

    function mint(
        uint256 tokenId,
        bytes memory data
    ) public payable override returns (Token memory) {}

    function burn(uint256 tokenId) public override {}
}
