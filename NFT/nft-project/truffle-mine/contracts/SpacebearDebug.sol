// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "@ganache/console.log/console.sol";

contract SpacebearDebug is ERC721, Ownable {

    uint256 private _nextTokenId;

    constructor(address initial_owner)
    ERC721("SpaceBear", "SBR") 
    Ownable(initial_owner)
    {}

    // _baseURI => to save base uri
    function _baseURI() internal pure override returns (string memory) {
        return "https://blabla.com/nft/";
    }

    // safeMint(address to, string memory uri)
    function safeMint(address to) 
    public 
    onlyOwner
    returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function buyToken() public payable {
        uint256 tokenId = _nextTokenId;
        console.log("Got here", tokenId, msg.value);
        require(msg.value == (tokenId + 1) * 0.1 ether, "Wrong amount of funds sent.");

        _nextTokenId += 1;
        console.log("Got here", tokenId, _nextTokenId, msg.value);
        _safeMint(msg.sender, tokenId);
    }

    // override function needed in solidity,
    // because 2 function from imported library 
    // have same name
    function tokenURI(uint256 tokenId)
    public
    pure
    override(ERC721)
    returns (string memory)
    {
        return string(abi.encodePacked(_baseURI(), "spacebear_", (tokenId + 1), ".json"));
    }

    function supportsInterface(bytes4 interfaceId) 
    public 
    view 
    override(ERC721)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}