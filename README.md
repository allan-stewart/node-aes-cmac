node-aes-cmac
=============

A pure [Node.js](http://nodejs.org/) implementation of the AES-CMAC algorithm
per [NIST Special Publication 800-38B](http://csrc.nist.gov/publications/nistpubs/800-38B/SP_800-38B.pdf)
and ([RFC 4493](http://tools.ietf.org/html/rfc4493)).
This algorithm creates a cryptographic message authentication code (CMAC)
from a given message using the AES cipher with 128, 192, and 256 bit keys.


## Why?

At work we had a need to run AES-CMAC from Node.js.
A coworker created an implementation which uses a C++ addon which wrapped [Crypto++](http://www.cryptopp.com/),
but unfortunately the module was only known to build correctly on Ubuntu.
OS X support was added through some further hacking, but Windows support was extremely difficult.

Searching the web yielded no alternatives, so I started this project with a goal to
create an AES-CMAC implementation to share with the Node.js community which would be easy to use on
OS X, Windows, and Linux.

Currently the project only uses the built-in cryptographic functions provided by Node.js and avoids using C/C++ addons.
This was a conscious trade-off favoring simplicity over raw performance.


## Installation

    npm install node-aes-cmac


## Usage

The module exposes a single method: `aesCmac(key, message[, options])`

### Arguments

* `key` - (`string` | `Buffer`) the cryptographic key to use for the operation.
    Must be 128, 192, or 256 bits in length.
* `message` - (`string` | `Buffer`) the message.
* `options` - (`object` *optional*) a set of extra options to pass into the method:
    * `returnAsBuffer` - (`boolean`) set to `true` to get the returned CMAC as a Buffer
       instead of a string. Defaults to `false`.

### Return Value

The method normally returns the CMAC as a lowercase hexadecimal `string`.
It can also return a `Buffer` if the `returnAsBuffer` option is set to `true`.

### Example

```javascript
var aesCmac = require('node-aes-cmac').aesCmac;

// Simple example.
var key = 'k3Men*p/2.3j4abB';
var message = 'this|is|a|test|message';
var cmac = aesCmac(key, message);
// cmac will be: '0125c538f8be7c4eea370f992a4ffdcb'

// Example with buffers.
var bufferKey = new Buffer('6b334d656e2a702f322e336a34616242', 'hex');
var bufferMessage = new Buffer('this|is|a|test|message');
var options = {returnAsBuffer: true};
cmac = aesCmac(bufferKey, bufferMessage, options);
// cmac will be a Buffer containing:
// <01 25 c5 38 f8 be 7c 4e ea 37 0f 99 2a 4f fd cb>
```


## License

This code is provided under an MIT license. See the LICENSE file for full details.
