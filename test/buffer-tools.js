var bufferTools = require('../lib/buffer-tools.js');
var assert = require('assert');

describe('buffer-tools', function () {
  describe('bitShiftLeft', function () {
    function testBitShiftLeft(input) {
      return bufferTools.bitShiftLeft(new Buffer(input, 'hex')).toString('hex');
    }

    it('returns a buffer bitshifted left 1 bit (buffer_value << 1)', function () {
      assert.equal(testBitShiftLeft('01'), '02');
      assert.equal(testBitShiftLeft('02'), '04');
      assert.equal(testBitShiftLeft('04'), '08');
      assert.equal(testBitShiftLeft('08'), '10');
      assert.equal(testBitShiftLeft('10'), '20');
      assert.equal(testBitShiftLeft('20'), '40');
      assert.equal(testBitShiftLeft('40'), '80');
      assert.equal(testBitShiftLeft('80'), '00');
      assert.equal(testBitShiftLeft('55cc33'), 'ab9866');
    });
  });

  describe('xor', function () {
    function testXor(a, b) {
      return bufferTools.xor(new Buffer(a, 'hex'), new Buffer(b, 'hex')).toString('hex');
    };

    it('returns the logical XOR of two buffers', function () {
      assert.equal(testXor('5a', 'a5'), 'ff');
      assert.equal(testXor('5a', '5a'), '00');
      assert.equal(testXor('5a', 'ff'), 'a5');
      assert.equal(testXor('5a', '00'), '5a');
      assert.equal(testXor('5a', 'c3'), '99');
      assert.equal(testXor('5a', '99'), 'c3');
      assert.equal(testXor('abcd', '0123'), 'aaee');
      assert.equal(testXor('123456', '789abc'), '6aaeea');
    });
  });

  describe('toBinaryString', function () {
    function testToBinaryString(input) {
      return bufferTools.toBinaryString(new Buffer(input, 'hex'));
    }

    it('returns the binary string representation of a buffer', function () {
      assert.equal(testToBinaryString('0f'), '00001111');
      assert.equal(testToBinaryString('5ac3'), '0101101011000011');
      assert.equal(testToBinaryString('deadbeef'), '11011110101011011011111011101111');
    });
  });
});
