amdefine = require('./amdefine.js')(module)

path = require 'path'

pathToLib = path.resolve __dirname, '../js/lib'

spec = (dependencies, func) ->

	resolvedDependencies = dependencies.map (addr) ->

		path.resolve pathToLib, addr

	amdefine resolvedDependencies, func

global.spec = spec
global.should = require 'should'