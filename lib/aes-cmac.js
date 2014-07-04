var crypto = require('crypto');
var bufferTools = require('./buffer-tools.js');

var const_Zero = new Buffer('00000000000000000000000000000000', 'hex');
var const_Rb = new Buffer('00000000000000000000000000000087', 'hex');
var const_blockSize = 16;

exports.generateSubkeys = function (key) {
  var l = aes128(key, const_Zero);
  var subkey1, subkey2;

  if (l[0] & 0x80) {
    subkey1 = bufferTools.xor(bufferTools.bitShiftLeft(l), const_Rb);
  } else {
    subkey1 = bufferTools.bitShiftLeft(l);
  }

  if (subkey1[0] & 0x80) {
    subkey2 = bufferTools.xor(bufferTools.bitShiftLeft(subkey1), const_Rb);
  } else {
    subkey2 = bufferTools.bitShiftLeft(subkey1);
  }

  return {
    subkey1: subkey1,
    subkey2: subkey2
  }
};

function aes128(key, message) {
  var cipher = crypto.createCipheriv('aes128', key, const_Zero)
  var result = cipher.update(message);
  cipher.final();
  return result;
}

exports.aesCmac = function (key, message) {
  var subkeys = exports.generateSubkeys(key);
  var blockCount = Math.ceil(message.length / const_blockSize);
  var lastBlockCompleteFlag, lastBlock;

  if (blockCount === 0) {
    blockCount = 1;
    lastBlockCompleteFlag = false
  } else {
    lastBlockCompleteFlag = (message.length % const_blockSize === 0);
  }

  if (lastBlockCompleteFlag) {
    lastBlock = bufferTools.xor(getMessageBlock(message, blockCount), subkeys.subkey1);
  } else {
    lastBlock = bufferTools.xor(getMessageBlock(message, blockCount), subkeys.subkey2);
  }

  var x = new Buffer('00000000000000000000000000000000', 'hex');
  var y;

  for (var index = 1; index < blockCount; index++) {
    y = bufferTools.xor(x, getMessageBlock(message, index));
    x = aes128(key, y);
  }
  y = bufferTools.xor(lastBlock, x);
  return aes128(key, y);
};

function getMessageBlock(message, blockIndex) {
  var block = new Buffer(const_blockSize);
  block.fill(0);
  var start = (blockIndex - 1) * const_blockSize;
  var end = start + const_blockSize;
  var needsPadding = false;

  if (message.length < end) {
    needsPadding = true;
    end = message.length;
  }

  message.copy(block, 0, start, end);

  if (needsPadding) {
    var next = end - start;
    block[next] = 0x80;
  }

  return block;
}
