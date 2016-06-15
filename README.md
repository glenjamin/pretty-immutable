# pretty-immutable

Pretty printing for ImmutableJS

Heavily inspired by (and dependent on) [json-stringify-pretty-compact](https://github.com/lydell/json-stringify-pretty-compact).

[![npm version](https://img.shields.io/npm/v/pretty-immutable.svg)](https://www.npmjs.com/package/pretty-immutable) [![Build Status](https://img.shields.io/travis/glenjamin/pretty-immutable/master.svg)](https://travis-ci.org/glenjamin/pretty-immutable) ![MIT Licensed](https://img.shields.io/npm/l/pretty-immutable.svg)

## Install

```sh
npm install pretty-immutable
```

This library will only work (or really make any sense) if you also have `immutable` installed.

## Usage

```js
var Immutable = require("immutable");
var prettyI = require("pretty-immutable");

var bigMap = Immutable.fromJS({
  a: [1, 2, 3, 4],
  b: {
    blah: {
      blah: [
        {a: 1},
        {b: 2},
        {c: 3}
      ]
    }
  }
});

// Use as a formatter
console.log(prettyI(bigMap)); /*
Map {
  "a": List [ 1, 2, 3, 4 ],
  "b": Map {
    "blah": Map {
      "blah": List [
        Map { "a": 1 },
        Map { "b": 2 },
        Map { "c": 3 }
      ]
    }
  }
}
*/

// Override the built-in inspect() method
prettyI.install(Immutable);

console.log(bigMap.inspect()); /*
Map {
  "a": List [ 1, 2, 3, 4 ],
  "b": Map {
    "blah": Map {
      "blah": List [
        Map { "a": 1 },
        Map { "b": 2 },
        Map { "c": 3 }
      ]
    }
  }
}
*/
```

## License

Copyright 2016 Glen Mailer.

MIT Licensed.
