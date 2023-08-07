//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

abstract contract IMU {
    struct Token {
        uint256 tokenId;
        uint256 pathId;
        bytes[] pathData; //contains encoded assets and more, 0 will always be assets
        uint256[] seeds;
        address originalOwner;
    }
}
