//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

/// @title InfinityMint Authentication interface
/// @author Llydia Cross
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
abstract contract IMA {
    mapping(address => bool) public approved;
    address public deployer;
    uint256 internal executionCount;
    //erc721/IM1 location
    address public IM1;

    constructor(address IM1Destination) {
        deployer = _sender();
        approved[_sender()] = true;
        IM1 = IM1Destination;
    }

    modifier isTokenApproved(uint256 tokenId) {
        require(isApprovedOrOwner(IM1, _sender(), tokenId));
        _;
    }

    modifier isAdmin() {
        require(isAdministrator(_sender()), 'you are not the deployer');
        _;
    }

    modifier isApproved() {
        require(approved[_sender()], 'you are not approved');
        _;
    }

    modifier onlyDeployer() {
        require(_sender() == deployer, 'you are not the deployer');
        _;
    }

    /// @notice Limits execution of a method to once in the given context.
    /// @dev prevents re-entry attack
    modifier onlyOnce() {
        executionCount += 1;
        uint256 localCounter = executionCount;
        _;
        require(localCounter == executionCount, 're-entry');
    }

    ///@notice secures msg.sender so it cannot be changed
    function _sender() internal view returns (address) {
        return (msg.sender);
    }

    function setPrivilages(address addr, bool value) public onlyDeployer {
        require(addr != deployer, 'cannot modify deployer');
        approved[addr] = value;
    }

    function multiApprove(address[] memory addrs) public onlyDeployer {
        require(addrs.length != 0);
        for (uint256 i = 0; i < addrs.length; ) {
            approved[addrs[i]] = true;
            unchecked {
                ++i;
            }
        }
    }

    function multiRevoke(address[] memory addrs) public onlyDeployer {
        require(addrs.length != 0);
        for (uint256 i = 0; i < addrs.length; ) {
            approved[addrs[i]] = false;
            unchecked {
                ++i;
            }
        }
    }

    function isAuthenticated(address addr) external view returns (bool) {
        return addr == deployer || approved[addr];
    }

    function transferOwnership(address addr) public onlyDeployer {
        approved[deployer] = false;
        deployer = addr;
        approved[addr] = true;
    }

    function isExternallyAuthenticated(
        address addr,
        address IMContractDestination
    ) public view returns (bool) {
        IMA temp = IMA(IMContractDestination);
        return temp.isAuthenticated(addr);
    }

    function getModule(string memory module) private view returns (address) {
        (bool success, bytes memory returnData) = IM1.staticcall(
            abi.encodeWithSignature('getModule(string)', module)
        );

        if (!success) {
            if (returnData.length == 0) revert('invalid response');
            else
                assembly {
                    let returndata_size := mload(returnData)
                    revert(add(32, returnData), returndata_size)
                }
        }

        return abi.decode(returnData, (address));
    }

    function isApprovedOrOwner(
        address erc721Contract,
        address owner,
        uint256 tokenId
    ) public view returns (bool) {
        (bool success, bytes memory returnData) = erc721Contract.staticcall(
            abi.encodeWithSignature(
                'isApprovedOrOwner(address,uint256)',
                owner,
                tokenId
            )
        );

        if (!success) {
            if (returnData.length == 0) revert('invalid response');
            else
                assembly {
                    let returndata_size := mload(returnData)
                    revert(add(32, returnData), returndata_size)
                }
        }

        bool result = abi.decode(returnData, (bool));
        return result == true;
    }

    function isAdministrator(address addr) public view returns (bool) {
        (bool success, bytes memory returnData) = IM1.staticcall(
            abi.encodeWithSignature('isAdmin(address)', addr)
        );

        if (!success) {
            if (returnData.length == 0) revert('invalid response');
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
