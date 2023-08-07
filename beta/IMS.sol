//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IMA.sol';

contract IMS is IMA {
    mapping(uint256 => mapping(string => bytes)) public tokenOptions;
    mapping(address => mapping(string => bytes)) public addressOptions;

    constructor(address IM1Destination) IMA(IM1Destination) {}

    function setTokenOption(
        uint256 tokenId,
        string memory option,
        bytes memory data
    ) public isTokenApproved(tokenId) {
        tokenOptions[tokenId][option] = data;
    }

    function setAddressOption(string memory option, bytes memory data) public {
        addressOptions[_sender()][option] = data;
    }

    function getString(
        uint256 tokenId,
        string memory option,
        bool useAddressOptions
    ) public view returns (string memory) {
        bytes memory d = tokenOptions[tokenId][option];

        if (d.length == 0 && useAddressOptions)
            d = addressOptions[_sender()][option];

        if (d.length == 0) return '';
        return string(d);
    }

    function getNumber(
        uint256 tokenId,
        string memory option,
        bool useAddressOptions
    ) public view returns (uint256 value) {
        bytes memory d = tokenOptions[tokenId][option];

        if (d.length == 0 && useAddressOptions)
            d = addressOptions[_sender()][option];

        if (d.length == 0) return 0;
        assembly {
            value := mload(add(d, 0x20))
        }
    }

    function isTrue(
        uint256 tokenId,
        string memory option
    ) public view returns (bool result) {
        result = isTrueToToken(tokenId, option);
        if (result) return result;
        result = decodeBoolean(addressOptions[_sender()][option]);
        return result;
    }

    function isTrueToToken(
        uint256 tokenId,
        string memory option
    ) public view returns (bool result) {
        result = decodeBoolean(tokenOptions[tokenId][option]);
    }

    function decodeBoolean(bytes memory data) internal pure returns (bool b) {
        assembly {
            // Load the length of data (first 32 bytes)
            let len := mload(data)
            // Load the data after 32 bytes, so add 0x20
            b := mload(add(data, 0x20))
        }
    }
}
