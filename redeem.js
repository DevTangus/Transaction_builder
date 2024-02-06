// Generating the redeem script function

function redeemScriptGenerator(btrustBuilders){

const btImageBytes = Buffer.from(btrustBuilders,'hex');
const sha256Hash = bitcoin.crypto.sha256(btImageBytes);
const redeemScriptHex = bitcoin.script.compile([
bitcoin.opcodes.OP_SHA256,
sha256Hash,
bitcoin.opcodes.OP_EQUAL
]).toString('hex');
return redeemScriptHex;
}

//Deriving  an address from the redeem script function

function deriveAddress(redeemScriptHex){
const  script = bitcoin.script.compile(Buffer.from(redeemScriptHex,'hex'));
const scriptHash = bitcoin.crypto.hash160(script);
const address = bitcoin.payments.p2sh({hash:scriptHash});
address.address;
}

//Constructing a Tx sending bitcoin to the derived address

/**
 * Constructs a transaction to send bitcoins to a specified address.
 * @param {string} recipientAddress The address of the recipient.
 * @param {number} amount The amount of bitcoins to send.
 * @param {string} privateKey The private key of the sender.
 * @param {string} network The network to use (e.g., 'testnet' or 'mainnet').
 * @returns {string} The constructed transaction hex.
 */
function constructTxToSendBitcoins(recipientAddress, amount, privateKey, network) {
const pulicKey =redeemScriptHex;
const recipientAddress = derivedAddress(publicKey);
const amount = 0.5;
// Generate a new random private key
const keyPair = bitcoin.ECPair.makeRandom();
const privateKey = keyPair.toWIF();  
const network = 'testnet'; 
const transactionHex = constructTxToSendBitcoins(recipientAddress, amount, privateKey, network);
}

console-log('Transaction Hex:', transactionHex);

// Constructing a transaction spending from the previous transaction above.
function constructTxSpendingFromPreviousTx(transactionHex,recipientAddress, amountToSend,privateKey,network){
//Decode  the previus transaction hex

const prevTx = bitcoin.Transaction.fromHex(transactionHex);
//Determine  which output to spend and create the corresponding input
const prevOutputIndex = 0;
const txIn = {
hash: prevTx.getId(),
index: prevOutputIndex,
script: bitcoin.script.empty(),
};

//Define the recipient output
const txOut = bitcoin.script.compile([
        bitcoin.opcodes.OP_DUP,
        bitcoin.opcodes.OP_HASH160,
        Buffer.from(recipientAddress.hashBuffer, 'hex'), 
        bitcoin.opcodes.OP_EQUALVERIFY,
        bitcoin.opcodes.OP_CHECKSIG,
    ]);
// Create the transaction
    const tx = new bitcoin.TransactionBuilder(network);

    // Add the input and output to the transaction
    tx.addInput(txIn.hash, txIn.index);
    tx.addOutput(txOut, amountToSend);

    // Sign the transaction
    const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
    tx.sign(0, keyPair, undefined, bitcoin.Transaction.SIGHASH_ALL);

    // Build the transaction
    const txBuilt = tx.build();

    // Serialize the transaction
    const txHex = txBuilt.toHex();

    return txHex;
}

const constructedTxHex = constructTxSpendingFromPreviousTx(transactionHex, recipientAddress, amountToSend, privateKey, network);
console.log('Constructed Transaction Hex:', constructedTxHex);
}

