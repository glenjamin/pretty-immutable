/* eslint-env mocha */
/* eslint-disable no-magic-numbers */

var I = require("immutable");

var expect = require("chai").expect;

var prettyI = require("../");

describe("pretty-immutable", function() {
  describe("pretty printing", function() {

    expectPretty(
      "Empty List",
      I.List(),
      "List []"
    );

    expectPretty(
      "Short List",
      I.List.of(1, 2, 3),
      "List [ 1, 2, 3 ]"
    );

    expectPretty(
      "Long List",
      I.List(I.Range(0, 21)),
      [
        "List [",
        "  0,",
        "  1,",
        "  2,",
        "  3,",
      ].concat(
        I.Range(4, 20).toArray()
          .map(function(n) { return "  " + n + ","; })
      ).concat([
        "  20",
        "]"
      ])
    );

    expectPretty(
      "Short Map",
      I.Map.of("a", 1, "b", 2),
      'Map { "a": 1, "b": 2 }'
    );

    expectPretty(
      "Big Map",
      I.Map.of(
        "a", I.List.of(1, 2, 3, "foo"),
        "b", I.Map.of(
          "why", "was",
          6, I.List.of("scared", "of", 7),
          "because", I.List.of(7, 8, 9)
        ),
        "c", I.Set.of(1, 2, 3)
      ),
      [
        'Map {',
        '  "a": List [ 1, 2, 3, "foo" ],',
        '  "b": Map {',
        '    "why": "was",',
        '    6: List [ "scared", "of", 7 ],',
        '    "because": List [ 7, 8, 9 ]',
        '  },',
        '  "c": Set { 1, 2, 3 }',
        '}'
      ]
    );

    var MyRecord = I.Record({a: 0, b: I.List()});
    var Point3d = I.Record({x: 0, y: 0, z: 0, notes: ""}, "Point3d");

    expectPretty(
      "Records and stuff",
      I.Map.of(
        "a", MyRecord(),
        "b", MyRecord({
          a: 1e10,
          b: I.List.of("Lorem", "ipsum", "dolor", "whassaname", "thingy")
        }),
        "c", I.Set.of(
          Point3d(),
          Point3d({x: -1, y: -1, z: -1}),
          Point3d({
            x: 10, y: 10, z: 100,
            notes: "I needed this to be longer than one line"
          })
        )
      ),
      [
        'Map {',
        '  "a": Record { "a": 0, "b": List [] },',
        '  "b": Record {',
        '    "a": 10000000000,',
        '    "b": List [ "Lorem", "ipsum", "dolor", "whassaname", "thingy" ]',
        '  },',
        '  "c": Set {',
        '    Point3d { "x": 0, "y": 0, "z": 0, "notes": "" },',
        '    Point3d { "x": -1, "y": -1, "z": -1, "notes": "" },',
        '    Point3d {',
        '      "x": 10,',
        '      "y": 10,',
        '      "z": 100,',
        '      "notes": "I needed this to be longer than one line"',
        '    }',
        '  }',
        '}'
      ]
    );

    // Implementation of these is half-hearted
    // just uses a generic fallback for now
    // could be expanded with more knowledge

    expectPretty(
      "Stack",
      I.Stack.of(20, 30, 40, "blah"),
      'Stack [ 20, 30, 40, "blah" ]'
    );

    expectPretty(
      "Range",
      I.Range(0, 10),
      "Range [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]"
    );

    expectPretty(
      "Infinite Range",
      I.Range(10),
      "Range [ Infinite ]"
    );

    function expectPretty(description, obj, expected) {
      if (Array.isArray(expected)) expected = expected.join("\n");

      it("should format " + description + " as `" + expected + "`", function() {
        expect(prettyI(obj)).to.eql(expected);
      });
    }
  });

  describe("install", function() {
    var list = I.List(I.Range(10, 30))
      .map(function(n) { return I.Map.of(n, n * n); });

    before(function() {
      prettyI.install(I);
    });
    it("should hijack .inspect()", function() {
      expect(list.inspect()).to.eql(prettyI(list));
    });
    it("should leave .toString() alone", function() {
      expect(list.toString()).not.to.eql(prettyI(list));
    });
  });
});
