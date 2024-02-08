// Import the necessary library
const { Buffer } = require('buffer');

// The actual preimage (e.g., "Learn Bitcoinjs")
const preimage = 'Learn Bitcoinjs';

// Encode the preimage into bytes
function encodePreimage(preimage) {
  return Buffer.from(preimage, 'utf8');
}

//Print the encoded preimage in hex format
const encodedBytes = encodePreimage(preimage);
console.log('Encoded Bytes:', encodedBytes.toString('hex')); // Display as hexadecimal