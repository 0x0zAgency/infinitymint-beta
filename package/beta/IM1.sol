//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './IERC721.sol';
import './ERC165.sol';
import './IERC165.sol';

/// @title IM-1 InfinityMint Specification
/// @author Llydia Cross
/// @notice This is a basic ERC721 Implementation for infinitymint that is designed to be as simple and gas efficient as possible.
/// @dev This contract supports tokenURI (the Metadata extension)
contract IM1 is ERC165, IERC721, IERC721Metadata {
    ///@notice Storage for the tokens
    ///@dev indexed by tokenId
    mapping(uint256 => address) internal tokens; //(slot 0)
    ///@notice Storage the token metadata
    ///@dev indexed by tokenId
    mapping(uint256 => string) internal uri; //(slot 1)
    ///@notice Storage the token metadata
    ///@dev indexed by tokenId
    mapping(uint256 => address) internal approvedTokens; //(slot 2)
    ///@notice Stores approved operators for the addresses tokens.
    mapping(address => mapping(address => bool)) internal operators; //(slot 3)
    ///@notice Stores the balance of tokens
    mapping(address => uint256) internal balance; //(slot 4)
    // holds the infinity links for each token
    mapping(uint256 => mapping(string => address)) public infinityLinks; //(slot 5)
    // holds the token data for each token
    mapping(uint256 => mapping(string => bytes)) public tokenData; //(slot 6)
    // holds the global operators
    mapping(address => bool) public globalOperators; //(slot 7);
    // holds IM modules
    mapping(string => address) public modules; //(slot 8)
    ///@notice The name of the ERC721
    string internal _name; //(slot 9)
    ///@notice The Symbol of the ERC721
    string internal _symbol; //(slot 10)
    ///@notice The address that deployed the contract
    address public deployer; //(slot 11)

    /**
        @notice ERC721 Constructor takes tokenName and tokenSymbol
     */
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address storageModule,
        address valuesModule,
        address minterModule,
        address royaltyModule,
        address randomModule
    ) {
        _name = tokenName;
        _symbol = tokenSymbol;
        globalOperators[_sender()] = true;
        deployer = _sender();

        modules['storage'] = storageModule;
        modules['values'] = valuesModule;
        modules['minter'] = minterModule;
        modules['royalty'] = royaltyModule;
        modules['random'] = randomModule;
    }

    function getModule(string memory module) public view returns (address) {
        require(modules[module] != address(0), 'invalid module');
        return modules[module];
    }

    function setDeployer(address _newDeployer) public {
        require(
            _sender() == deployer,
            'only the deployer can set the deployer'
        );
        deployer = _newDeployer;
        globalOperators[_newDeployer] = true;
        globalOperators[_sender()] = false;
    }

    function setModule(string memory _module, address destination) public {
        require(
            _sender() == deployer,
            'only the deployer can set the deployer'
        );
        require(
            destination != address(0),
            'destination cannot be null address'
        );
        require(isContract(destination), 'must be a contract');

        modules[_module] = destination;
    }

    /**
     * @dev Global Operators can modify InfinityLinks and tokenData
     * @notice Sets an address to be able to modify operator settings
     */
    function setGlobalOperator(address _operator, bool _status) public {
        require(
            _sender() == deployer,
            'only the deployer can set global operators'
        );
        require(
            _operator != address(0),
            'cannot set the null address as a global operator'
        );
        require(_operator != _sender(), 'cannot modify yourself');
        require(_operator != deployer, 'cannot modify the deployer');
        globalOperators[_operator] = _status;
    }

    /**
     * @dev InfinityLinks are used to link a token to a contract.
     * @notice Set an infinity link for a token
     */
    function setInfinityLink(
        uint256 _tokenId,
        string memory _link,
        address _contract
    ) public {
        require(
            isApprovedOrOwner(_sender(), _tokenId) ||
                globalOperators[_sender()],
            'only the owner of the token or a global operator can set the infinity link'
        );
        require(isContract(_contract), 'invalid contract address');
        infinityLinks[_tokenId][_link] = _contract;
    }

    /**
     * @dev Can only be called by the owner of the token
     * @notice Sets the tokenData for a token, is not the URI
     */
    function setTokenData(
        uint256 _tokenId,
        string memory _key,
        bytes memory _data
    ) public {
        require(
            isApprovedOrOwner(_sender(), _tokenId) ||
                globalOperators[_sender()],
            'only the owner of the token or a global operator can set the token data'
        );
        tokenData[_tokenId][_key] = _data;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     * @notice this is used by opensea/polyscan to detect our ERC721
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
        @notice blanceOf returns the number of tokens an address currently holds.
     */
    function balanceOf(address _owner) public view override returns (uint256) {
        return balance[_owner];
    }

    /**
        @notice Returns the owner of a current token
        @dev will Throw if the token does not exist
     */
    function ownerOf(
        uint256 _tokenId
    ) public view virtual override returns (address) {
        require(exists(_tokenId), 'invalid tokenId');
        return tokens[_tokenId];
    }

    /**
        @notice Will approve an operator for the senders tokens
    */
    function setApprovalForAll(
        address _operator,
        bool _approved
    ) public override {
        operators[_sender()][_operator] = _approved;
        emit ApprovalForAll(_sender(), _operator, _approved);
    }

    /**
        @notice Will returns true if the operator is approved by the owner address
    */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public view override returns (bool) {
        return operators[_owner][_operator];
    }

    /**
        @notice Returns the tokens URI Metadata object
    */
    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        return uri[_tokenId];
    }

    /**
        @notice Returns the name of the ERC721  for display on places like Etherscan
    */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
        @notice Returns the symbol of the ERC721 for display on places like Polyscan
    */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
        @notice Returns the approved adress for this token.
    */
    function getApproved(
        uint256 _tokenId
    ) public view override returns (address) {
        return approvedTokens[_tokenId];
    }

    /**
        @notice Sets an approved adress for this token
        @dev will Throw if tokenId does not exist
    */
    function approve(address _to, uint256 _tokenId) public override {
        address owner = IM1.ownerOf(_tokenId);

        require(_to != owner, 'cannot approve owner');
        require(
            _sender() == owner || isApprovedForAll(owner, _sender()),
            'ERC721: approve caller is not token owner or approved for all'
        );
        approvedTokens[_tokenId] = _to;
        emit Approval(owner, _to, _tokenId);
    }

    /**
        @notice Mints a token.
        @dev If you are transfering a token to a contract the contract will make sure that it can recieved the ERC721 (implements a IERC721Receiver) if it does not it will revert the transcation. Emits a {Transfer} event.
    */
    function mint(address _to, uint256 _tokenId, bytes memory _data) internal {
        require(_to != address(0x0), '0x0 mint');
        require(!exists(_tokenId), 'already minted');

        balance[_to] += 1;
        tokens[_tokenId] = _to;

        emit Transfer(address(0x0), _to, _tokenId);

        //check that the ERC721 has been received
        require(
            checkERC721Received(_sender(), address(this), _to, _tokenId, _data)
        );
    }

    /**
        @notice Returns true if a token exists.
     */
    function exists(uint256 _tokenId) public view returns (bool) {
        return tokens[_tokenId] != address(0x0);
    }

    /// @notice Is ran before every transfer, overwrite this function with your own logic
    /// @dev Must return true else will revert
    function beforeTransfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal virtual {}

    /**
        @notice Transfers a token fsrom one address to another. Use safeTransferFrom as that will double check that the address you send this token too is a contract that can actually receive it.
		@dev Emits a {Transfer} event.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        require(
            isApprovedOrOwner(_sender(), _tokenId),
            'not approved or owner'
        );
        require(_from != address(0x0), 'sending to null address');

        //before the transfer
        beforeTransfer(_from, _to, _tokenId);

        delete approvedTokens[_tokenId];
        balance[_from] -= 1;
        balance[_to] += 1;
        tokens[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    /// @notice will returns true if the address is apprroved for all, approved operator or is the owner of a token
    /// @dev same as open zepps
    function isApprovedOrOwner(
        address addr,
        uint256 tokenId
    ) public view returns (bool) {
        address owner = IM1.ownerOf(tokenId);
        return (addr == owner ||
            isApprovedForAll(owner, addr) ||
            getApproved(tokenId) == addr);
    }

    /**
        @notice Just like transferFrom except we will check if the to address is a contract and is an IERC721Receiver implementer
		@dev Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public virtual override {
        _safeTransferFrom(_from, _to, _tokenId, _data);
    }

    /**
        @notice Just like the method above except with no data field we pass to the implemeting contract.
		@dev Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        _safeTransferFrom(_from, _to, _tokenId, '');
    }

    /**
        @notice Internal method to transfer the token and require that checkERC721Recieved is equal to true.
     */
    function _safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) private {
        transferFrom(_from, _to, _tokenId);
        //check that it implements an IERC721 receiver if it is a contract
        require(
            checkERC721Received(_sender(), _from, _to, _tokenId, _data),
            'ERC721 Receiver Confirmation Is Bad'
        );
    }

    /**
        @notice Checks first if the to address is a contract, if it is it will confirm that the contract is an ERC721 implentor by confirming the selector returned as documented in the ERC721 standard. If the to address isnt a contract it will just return true. Based on the code inside of OpenZeppelins ERC721
     */
    function checkERC721Received(
        address _operator,
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (!isContract(_to)) return true;

        try
            IERC721Receiver(_to).onERC721Received(
                _operator,
                _from,
                _tokenId,
                _data
            )
        returns (bytes4 confirmation) {
            return (confirmation == IERC721Receiver.onERC721Received.selector);
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert('This contract does not implement an IERC721Receiver');
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }

    ///@notice secures msg.sender so it cannot be changed
    function _sender() internal view returns (address) {
        return (msg.sender);
    }

    ///@notice secures msg.value so it cannot be changed
    function _value() internal view returns (uint256) {
        return (msg.value);
    }

    ///@notice Returns true if the address is a contract
    ///@dev Sometimes doesnt work and contracts might be disgused as addresses
    function isContract(address _address) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_address)
        }
        return size > 0;
    }
}
