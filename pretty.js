var Immutable = require("immutable");
var Iterable = Immutable.Iterable;
var repeatString = require("repeat-string");
var stringify = require("json-stringify-pretty-compact");

var DEFAULT_MAX = 80;
var DEFAULT_INDENT = 2;

function prettyI(val, options) {
  if (!Iterable.isIterable(val)) {
    return stringify(val, options);
  }

  var opts = options || {};
  var maxLength = isNaN(opts.maxLength) ? DEFAULT_MAX : Number(opts.maxLength);
  var indent = isNaN(opts.indent) ? DEFAULT_INDENT : Number(opts.indent);
  var baseIndent = isNaN(opts.baseIndent) ? indent : opts.baseIndent;

  var bookends = figureOutBookends(val);
  if (val.size === 0) {
    return bookends[0] + bookends[1];
  }

  var children;
  if (!isFinite(val.size)) {
    children = ["Infinite"];
  } else if (Iterable.isKeyed(val)) {
    children = val.toSeq().map(function(v, k) {
      var keyPart = JSON.stringify(k) + ": ";
      return keyPart + prettyI(v, {
        maxLength: maxLength - baseIndent - keyPart.length,
        indent: indent + baseIndent,
        baseIndent: baseIndent
      });
    });
  } else {
    children = val.toSeq().map(function(v) {
      return prettyI(v, {
        maxLength: maxLength - baseIndent,
        indent: indent + baseIndent,
        baseIndent: baseIndent
      });
    });
  }

  var oneLine = bookend(bookends, " ", children.join(", "));
  if (oneLine.length <= maxLength) {
    return oneLine;
  }

  return bookend(
    bookends,
    "\n" + padding(indent - baseIndent),
    padding(baseIndent) + children.join(",\n" + padding(indent))
  );
}

function padding(n) {
  return repeatString(" ", n);
}

function bookend(tokens, gap, contents) {
  return tokens[0] + gap + contents + gap + tokens[1];
}

function figureOutBookends(val) {
  if (typeof val.clear === "function") {
    // Figure out the name and delimeters for the collection
    // by grabbing the stringification of an empty instance
    //
    // The name is up the the first space
    // then we get the opening delimeter
    // the last character is the closing delimeter
    //
    // If a record name has a space in, this breaks. Oh well.
    var emptyString = String(val.clear());
    var firstSpace = emptyString.indexOf(" ");
    return [emptyString.slice(0, firstSpace + 2), emptyString.slice(-1)];
  }
  var name = (val.constructor && val.constructor.name) || "???";
  return [name + " [", "]"];
}

exports = module.exports = prettyI;

exports.install = function installPretty(Imm) {
  Imm.Iterable.prototype.inspect = function() {
    return prettyI(this);
  };
  return Imm;
};
