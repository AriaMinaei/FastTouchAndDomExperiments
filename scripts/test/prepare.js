var amdefine, path, pathToLib, spec;

amdefine = require('./amdefine.js')(module);

path = require('path');

pathToLib = path.resolve(__dirname, '../js/lib');

spec = function(dependencies, func) {
  var resolvedDependencies;
  resolvedDependencies = dependencies.map(function(addr) {
    return path.resolve(pathToLib, addr);
  });
  return amdefine(resolvedDependencies, func);
};

global.spec = spec;

global.should = require('should');
