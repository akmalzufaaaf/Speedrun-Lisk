// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Spacebear is ERC721, ERC721URIStorage, Ownable {

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
    function safeMint(address to, string memory uri) 
    public 
    onlyOwner
    returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function buyToken() public payable {
        uint256 tokenId = _nextTokenId++;
        require(msg.value == tokenId * 0.1 ether, "Not enough funds sent");
        _safeMint(msg.sender, tokenId);
    }

    // override function needed in solidity,
    // because 2 function from imported library 
    // have same name
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
    public 
    view 
    override(ERC721, ERC721URIStorage)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}