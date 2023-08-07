//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import '../IMMA.sol';

contract SimpleAsset is IMMA {
    constructor(address IM1Destination) IMMA(IM1Destination) {}

    function getNextPathId() public override returns (uint256) {
        return 0;
    }

    function getPathData() public override returns (bytes[] memory) {}

    function getSeeds() public override returns (uint256[] memory) {}
}
