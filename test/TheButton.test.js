const { expect } = require('chai');
const { ethers } = require("hardhat")

describe('TheButton contract', () => {
  let TheButton, owner, user1, user2, user3;
  const depositAmount = 1;

  beforeEach(async () => {
    [owner, user1, user2, user3, _] = await ethers.getSigners();

    TheButton = await ethers.getContractFactory('TheButton');
    theButton = await TheButton.deploy(depositAmount);

    
  })

  describe('Deployment', () => {
     // Constuctor - deposit amount
     it('tracks deposit amount', async () => {
      expect(await theButton.connect(owner).depositAmount()).to.equal(depositAmount)
    })
    // Ownable - owner
    it('tracks the owner', async () => {
      expect(await theButton.connect(owner).owner()).to.equal(owner.address)
    })
  })

  describe('Press button', () => {
    describe('Success', () => {
      // press_button - functionality
      it('successful button press', async () => {
        let balance
        balance = await hre.ethers.provider.getBalance(user1.address)
        console.log(balance)

        await theButton.connect(user1).press_button({ value: 1})

        let lastDepositAddress = await theButton.lastDepositAddress()
        expect(lastDepositAddress).to.equal(user1.address)

        let lastDepositTimestamp = await theButton.lastDepositTimestamp()
        //expect(lastDepositTimestamp).to.equal(0)
      })
      //press_button - event "ButtonPressed"
      it('emits a ButtonPressed event ', async () => {
        await expect(theButton.connect(user1).press_button({ value: 1}))
          .to.emit(theButton, 'ButtonPressed')
          .withArgs(
            user1.address,
            0,
            theButton.address
          );
      })
    })

    describe('Failure', () => {
      // wrong deposit amount
      it('reverts if deposit amount is incorrect', async () => {
        await expect(theButton.connect(user1).press_button({ value: 2 })).to.be.revertedWith('Deposit amount incorrect')
      })
    })
  })

  describe('Press button', () => {
    describe('Success', () => {
      // claim_treasure - functionality
      it('successful claims treasure', async () => {
        await theButton.connect(user1).press_button({ value: 1})
        await hre.ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60]);
        await theButton.connect(user1).claim_treasure()
      })
      //claim_treasure - event "TreasureClaimed"
      it('emits a TreasureClaimed event ', async () => {
        await expect(theButton.connect(user1).claim_treasure({ value: 1}))
          .to.emit(theButton, 'TreasureClaimed')
          .withArgs(
            user1.address,
            "1"
          );
      })
    })

    describe('Failure', () => {
      // wrong deposit amount
      it('reverts if no deposits yet', async () => {
        await expect(theButton.connect(user1).claim_treasure()).to.be.revertedWith('No deposits yet')
      })

      // not enough time passed
      it('reverts if not enough time passed', async () => {
        await theButton.connect(user1).press_button({ value: 1})
        //await hre.ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60]);
        await expect(theButton.connect(user1).claim_treasure()).to.be.revertedWith('3 blocks have not passed')
      })

      // not last button presser
      it('reverts if not last button presser', async () => {
        await theButton.connect(user1).press_button({ value: 1})
        await hre.ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60]);
        await expect(theButton.connect(user2).claim_treasure()).to.be.revertedWith('Sender not last deposit address')
      })
    })
  })
})