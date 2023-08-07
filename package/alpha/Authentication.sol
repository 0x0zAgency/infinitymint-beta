//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './InfinityMintObject.sol';

abstract contract Authentication {
    address public deployer;
    /// @notice for re-entry prevention, keeps track of a methods execution count
    uint256 private executionCount;
    uint256 public approvalCount;

    mapping(address => bool) public approved;

    constructor() {
        deployer = msg.sender;
        approved[msg.sender] = true;
        executionCount = 0;
        approvalCount = 0;
    }

    event PermissionChange(
        address indexed sender,
        address indexed changee,
        bool value
    );

    event TransferedOwnership(address indexed from, address indexed to);

    /// @notice Limits execution of a method to once in the given context.
    /// @dev prevents re-entry attack
    modifier onlyOnce() {
        executionCount += 1;
        uint256 localCounter = executionCount;
        _;
        require(localCounter == executionCount, 're-entry');
    }

    modifier onlyDeployer() {
        require(deployer == msg.sender, 'not deployer');
        _;
    }

    modifier onlyApproved() {
        require(
            deployer == msg.sender || approved[msg.sender],
            string.concat(
                '0x',
                toAsciiString(msg.sender),
                ' not approved on 0x',
                toAsciiString(address(this))
            )
        );
        _;
    }

    function setPrivilages(address addr, bool value) public onlyDeployer {
        require(addr != deployer, 'cannot modify deployer');
        approved[addr] = value;

        if (value) approvalCount++;
        else approvalCount--;

        emit PermissionChange(msg.sender, addr, value);
    }

    function multiApprove(address[] memory addrs) public onlyDeployer {
        require(addrs.length != 0);
        for (uint256 i = 0; i < addrs.length; ) {
            approved[addrs[i]] = true;
            approvalCount++;
            unchecked {
                ++i;
            }
        }
    }

    function multiRevoke(address[] memory addrs) public onlyDeployer {
        require(addrs.length != 0);
        for (uint256 i = 0; i < addrs.length; ) {
            approved[addrs[i]] = false;
            approvalCount--;
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

        emit TransferedOwnership(msg.sender, addr);
    }

    //for more detailed output
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    //for more detailed output
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
