function bitShiftLeft(buffer) {
	const shifted = Buffer.alloc(buffer.length);
	const last = buffer.length - 1;

	for (let index = 0; index < last; index++) {
		let value = buffer[index] << 1;

		if (buffer[index + 1] & 0x80) {
			value += 0x01;
		}

		shifted[index] = value;
	}

	shifted[last] = buffer[last] << 1;

	return shifted;
}

function xor(bufferA, bufferB) {
	const length = Math.min(bufferA.length, bufferB.length);
	const output = Buffer.alloc(length);

	for (let index = 0; index < length; index++) {
		const value = bufferA[index] ^ bufferB[index];
		output[index] = value;
	}

	return output;
}


module.exports = {
	bitShiftLeft,
	xor
};