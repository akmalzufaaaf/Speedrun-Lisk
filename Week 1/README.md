# Speedrun-Lisk - Week 1

This repository contains the projects and challenges for Week 1 of the Speedrun-Lisk program.

## Chapter 1: Deploy and Verify

This chapter focuses on deploying and verifying smart contracts on the Lisk Sepolia testnet.

### Project Structure

The project is a monorepo containing two main packages:

-   `packages/hardhat`: Contains the smart contracts, deployment scripts, and tests.
-   `packages/nextjs`: A Next.js frontend to interact with the deployed contracts.

### Smart Contracts

The `hardhat` package includes the following contracts:

-   `BuyMeACoffee.sol`: A contract that allows users to send "coffee" tips.
-   `MyNFT.sol`: A simple NFT contract.
-   `MyToken.sol`: A basic ERC20 token.
-   `VNDToken.sol`: An ERC20 token named "VNDToken".
-   `YourContract.sol`: A starter contract for you to build upon.

### Getting Started

#### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Yarn](https://yarnpkg.com/)

#### 1. Hardhat Backend

To get started with the smart contracts:

1.  Navigate to the project directory:
    ```bash
    cd "Week 1/ch1-deploy-verify"
    ```

2.  Install dependencies:
    ```bash
    yarn install
    ```

3.  Compile the contracts:
    ```bash
    yarn compile
    ```

4.  Run the tests:
    ```bash
    yarn test
    ```

5.  Deploy the contracts to Lisk Sepolia:
    ```bash
    yarn deploy --network liskSepolia
    ```

#### 2. Next.js Frontend

To run the frontend application:

1.  Navigate to the project directory (if you are not already there):
    ```bash
    cd "Week 1/ch1-deploy-verify"
    ```

2.  Install dependencies (if you haven't already):
    ```bash
    yarn install
    ```

3.  Start the development server:
    ```bash
    yarn start
    ```

4.  Open your browser and navigate to `http://localhost:3000`.

## Deployed Contracts

In this first challenge, we only deployed and verified the `MyToken` and `MyNFT` contracts.

-   **MyToken:**
    -   Address: `0x8420EdeF3431C73bb4704626C05190Df6D73D5A9`
    -   Verified Link: [https://sepolia-blockscout.lisk.com/address/0x8420EdeF3431C73bb4704626C05190Df6D73D5A9#code](https://sepolia-blockscout.lisk.com/address/0x8420EdeF3431C73bb4704626C05190Df6D73D5A9#code)

-   **MyNFT:**
    -   Address: `0xDBE0d21fd70fC18955bF4789D1553a8598F20c50`
    -   Verified Link: [https://sepolia-blockscout.lisk.com/address/0xDBE0d21fd70fC18955bF4789D1553a8598F20c50#code](https://sepolia-blockscout.lisk.com/address/0xDBE0d21fd70fC18955bF4789D1553a8598F20c50#code)
