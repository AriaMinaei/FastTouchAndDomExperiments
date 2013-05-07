var amdefine, color, path, pathToLib;

amdefine = require('./amdefine.js')(module);

path = require('path');

pathToLib = path.resolve(__dirname, '../js/lib');

global.spec = function(dependencies, func) {
  var resolvedDependencies;

  resolvedDependencies = dependencies.map(function(addr) {
    return path.resolve(pathToLib, addr);
  });
  return amdefine(resolvedDependencies, func);
};

color = (function() {
  var ANSI_CODES, setColor;

  ANSI_CODES = {
    off: 0,
    bold: 1,
    italic: 3,
    underline: 4,
    blink: 5,
    inverse: 7,
    hidden: 8,
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    black_bg: 40,
    red_bg: 41,
    green_bg: 42,
    yellow_bg: 43,
    blue_bg: 44,
    magenta_bg: 45,
    cyan_bg: 46,
    white_bg: 47
  };
  return setColor = function(str, color) {
    var ansi_str, attr, color_attrs, i;

    if (!color) {
      return str;
    }
    color_attrs = color.split("+");
    ansi_str = "";
    i = 0;
    attr = void 0;
    while (attr = color_attrs[i]) {
      ansi_str += "\u001b[" + ANSI_CODES[attr] + "m";
      i++;
    }
    ansi_str += str + "\u001b[" + ANSI_CODES["off"] + "m";
    return ansi_str;
  };
})();

global.test = function(name, fn) {
  var err;

  try {
    fn();
  } catch (_error) {
    err = _error;
    console.log('       ' + color(name, 'red') + '\n');
    if (err.actual) {
      console.log('          Expected:');
      console.log('          "' + color(err.expected, 'yellow') + '"\n');
      console.log('          Actual:');
      console.log('          "' + color(err.actual, 'yellow') + '"\n');
    }
    console.log('          Stack:');
    console.log('          %s', color(err.stack, 'yellow'));
    console.log("\007");
    return;
  }
  return console.log('     √ \x1b[32m%s\x1b[0m', name);
};

global.should = require('should');

global.assert = require('assert');

Array.prototype.shouldEqual = function(b, msg) {
  if (msg == null) {
    msg = '';
  }
  if (msg) {
    msg = '| ' + msg;
  }
  return assert.deepEqual(this, b, "The two arrays are not equal " + msg);
};

/*
//@ sourceMappingURL=prepare.map
*/
