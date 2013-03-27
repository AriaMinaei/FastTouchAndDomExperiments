amdefine = require('./amdefine.js')(module)

path = require 'path'

pathToLib = path.resolve __dirname, '../js/lib'

assert = require 'assert'

global.spec = (dependencies, func) ->

	resolvedDependencies = dependencies.map (addr) ->

		path.resolve pathToLib, addr

	amdefine resolvedDependencies, func


global.should = require 'should'

global.aeq = (a, b) ->

	a.should.be.an.instanceOf Array
	b.should.be.an.instanceOf Array

	(JSON.stringify(a) is JSON.stringify(b)).should.eql yes, "Expected arrays to be equal."