var aesCmac = require('../lib/aes-cmac.js');
var assert = require('assert');

describe('aes-cmac', function () {
  describe('RFC4493 test vectors', function () {
    var key = new Buffer('2b7e151628aed2a6abf7158809cf4f3c', 'hex');

    describe('generateSubkeys(key)', function () {
      it('creates the correct subkeys', function () {
        var expected = {
          subkey1: new Buffer('fbeed618357133667c85e08f7236a8de', 'hex'),
          subkey2: new Buffer('f7ddac306ae266ccf90bc11ee46d513b', 'hex')
        };

        var result = aesCmac.generateSubkeys(key);
        assert.deepEqual(result, expected);
      });
    });

    describe('aesCmac(key, message)', function () {
      it('generates the authentiation code for an empty input (length zero)', function () {
        var result = aesCmac.aesCmac(key, new Buffer('', 'hex'));
        assert.equal(result.toString('hex'), 'bb1d6929e95937287fa37d129b756746');
      });

      it('generates the authentication code for a 16 octet input', function () {
        var result = aesCmac.aesCmac(key, new Buffer('6bc1bee22e409f96e93d7e117393172a', 'hex'));
        assert.equal(result.toString('hex'), '070a16b46b4d4144f79bdd9dd04a287c');
      });

      it('generates the authentication code for a 40 octet input', function () {
        var input = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411';
        var result = aesCmac.aesCmac(key, new Buffer(input, 'hex'));
        assert.equal(result.toString('hex'), 'dfa66747de9ae63030ca32611497c827');
      });

      it('generates the authentication code for a 64 octet input', function () {
        var input = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51' +
                    '30c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710';
        var result = aesCmac.aesCmac(key, new Buffer(input, 'hex'));
        assert.equal(result.toString('hex'), '51f0bebf7e3b9d92fc49741779363cfe');
      });
    });
  });
});
