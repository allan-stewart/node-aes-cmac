var aesCmac = require('../lib/aes-cmac.js');
var assert = require('assert');

describe('aes-cmac', function () {
  describe('NIST 800-38B test vectors', function () {
    var keys = {
      '128': new Buffer('2b7e151628aed2a6abf7158809cf4f3c', 'hex'),
      '192': new Buffer('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b', 'hex'),
      '256': new Buffer('603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4', 'hex'),
    };

    describe('generateSubkeys(key)', function () {
      it('creates the correct subkeys for a 128 bit key', function () {
        var expected = {
          subkey1: new Buffer('fbeed618357133667c85e08f7236a8de', 'hex'),
          subkey2: new Buffer('f7ddac306ae266ccf90bc11ee46d513b', 'hex')
        };

        var result = aesCmac.generateSubkeys(keys['128']);
        assert.deepEqual(result, expected);
      });

      it('creates the correct subkeys for a 192 bit key', function () {
        var expected = {
          subkey1: new Buffer('448a5b1c93514b273ee6439dd4daa296', 'hex'),
          subkey2: new Buffer('8914b63926a2964e7dcc873ba9b5452c', 'hex')
        };
        var result = aesCmac.generateSubkeys(keys['192']);
        assert.deepEqual(result, expected);
      });

      it('creates the correct subkeys for a 256 bit key', function () {
        var expected = {
          subkey1: new Buffer('cad1ed03299eedac2e9a99808621502f', 'hex'),
          subkey2: new Buffer('95a3da06533ddb585d3533010c42a0d9', 'hex')
        };
        var result = aesCmac.generateSubkeys(keys['256']);
        assert.deepEqual(result, expected);
      });
    });

    describe('aesCmac(key, message)', function () {
      var messages = {
        length0: new Buffer('', 'hex'),
        length128: new Buffer('6bc1bee22e409f96e93d7e117393172a', 'hex'),
        length320: new Buffer('6bc1bee22e409f96e93d7e117393172aae2d8a57' +
                              '1e03ac9c9eb76fac45af8e5130c81c46a35ce411', 'hex'),
        length512: new Buffer('6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51' +
                              '30c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710', 'hex')
      };

      it('generates the authentiation code for length 0 input, 128 bit key', function () {
        var result = aesCmac.aesCmac(keys['128'], messages.length0);
        assert.equal(result.toString('hex'), 'bb1d6929e95937287fa37d129b756746');
      });

      it('generates the authentiation code for length 0 input, 192 bit key', function () {
        var result = aesCmac.aesCmac(keys['192'], messages.length0);
        assert.equal(result.toString('hex'), 'd17ddf46adaacde531cac483de7a9367');
      });

      it('generates the authentiation code for length 0 input, 256 bit key', function () {
        var result = aesCmac.aesCmac(keys['256'], messages.length0);
        assert.equal(result.toString('hex'), '028962f61b7bf89efc6b551f4667d983');
      });

      it('generates the authentication code for length 128 input, 128 bit key', function () {
        var result = aesCmac.aesCmac(keys['128'], messages.length128);
        assert.equal(result.toString('hex'), '070a16b46b4d4144f79bdd9dd04a287c');
      });

      it('generates the authentication code for length 128 input, 192 bit key', function () {
        var result = aesCmac.aesCmac(keys['192'], messages.length128);
        assert.equal(result.toString('hex'), '9e99a7bf31e710900662f65e617c5184');
      });

      it('generates the authentication code for length 128 input, 256 bit key', function () {
        var result = aesCmac.aesCmac(keys['256'], messages.length128);
        assert.equal(result.toString('hex'), '28a7023f452e8f82bd4bf28d8c37c35c');
      });

      it('generates the authentication code for length 320 input, 128 bit key', function () {
        var result = aesCmac.aesCmac(keys['128'], messages.length320);
        assert.equal(result.toString('hex'), 'dfa66747de9ae63030ca32611497c827');
      });

      it('generates the authentication code for length 320 input, 192 bit key', function () {
        var result = aesCmac.aesCmac(keys['192'], messages.length320);
        assert.equal(result.toString('hex'), '8a1de5be2eb31aad089a82e6ee908b0e');
      });

      it('generates the authentication code for length 320 input, 256 bit key', function () {
        var result = aesCmac.aesCmac(keys['256'], messages.length320);
        assert.equal(result.toString('hex'), 'aaf3d8f1de5640c232f5b169b9c911e6');
      });

      it('generates the authentication code for length 512 input, 128 bit key', function () {
        var result = aesCmac.aesCmac(keys['128'], messages.length512);
        assert.equal(result.toString('hex'), '51f0bebf7e3b9d92fc49741779363cfe');
      });

      it('generates the authentication code for length 512 input, 192 bit key', function () {
        var result = aesCmac.aesCmac(keys['192'], messages.length512);
        assert.equal(result.toString('hex'), 'a1d5df0eed790f794d77589659f39a11');
      });

      it('generates the authentication code for length 512 input, 256 bit key', function () {
        var result = aesCmac.aesCmac(keys['256'], messages.length512);
        assert.equal(result.toString('hex'), 'e1992190549f6ed5696a2c056c315410');
      });
    });
  });

  describe('error handling', function () {
    it('throws an error if the provided key is not a valid length', function () {
      var key = new Buffer('abcd');
      var message = new Buffer('some message');
      assert.throws(function () {
          aesCmac.aesCmac(key, message);
        },
        function (error) {
          assert.equal(error.message, 'Keys must be 128, 192, or 256 bits in length.');
          return true;
        }
      );
    });
  });
});
