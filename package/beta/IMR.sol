//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IMA.sol';

contract IMR is IMA {
    constructor(address IM1Destination) IMA(IM1Destination) {}
}
