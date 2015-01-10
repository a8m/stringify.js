'use strict';
var should = require('should')
  , _      = require('agile')
  , stringify = require('./');

describe('stringify.js', function() {
  describe('stringify single value', function() {
    it('#Number', function() {
      stringify(1).should.eql('1');
      stringify(1.1).should.eql('1.1');
      stringify(-0).should.eql('-0');
      stringify(-1).should.eql('-1');

      stringify(Infinity).should.eql('Infinity');
      stringify(-Infinity).should.eql('-Infinity');
      stringify(NaN).should.eql('NaN');
    });

    it('#String', function() {
      stringify('a').should.eql('"a"');
      stringify('ab').should.eql('"ab"');
      stringify(' ').should.eql('" "');
    });

    it('#Buffer', function() {
      stringify(new Buffer([0x01])).should.eql('[ 1 ]');
      stringify(new Buffer([0x01]), 2).should.eql('[\n  1\n]');
    });

    it('#Function', function() {
      stringify(function foo(){}).should.eql('[Function]');
      stringify(new Function).should.eql('[Function]');
    });

    it('#Array', function() {
      stringify([]).should.eql('[]');
      stringify([1]).should.eql('[ 1 ]');
      stringify([1, 2]).should.eql('[ 1, 2 ]');
      stringify([1, [ 1 ]]).should.eql('[ 1, [ 1 ] ]');
    });

    it('#Object', function() {
      stringify({}).should.eql('{}');
      stringify({ a: 1 }).should.eql('{ "a": 1 }');
      stringify({ a: { b: 1 } }).should.eql('{ "a": { "b": 1 } }');

      // hasOwnProperty,
      // and not enumerable properties
      var a = { a: 1 }
        , b = Object.create(a, {
          b: { value: 1, enumerable: true },
          c: { value: 1, enumerable: false }
        });
      stringify(b).should.eql('{ "b": 1 }');
    });

    it('#RegExp', function() {
      stringify(/^/g).should.eql('/^/g');
      stringify(/^[a-z]/g).should.eql('/^[a-z]/g');
    });

    it('#Date', function() {
      stringify(new Date(0)).should.eql('[Date: 1970-01-01T00:00:00.000Z]');
      stringify(new Date()).should.eql('[Date: ' + new Date().toISOString() + ']');
    });

    it('#Boolean', function() {
      stringify(true).should.eql('true');
      stringify(false).should.eql('false');
    });

    it('#null/undefined', function() {
      stringify(null).should.eql('[null]');
      stringify(undefined).should.eql('[undefined]');
    });
  });

  describe('with spaces', function() {
    it('#Array', function() {
      stringify([1,2,3], 2).should.eql([
        '['
        , '  1,'
        , '  2,'
        , '  3'
        ,']'
      ].join('\n'));

      stringify(['a', 'b', 'c'], 3).should.eql([
        '['
        , '   "a",'
        , '   "b",'
        , '   "c"'
        ,']'
      ].join('\n'));
    });
    it('#Matrix', function() {
      stringify([[ 1 ], [ 2 ], 3], 2).should.eql([
        '['
        , '  [\n    1\n  ],'
        , '  [\n    2\n  ],'
        , '  3'
        ,']'
      ].join('\n'));

      stringify([[ 1 ], [ 2, [ 2 ] ], 3], 2).should.eql([
        '['
        , '  [\n    1\n  ],'
        , '  [\n    2,\n    [\n      2\n    ]\n  ],'
        , '  3'
        ,']'
      ].join('\n'));
    });
    it('#Object', function() {
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
      expected.circular = expected; // Make `Circular` situation

      var actual = ['{'
        , '  "array": ['
        , '    1,'
        , '    2,'
        , '    3'
        , '  ],'
        , '  "boolean": false,'
        , '  "buffer": [Buffer: ['
        , '    1,'
        , '    2'
        , '  ]],'
        , '  "canObj": {'
        , '    "a": {'
        , '      "b": 1,'
        , '      "c": 2'
        , '    },'
        , '    "b": {}'
        , '  },'
        , '  "circular": [Circular],'
        , '  "date": [Date: 1970-01-01T00:00:00.000Z],'
        , '  "empArr": [],'
        , '  "empObj": {},'
        , '  "float": 9.99,'
        , '  "func": [Function],'
        , '  "global": [object global],'
        , '  "infi": Infinity,'
        , '  "int": 90,'
        , '  "matrix": ['
        , '    ['
        , '      1'
        , '    ],'
        , '    ['
        , '      2,'
        , '      3,'
        , '      4'
        , '    ]'
        , '  ],'
        , '  "nan": NaN,'
        , '  "nil": [null],'
        , '  "object": {'
        , '    "a": 1,'
        , '    "b": 2'
        , '  },'
        , '  "regex": /^[a-z|A-Z]/,'
        , '  "str": "string",'
        , '  "undef": [undefined],'
        , '  "zero": -0'
        , '}'].join('\n');

      stringify(expected, 2).should.eql(actual);
    });
  });
});