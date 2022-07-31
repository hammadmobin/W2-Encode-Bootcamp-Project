// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Token Contract
/// @author Matheus Pagani
/// @notice You can use this contract for Token Creation
/// @dev All function calls are currently implemented without side effects
contract MyToken is ERC20, AccessControl, ERC20Permit, ERC20Votes {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Used to mint the token
    /// @param amount Generally this parameter used to initialize how much amount of token need
    /// @param to Address in which token should be mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.
 
    /// @notice Used to transfer the token from one address to the another address and override function from ERC20
    /// @param amount Generally this parameter used to initialize how much amount of token need
    /// @param from Address in where token should be transfer
    /// @param to Address in which token should be transfer
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    /// @notice Used to mint the token and override function from ERC20
    /// @param amount Generally this parameter used to initialize how much amount of token need
    /// @param to Address in which token should be mint
    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    /// @notice In the burn functionality its burns tokens
    /// @param amount In the account where token need to burn
    /// @param account Generally this parameter used the amount to need to burn the token
    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}