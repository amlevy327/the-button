// SPDX-License-Identifier: GPL-3.0

/// @title The Pog ERC-721 token

pragma solidity ^0.8.6;

contract Claim {
  
  uint256 depositAmount; // in eth
  uint256 blocksToPass = 3;

  address lastDepositAddress;
  uint256 lastDepositTimestamp;

  event ButtonPressed(address lastDepositAddress, uint256 lastDepositTimestamp, uint256 currentDepositTotal);
  event TreasureClaimed(address winner, uint256 amount);

  constructor(uint256 _depositAmount) {
    depositAmount = _depositAmount;
  }

  function press_button() public payable {
    // check msg.value
    require(msg.value == depositAmount, 'Deposit amount incorrect');
    // update all vars
    lastDepositAddress = msg.sender;
    lastDepositTimestamp = block.timestamp;
    // emit event
    emit ButtonPressed(lastDepositAddress, lastDepositTimestamp, address(this).balance);
  }

  function claim_treasure() public {
    // check last timestamp
    require(lastDepositTimestamp !=0, 'No deposits yet');
    // check blocks passed
    require(block.timestamp > lastDepositTimestamp + 3, '3 blocks have not passed');
    // check sender
    require(msg.sender == lastDepositAddress, 'Sender not last deposit address');

    // current balance
    uint256 currentBalance = address(this).balance;

    // make transfer
    payable(msg.sender).transfer(address(this).balance);
    // reset variables
    reset_vars();
    emit TreasureClaimed(msg.sender, currentBalance);
  }

  function reset_vars() internal {
    lastDepositAddress = address(0);
    lastDepositTimestamp = 0;
  }
}