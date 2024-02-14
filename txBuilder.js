

const bitcoin = require('bitcoinjs-lib');
const { testnet } = require('bitcoinjs-lib/src/networks');
const buff = require('buffer').Buffer;
const ECPairFactory = require('ecpair');
const ecc = require('tiny-secp256k1');

// Create an ECPair using the tiny-secp256k1 library
const ECPair = ECPairFactory.ECPairFactory(ecc);

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

  // Generate a new random private key
  const keyPair = ECPair.makeRandom({ network: bitcoin.networks.testnet });

  // Get the private key in hexadecimal format
  const privateKeyHex = keyPair.privateKey.toString('hex');

  // Derive the public key from the private key
  const publicKey = keyPair.publicKey;

  console.log('Private Key (hex):', privateKeyHex);
  console.log('Public Key (hex):', publicKey.toString('hex'));
} else {
  console.error('Error: Hashed preimage is not 20 bytes.');
}
// UTXO details 
const prevHash = '06c53950b25f89adb9b7395c17cbcdac13aebeff98d7dff431e26bb905357226';
const outputIndex = 0;
const outputValue = 3974145949;

// Recipient addresses
const recipientAddress1 = '35cB7UGskXDnMpCdAp7wofUkDSLAUMtKHD'; // P2SH address
const recipientAddress2 = '2NAdnTLBuizxj9EGuLVPeTLuMS5ukWpTyz8';

// Private key in hexadecimal format
const privateKeyHex = '1fa6f5c78088415dfb86b5b79531bd72197bc28437fde2b4203f9aceaf089cdb';

// Create an ECPair from the private key
const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'), { network: bitcoin.networks.testnet });

// Display the private key in Wallet Import Format (WIF)
console.log('Private Key Pair (WIF):', keyPair.toWIF());
// Create the transaction builder
const txb = new bitcoin.TransactionBuilder(testnet);

// Add the input (UTXO)
txb.addInput(prevHash, outputIndex);

// Add the first output (recipient address 1)
txb.addOutput(recipientAddress1, outputValue - 39741459); // Deduct the 1% fee

// Add the second output (recipient address 2)
txb.addOutput(recipientAddress2, 62841);

// Sign the transaction
txb.sign(0, keyPair);

// Build the transaction
const tx = txb.build();

// Serialize the transaction
const txHex = tx.toHex();

console.log('Raw Transaction:');
console.log(txHex);