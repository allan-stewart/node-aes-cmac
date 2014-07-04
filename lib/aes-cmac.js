var crypto = require('crypto');
var bufferTools = require('./buffer-tools.js');

var const_Zero = new Buffer('00000000000000000000000000000000', 'hex');
var const_Rb = new Buffer('00000000000000000000000000000087', 'hex');

exports.generateSubkeys = function (key) {
  var aes128 = crypto.createCipheriv('aes128', key, const_Zero);
  var l = aes128.update(const_Zero);
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
