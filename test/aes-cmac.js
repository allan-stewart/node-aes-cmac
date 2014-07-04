var aesCmac = require('../lib/aes-cmac.js');
var assert = require('assert');

describe('aes-cmac', function () {
  describe('RFC4493 test vectors', function () {
    describe('generateSubkeys(key)', function () {
      it('creates the correct subkeys', function () {
        var key = new Buffer('2b7e151628aed2a6abf7158809cf4f3c', 'hex');
        var expected = {
          subkey1: new Buffer('fbeed618357133667c85e08f7236a8de', 'hex'),
          subkey2: new Buffer('f7ddac306ae266ccf90bc11ee46d513b', 'hex')
        };

        var result = aesCmac.generateSubkeys(key);
        assert.equal(result.subkey1.toString('hex'), 'fbeed618357133667c85e08f7236a8de');
        assert.deepEqual(result, expected);
      });
    });
  });
});
