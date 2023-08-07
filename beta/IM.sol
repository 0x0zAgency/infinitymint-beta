//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IM1.sol';
import './IMU.sol';
import './IMA.sol';

contract IM is IM1, IMU {
    uint256 public tokenId;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address storageModule,
        address valuesModule,
        address minterModule,
        address royaltyModule,
        address randomModule
    )
        IM1(
            tokenName,
            tokenSymbol,
            storageModule,
            valuesModule,
            minterModule,
            royaltyModule,
            randomModule
        )
    {}

    event NewToken(address indexed sender, Token token);
    event BurntToken(address indexed sender, Token token);

    /**
     * Returns the InfinityMint token object
     */
    function get(uint256 _tokenId) public view returns (Token memory) {
        require(tokenData[_tokenId]['token'].length != 0, 'no token data');
        return abi.decode(tokenData[_tokenId]['token'], (Token));
    }

    /**
     * Returns true if the address is a global operator or the deployer
     */
    function isAdmin(address addr) public view returns (bool) {
        return globalOperators[addr] || deployer == addr;
    }

    /**
     */
    function implicitMint(Token memory token) public {
        require(
            globalOperators[_sender()] || deployer == _sender(),
            'must be a global operator or a deployer'
        );
        bytes memory data = abi.encode(token);
        tokenData[tokenId]['token'] = data;
        super.mint(_sender(), tokenId++, data);
        emit NewToken(_sender(), token);
    }

    /**
     * Mints a new InfinityMint Token
     */
    function mint(bytes memory data) public payable {
        (bool success, bytes memory returnData) = getModule('minter').call{
            value: _value()
        }(abi.encodeWithSignature('mint(uint256,bytes)', tokenId, data));

        if (!success) {
            if (returnData.length == 0) revert('invalid response');
            else
                assembly {
                    let returndata_size := mload(returnData)
                    revert(add(32, returnData), returndata_size)
                }
        }
        tokenData[tokenId]['token'] = returnData;
        super.mint(_sender(), tokenId++, returnData);
        emit NewToken(_sender(), abi.decode(returnData, (Token)));
    }

    /**
     * Burns a new InfinityMint token
     */
    function burn(uint256 _tokenId) public {
        require(
            isApprovedOrOwner(_sender(), _tokenId),
            'must be approved or owner to burn the token'
        );

        (bool success, bytes memory returnData) = getModule('minter').call(
            abi.encodeWithSignature('burn(uint256)', tokenId)
        );

        if (!success) {
            if (returnData.length == 0) revert('invalid response');
            else
                assembly {
                    let returndata_size := mload(returnData)
                    revert(add(32, returnData), returndata_size)
                }
        }

        Token memory temp = abi.decode(tokenData[_tokenId]['token'], (Token));

        delete tokens[_tokenId];
        delete uri[_tokenId];
        delete tokenData[_tokenId]['token'];
        delete approvedTokens[_tokenId];
        balance[_sender()] -= 1;

        emit BurntToken(_sender(), temp);
    }
}
