//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import necessary contracts
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @notice Simple escrowless NFT marketplace for MyNFT contract
 * @dev Sellers keep NFTs until sold, marketplace only needs approval
 */
contract NFTMarketplace is ReentrancyGuard {
    // Struct to store listing information
    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }
    
    // MyNFT contract address
    IERC721 public nftContract;
    
    // Mapping to store listings
    mapping(uint256 => Listing) public listings;
    
    // Events
    event ItemListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ItemCancelled(uint256 indexed tokenId, address indexed seller);
    
    // Constructor
    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }
    
    /**
         * @notice List an NFT for sale
         * @param tokenId The ID of the NFT to list
         * @param price The price in wei (ETH)
         */
    function listItem(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than 0");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)), 
            "Marketplace not approved");
        require(!listings[tokenId].isActive == true, "Token already listed");
        
        listings[tokenId] = Listing({
            seller : msg.sender,
            price : price,
            isActive : true
        });
        
        emit ItemListed(tokenId, msg.sender, price);
    }
    
    /**
        * @notice Buy a listed NFT
        * @param tokenId The ID of the NFT to buy
        */
    function buyItem(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        
        require(listing.isActive, "Item not listed");
        require(msg.value >= listing.price, "Insufficient funds");
        require(nftContract.ownerOf(tokenId) == listing.seller, "Seller is no longer owns NFT");
        
        // Check - Effect - Interaction
        listing.isActive = false; // Effect
        
        // interaction
        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);
        
        // transfer funds to seller
        (bool success, ) = payable(listing.seller).call{value: listing.price}("");
        require(success, "Transfer failed");
        
        // refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit ItemSold(tokenId, msg.sender, listing.seller, listing.price);
    }
    
    /**
         * @notice Cancel a listing
         * @param tokenId The ID of the NFT to cancel
         */
    function cancelListing(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        
        require(listing.isActive, "Item not listed.");
        require(listing.seller == msg.sender, "Only seller can cancel listing");
        
        listing.isActive = false;
        
        emit ItemCancelled(tokenId, listing.seller);
    }
    
    /**
         * @notice Get listing information
         * @param tokenId The ID of the NFT
         * @return listing The listing struct
         */
    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
    
    /**
         * @notice Check if an NFT is listed
         * @param tokenId The ID of the NFT
         * @return bool True if listed and active
         */
    function isListed(uint256 tokenId) external view returns (bool) {
        return listings[tokenId].isActive;
    }
}
    
    