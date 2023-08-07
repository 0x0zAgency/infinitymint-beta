//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IMA.sol';
import './IMU.sol';

abstract contract IMMA is IMA, IMU {
    mapping(uint256 => mapping(string => bytes)) public pathOptions;

    constructor(address IM1Destination) IMA(IM1Destination) {}

    function getNextPathId() public virtual returns (uint256);

    function getSeeds() public virtual returns (uint256[] memory);

    function getPathData() public virtual returns (bytes[] memory);

    function setOption(
        uint256 pathId,
        string memory option,
        bytes memory data
    ) public isApproved {
        pathOptions[pathId][option] = data;
    }

    function setOptions(
        uint256[] memory pathIds,
        string[] memory keys,
        bytes[] memory values
    ) public isApproved {
        require(
            keys.length == values.length && keys.length == pathIds.length,
            'each array length in params should match'
        );

        for (uint256 i = 0; i < keys.length; i++) {
            pathOptions[pathIds[i]][keys[i]] = values[i];
        }
    }

    function getString(
        uint256 pathId,
        string memory option
    ) public view returns (string memory) {
        bytes memory d = pathOptions[pathId][option];
        if (d.length == 0) return '';
        return string(d);
    }

    function getNumber(
        uint256 pathId,
        string memory option
    ) public view returns (uint256 value) {
        bytes memory d = pathOptions[pathId][option];

        if (d.length == 0) return 0;
        assembly {
            value := mload(add(d, 0x20))
        }
    }

    function isTrue(
        uint256 pathId,
        string memory option
    ) public view returns (bool result) {
        result = decodeBoolean(pathOptions[pathId][option]);
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
