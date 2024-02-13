const bitcoin = require('bitcoinjs-lib');
const { testnet } = require('bitcoinjs-lib/src/networks');
const buff = require('buffer').Buffer; // Corrected import statement

// Given a preimage 'Learn Bitcoin', encode it in bytes
const preImageString = 'Learn Bitcoin';
const preimageBytes = buff.from(preImageString, 'utf8');

// Hash the preimage using SHA256
const hashedPreimage = bitcoin.crypto.sha256(preimageBytes);

// Ensure the hashed preimage is 20 bytes (160 bits)
if (hashedPreimage.length > 20) {
  // Truncate the hash to 20 bytes
  const truncatedHashedPreimage = hashedPreimage.slice(0, 20);
  // Reverse the byte order (little-endian)
  const reversedHashedPreimage = buff.from(truncatedHashedPreimage.reverse());


  // Create the redeem script: OP_PUSHDATA <reversedHashedPreimage>
  const redeemScript = buff.concat([
    buff.from('a8', 'hex'), // OP_HASH160
    buff.from('14', 'hex'), // Push 20 bytes
    reversedHashedPreimage,
    buff.from('87', 'hex') // OP_EQUAL
  ]);

  // Derive a P2SH address from the redeem script
  const p2shAddress = bitcoin.payments.p2sh({ redeem: { output: redeemScript } }).address;
  console.log(`P2SH Address: ${p2shAddress}`);
} else {
  // If already 20 bytes, proceed without truncation
  const reversedHashedPreimage = buff.from(hashedPreimage.reverse());
  const encodedPreimage = bitcoin.address.toBase58Check(reversedHashedPreimage, 0x6F);

  // Generate a redeem script from the encoded preimage
  const redeemScript = buff.concat([
    buff.from('a8', 'hex'),
    reversedHashedPreimage, // Use the reversed hash directly
    buff.from('87', 'hex')
  ]);

  // Derive a P2SH address from the redeem script
  const p2shAddress = bitcoin.payments.p2sh({ redeem: { output: redeemScript } }).address;
  console.log(`P2SH Address: ${p2shAddress}`);
}

// //Create a transaction that sends bitcoins to the address generated above

// const txBuilder = new bitcoin.TransactionBuilder(testnet);
// txBuilder.addOutput(p2shAddress);
// txBuilder.addInput(prevTxId, vout);

