// Facoin ICO

// Version of compiler
pragma solidity ^0.4.11;

contract facoins_ico {

    // Introducing maximum number of Facoins available for sale
    uint public max_facoins = 1000000;

    // Introducing the USD to Facoins conversion rate
    uint public usd_to_facoins = 1000;

    // Introducing the total number of Facoins have been bought by the investor
    uint public total_facoins_bought = 0;

    // Mapping from the Investor address to its equity in Facoins and USD
    mapping(address => uint) equity_facoins;
    mapping(address => uint) equity_usd;

    // Checking if an Investor can buy Facoins
    modifier can_buy_facoins(uint usd_invested) {
        require (usd_invested * usd_to_facoins + total_facoins_bought <= max_facoins);
        _;
    }
}