var amdefine, assert, path, pathToLib;

amdefine = require('./amdefine.js')(module);

path = require('path');

pathToLib = path.resolve(__dirname, '../js/lib');

assert = require('assert');

global.spec = function(dependencies, func) {
  var resolvedDependencies;
  resolvedDependencies = dependencies.map(function(addr) {
    return path.resolve(pathToLib, addr);
  });
  return amdefine(resolvedDependencies, func);
};

global.should = require('should');

global.aeq = function(a, b) {
  a.should.be.an.instanceOf(Array);
  b.should.be.an.instanceOf(Array);
  return (JSON.stringify(a) === JSON.stringify(b)).should.eql(true, "Expected arrays to be equal.");
};
