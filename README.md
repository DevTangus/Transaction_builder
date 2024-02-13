Transaction Builder Exercise
This repository contains a solution to the Transaction Builder Exercise. The exercise involves

generating a redeem script
Deriving an address
Constructing Bitcoin transactions programmatically.
Questions
Given the string "Btrust Builders", whose bytes encoding is 427472757374204275696c64657273, write a script/program that does the following:

Generate the redeem script in hex format for the given pre-image. Note: redeem_script => OP_SHA256 <lock_hex> OP_EQUAL.
Derive an address with from the above (1) redeem script
Construct a transaction that send Bitcoins to the address. Note: The creation of the transaction should not be done with bitcoin-cli. You should write a transaction builder script that constructs it.
Construct another transaction that spends from the above (3) transaction given that you have both locking and unlock scripts. If creating two outputs (main and change outputs), avoid address reuse.
write test that validates all your functions. Note: each task in this section should be a separate function (and even better that the functions have unit tests).
