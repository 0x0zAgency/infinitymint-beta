//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IMA.sol';
import './IMU.sol';

abstract contract IMM is IMA, IMU {
    constructor(address IM1Destination) IMA(IM1Destination) {}

    function mint(
        uint256 tokenId,
        bytes memory data
    ) public payable virtual returns (Token memory);

    function burn(uint256 tokenId) public virtual;

    ///@notice secures msg.value so it cannot be changed
    function _value() internal view returns (uint256) {
        return (msg.value);
    }
}
