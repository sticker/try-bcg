// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract First {
  uint public counter;

  function plus(uint num) public {
    counter += num;
  }

  function reset() public {
    counter = 0;
  }
}
