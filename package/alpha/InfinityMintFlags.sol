//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './Asset.sol';
import './Authentication.sol';
import './InfinityMintObject.sol';
import './InfinityMintStorage.sol';

contract InfinityMintFlags is Authentication, InfinityMintObject {
    InfinityMintStorage storageController;
    address erc721Location;

    constructor(address storageDestination, address erc721Destination) {
        storageController = InfinityMintStorage(storageDestination);
        erc721Location = erc721Destination;
    }

    function setOption(string memory key, string memory option) public {
        storageController.setOption(sender(), key, option);
    }

    function hasOption(string memory key) public view returns (bool) {
        return bytes(getOption(key)).length != 0;
    }

    function getOption(string memory key) public view returns (string memory) {
        return storageController.getOption(sender(), key);
    }

    function isFlagTrue(
        uint256 tokenId,
        string memory key
    ) public view returns (bool) {
        bool globalFlag = storageController.flag(sender(), key);
        return
            globalFlag == true ||
            storageController.tokenFlag(uint32(tokenId), key) == true;
    }

    function setOptions(string[] memory keys, string[] memory options) public {
        require(
            keys.length == options.length,
            'keys must match options in length'
        );

        for (uint256 i = 0; i < keys.length; ) {
            setOption(keys[i], options[i]);
            unchecked {
                ++i;
            }
        }
    }

    function isGlobalFlag(string memory key) public view returns (bool) {
        return storageController.flag(sender(), key);
    }

    function setFlag(uint256 tokenId, string memory key, bool position) public {
        require(
            isApprovedOrOwner(sender(), tokenId),
            'must be approved or owner of the tokenId'
        );
        storageController.setTokenFlag(tokenId, key, position);
    }

    function setGlobalFlag(string memory key, bool position) public {
        storageController.setFlag(sender(), key, position);
    }

    /// @notice gets token
    /// @dev erc721 address must be ERC721 implementor.
    function isApprovedOrOwner(
        address owner,
        uint256 tokenId
    ) private view returns (bool) {
        (bool success, bytes memory returnData) = erc721Location.staticcall(
            abi.encodeWithSignature(
                'isApprovedOrOwner(address,uint256)',
                owner,
                tokenId
            )
        );

        if (!success) {
            if (returnData.length == 0) revert('is approved or owner reverted');
            else
                assembly {
                    let returndata_size := mload(returnData)
                    revert(add(32, returnData), returndata_size)
                }
        }

        bool result = abi.decode(returnData, (bool));
        return result == true;
    }
}
