//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IMA.sol';

contract IMV is IMA {
    mapping(string => bytes) public options;

    constructor(address IM1Destination) IMA(IM1Destination) {}

    function setOption(
        string memory option,
        bytes memory data
    ) public isApproved {
        options[option] = data;
    }

    function setOptions(
        string[] memory keys,
        bytes[] memory values
    ) public isApproved {
        require(
            keys.length == values.length,
            'each array length in params should match'
        );

        for (uint256 i = 0; i < keys.length; i++) {
            options[keys[i]] = values[i];
        }
    }

    function getString(
        string memory option
    ) public view returns (string memory) {
        bytes memory d = options[option];
        if (d.length == 0) return '';
        return string(d);
    }

    function getNumber(
        string memory option
    ) public view returns (uint256 value) {
        bytes memory d = options[option];

        if (d.length == 0) return 0;
        assembly {
            value := mload(add(d, 0x20))
        }
    }

    function isTrue(string memory option) public view returns (bool result) {
        result = decodeBoolean(options[option]);
        return result;
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
