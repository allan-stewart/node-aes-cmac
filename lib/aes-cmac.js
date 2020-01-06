const crypto = require('crypto');
const bufferTools = require('./buffer-tools.js');

const zero = Buffer.from('00000000000000000000000000000000', 'hex');
const rb = Buffer.from('00000000000000000000000000000087', 'hex');
const blockSize = 16;

function generateSubkeys(key) {
	const cryptedKey = aes(key, zero);

	let subkey1 = bufferTools.bitShiftLeft(cryptedKey);
	if (cryptedKey[0] & 0x80) {
		subkey1 = bufferTools.xor(subkey1, rb);
	}

	let subkey2 = bufferTools.bitShiftLeft(subkey1);
	if (subkey1[0] & 0x80) {
		subkey2 = bufferTools.xor(subkey2, rb);
	}

	return { subkey1: subkey1, subkey2: subkey2 };
}

function aes(key, message, algo) {
	if (!algo) {
		const keyLengthToCipher = { 16: 'aes-128-cbc', 24: 'aes-192-cbc', 32: 'aes-256-cbc' };
		algo = keyLengthToCipher[key.length];
	}

	const cipher = crypto.createCipheriv(algo, key, zero);
	const result = cipher.update(message);
	cipher.final();
	return result;
}

function aesCmac(key, message, algo) {
	const { subkey1, subkey2 } = generateSubkeys(key);
	let blockCount = Math.ceil(message.length / blockSize);
	let lastBlockCompleteFlag;
	let lastBlock;

	if (blockCount === 0) {
		blockCount = 1;
		lastBlockCompleteFlag = false;
	} else {
		lastBlockCompleteFlag = (message.length % blockSize === 0);
	}

	const lastBlockIndex = blockCount - 1;

	if (lastBlockCompleteFlag) {
		lastBlock = bufferTools.xor(getMessageBlock(message, lastBlockIndex), subkey1);
	} else {
		lastBlock = bufferTools.xor(getMessageBlock(message, lastBlockIndex), subkey2, true);
	}

	let x = Buffer.from('00000000000000000000000000000000', 'hex');
	let y;

	for (let index = 0; index < lastBlockIndex; index++) {
		y = bufferTools.xor(x, getMessageBlock(message, index));
		x = aes(key, y, algo);
	}

	y = bufferTools.xor(lastBlock, x);

	return aes(key, y, algo);
}

function getMessageBlock(message, blockIndex, padded) {
	const block = Buffer.alloc(blockSize);
	const start = blockIndex * blockSize;
	const end = start + blockSize;
	
	if (padded) {
		block.fill(0);
		message.copy(block, 0, start, end);
		block[end - start] = 0x80;
	} else {
		message.copy(block, 0, start, end);
	}

	return block;
}

module.exports = {
	aesCmac,
	generateSubkeys
};
