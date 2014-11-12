node-aes-cmac
=============

A pure [Node.js](http://nodejs.org/) implementation of the AES-CMAC algorithm
per [NIST Special Publication 800-38B](http://csrc.nist.gov/publications/nistpubs/800-38B/SP_800-38B.pdf)
and ([RFC 4493](http://tools.ietf.org/html/rfc4493)).


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


## License

This code is provided under an MIT license. See the LICENSE file for full details.
