const Spacebear = artifacts.require("SpaceBear");
const truffleAssert = require('truffle-assertions');

contract("Spacebear", (accounts) => {
    it("should credit an NFT to specific account", async() => {
        const spacebear = await Spacebear.deployed();
        let txResult = await spacebear.safeMint(accounts[1], 'spacebear_1.json');
        console.log(accounts)
        
        truffleAssert.eventEmitted(txResult, 'Transfer', {from: '0x0000000000000000000000000000000000000000', to: accounts[1], tokenId: web3.utils.toBN("0")})

        assert.equal(await spacebear.ownerOf(0), accounts[1], "Owner of Token is wrong address")
    })
})