var amdefine, assert, path, pathToLib;

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

global.should = require('should');

assert = require('assert');

Array.prototype.shouldEqual = function(b, msg) {
  if (msg == null) {
    msg = '';
  }
  return assert.deepEqual(this, b, "The two arrays are not equal" + (msg ? ' | ' + msg : void 0));
};

/*
//@ sourceMappingURL=prepare.map
*/
