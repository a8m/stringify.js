###Stringify.js - like JSON.stringify, but more sense  
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

## Install

```sh
$ npm install stringify.js --save 
```

## Usage
```js
var stringify = require('stringify.js');
var expected = {
      str: 'string',
      int: 90,
      float: 9.99,
      boolean: false,
      nil: null,
      undef: undefined,
      regex: /^[a-z|A-Z]/,
      date: new Date(0),
      func: function() {},
      infi: Infinity,
      nan: NaN,
      zero: -0,
      buffer: new Buffer([0x01, 0x02]),
      array: [1,2,3],
      empArr: [],
      matrix: [[1], [2,3,4] ],
      object: { a: 1, b: 2 },
      canObj: { a: { b: 1, c: 2 }, b: {} },
      empObj: {},
      global: global
    };
expected.circular = expected; // Make a `Circular` situation
console.log(stringify(expected, 2)); /* Print result
{
  "array": [
    1,
    2,
    3
  ],
  "boolean": false,
  "buffer": [Buffer: [
    1,
    2
  ]],
  "canObj": {
    "a": {
      "b": 1,
      "c": 2
    },
    "b": {}
  },
  "circular": [Circular],
  "date": [Date: 1970-01-01T00:00:00.000Z],
  "empArr": [],
  "empObj": {},
  "float": 9.99,
  "func": [Function],
  "global": [object global],
  "infi": Infinity,
  "int": 90,
  "matrix": [
    [
      1
    ],
    [
      2,
      3,
      4
    ]
  ],
  "nan": NaN,
  "nil": [null],
  "object": {
    "a": 1,
    "b": 2
  },
  "regex": /^[a-z|A-Z]/,
  "str": "string",
  "undef": [undefined],
  "zero": -0
}
```

## License

MIT © [Ariel Mashraki](https://github.com/a8m)
[npm-image]: https://img.shields.io/npm/v/stringify.js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/stringify.js
[travis-image]: https://img.shields.io/travis/a8m/stringify.js.svg?style=flat-square
[travis-url]: https://travis-ci.org/a8m/stringify.js
[coveralls-image]: https://img.shields.io/coveralls/a8m/stringify.js.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/a8m/stringify.js
[david-image]: http://img.shields.io/david/a8m/stringify.js.svg?style=flat-square
[david-url]: https://david-dm.org/a8m/stringify.js
[license-image]: http://img.shields.io/npm/l/stringify.js.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/stringify.js.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/stringify.js
