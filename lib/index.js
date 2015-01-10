'use strict';

/**
 * Takes some variable and asks `{}.toString()` what it thinks it is.
 * @param {*} value Anything
 * @example
 * type({})           // 'object'
 * type([])           // 'array'
 * type(1)            // 'number'
 * type(false)        // 'boolean'
 * type(Infinity)     // 'number'
 * type(null)         // 'null'
 * type(new Date())   // 'date'
 * type(/foo/)        // 'regexp'
 * type('type')       // 'string'
 * type(global)       // 'global'
 * @api private
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
 * @returns {string}
 */
function type(value) {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return 'buffer';
  }
  return Object.prototype.toString.call(value)
    .replace(/^\[.+\s(.+?)\]$/, '$1')
    .toLowerCase();
}

/**
 * @static .isArray()
 */
var isArray = Array.isArray;

/**
 * @static .keys()
 */
var keys = Object.keys;

/**
 * @summary Return a new Thing that has the keys in sorted order. Recursively.
 * @description
 * - has already been seen, return string `'[Circular]'`
 * - is `undefined`, return string `'[undefined]'`
 * - is `null`, return value `'[null]'`
 * - is some other primitive, return the value
 * - is not a primitive or an `Array`, `Object`, or `Function`, return the value of the Thing's `toString()` method
 * - is a non-empty `Array`, `Object`, or `Function`, return the result of calling this function again.
 * - is an empty `Array`, `Object`, or `Function`, return the result of calling `emptyRepresentation()`
 *
 * @param {*} value Thing to inspect.  May or may not have properties.
 * @param {Array} [stack=[]] Stack of seen values
 * @return {(Object|Array|Function|string|undefined)}
 * @see {@link exports.stringify}
 * @api private
 */

 function canonicalize(value, stack) {
  var canonicalizedObj,
    withStack = function withStack(value, fn) {
      stack.push(value);
      fn();
      stack.pop();
    };

  stack = stack || [];

  if (~stack.indexOf(value)) return '[Circular]';
  switch(type(value)) {
    case 'undefined':
    case 'buffer':
    case 'null':
      canonicalizedObj = value;
      break;
    case 'array':
      withStack(value, function () {
        canonicalizedObj = value.map(function (item) {
          return canonicalize(item, stack);
        });
      });
      break;
    case 'function':
      canonicalizedObj = '[Function]';
      break;
    case 'global':
      canonicalizedObj = '[object global]';
      break;
    case 'object':
      canonicalizedObj = canonicalizedObj || {};
      withStack(value, function () {
        keys(value).sort().forEach(function (key) {
          canonicalizedObj[key] = canonicalize(value[key], stack);
        });
      });
      break;
    case 'date':
    case 'number':
    case 'regexp':
    case 'boolean':
      canonicalizedObj = value;
      break;
    default:
      canonicalizedObj = value.toString();
  }

  return canonicalizedObj;
}

/**
 * @description
 * like JSON.stringify but more sense.
 * @param {Object}  object
 * @param {Number=} spaces
 * @param {number=} depth
 * @returns {*}
 * @private
 */
function jsonStringify(object, spaces, depth) {
  if(typeof object != 'object' || typeof spaces == 'undefined') return _stringify(object);  // primitive types
  depth = depth || 1;
  var space = spaces * depth
    , str = isArray(object) ? '[' : '{'
    , end = isArray(object) ? ']' : '}'
    , length = object.length || keys(object).length
    , repeat = function(s, n) { return new Array(n).join(s); }; // `.repeat()` polyfill

  function _stringify(val) {
    switch (type(val)) {
      case 'null':
      case 'undefined':
        val = '[' + val + ']';
        break;
      case 'array':
      case 'object':
        val = jsonStringify(val, spaces, depth + 1);
        break;
      case 'boolean':
      case 'regexp':
      case 'number':
        val = val === 0 && (1/val) === -Infinity // `-0`
          ? '-0'
          : val.toString();
        break;
      case 'date':
        val = '[Date: ' + val.toISOString() + ']';
        break;
      case 'buffer':
        var json = val.toJSON();
        // Based on the toJSON result
        json = json.data && json.type ? json.data : json;
        val = '[Buffer: ' + jsonStringify(json, 2, depth + 1) + ']';
        break;
      default:
        val = ~['[Function]', '[Circular]', '[object global]'].indexOf(val)
          ? val
          : JSON.stringify(val); //string, etc..
    }
    return val;
  }

  for(var i in object) {
    if(!object.hasOwnProperty(i)) continue;        // not my business
    --length;
    str += (spaces ? '\n ' + repeat(' ', space) : ' ')
        + (isArray(object) ? '' : '"' + i + '": ') // key
        +  _stringify(object[i])                   // value
        + (length ? ',' : '');                     // comma
  }

  return str + (str.length != 1                  // [], {}
    ? (spaces ? '\n' + repeat(' ', space - spaces + 1) : ' ') + end
    : end);
}

/**
 * @description
 * the exported function
 * @param value
 * @param spaces
 * @returns {*}
 */
module.exports = function(value, spaces) {
  var _type = type(value);

  if (!~['object', 'array', 'function'].indexOf(_type)) {
    if(_type != 'buffer') {
      return jsonStringify(value);
    }
    var json = value.toJSON();
    // Based on the toJSON result
    return jsonStringify(json.data && json.type ? json.data : json, spaces || 0);
  }
  return jsonStringify(canonicalize(value), spaces || 0);
};