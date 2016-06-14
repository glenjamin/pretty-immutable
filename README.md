# pretty-immutable

Pretty printing for ImmutableJS

Heavily inspired by (and dependent on [json-stringify-pretty-compact][https://github.com/lydell/json-stringify-pretty-compact]).

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
console.log(prettyI(bigMap));

// Override the built-in inspect() method
prettyI.install(Immutable);
```

## License

Copyright 2016 Glen Mailer.

MIT Licensed.
