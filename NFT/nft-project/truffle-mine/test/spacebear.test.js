const Spacebears = artifacts.require("Spacebear");
const truffleAssert = require("truffle-assertions");

contract("Spacebears", (accounts) => {
    let spacebearInstance;

    beforeEach(async () => {
        // Kontrak di-deploy ulang sebelum setiap tes
        spacebearInstance = await Spacebears.new(accounts[0]);
    });

    it("should credit an NFT to specific address", async () => {
        await spacebearInstance.safeMint(accounts[1], "spacebear_1.json");
        assert.equal(await spacebearInstance.ownerOf(0), accounts[1], "Owner of the token is wrong address");
    });
    it("should credit an NFT to specitif address (using truffleAssert", async () => {
        let txResult = await spacebearInstance.safeMint(accounts[1], "spacebear_1.json");
        truffleAssert.eventEmitted(txResult, "Transfer", {from: '0x0000000000000000000000000000000000000000', to: accounts[1], tokenId: web3.utils.toBN(0)});
    })
})