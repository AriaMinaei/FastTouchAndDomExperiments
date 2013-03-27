# Preparing for the tests
amdefine = require('./amdefine.js')(module)
path = require 'path'

pathToLib = path.resolve __dirname, '../js/lib'

# To load the dependencies in each test
global.spec = (dependencies, func) ->

	# Resolve paths for dependencies
	resolvedDependencies = dependencies.map (addr) ->

		path.resolve pathToLib, addr

	amdefine resolvedDependencies, func

# The lovely should.js framework
global.should = require 'should'

# We're gonna need assert
assert = require 'assert'

# should.js doesn't do deep equal.
Array::shouldEqual = (b, msg = '') ->

	assert.deepEqual @, b, "The two arrays are not equal" + (' | ' + msg if msg)