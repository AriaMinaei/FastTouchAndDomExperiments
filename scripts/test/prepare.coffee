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

color = do ->

	ANSI_CODES =

	    off: 0
	    bold: 1
	    italic: 3
	    underline: 4
	    blink: 5
	    inverse: 7
	    hidden: 8
	    black: 30
	    red: 31
	    green: 32
	    yellow: 33
	    blue: 34
	    magenta: 35
	    cyan: 36
	    white: 37
	    black_bg: 40
	    red_bg: 41
	    green_bg: 42
	    yellow_bg: 43
	    blue_bg: 44
	    magenta_bg: 45
	    cyan_bg: 46
	    white_bg: 47

	# https://github.com/loopj/commonjs-ansi-color
	setColor = (str, color) ->

	    return str  unless color

	    color_attrs = color.split("+")
	    ansi_str = ""
	    i = 0
	    attr = undefined

	    while attr = color_attrs[i]

	        ansi_str += "\u001b[" + ANSI_CODES[attr] + "m"

	        i++

	    ansi_str += str + "\u001b[" + ANSI_CODES["off"] + "m"

	    ansi_str

global.test = (name, fn) ->

	try

		do fn

	catch err

		# console.log err

		console.log '       ' + color(name, 'red') + '\n'

		if err.actual

			console.log '          Expected:'

			console.log '          "' + color(err.expected, 'yellow') + '"\n'

			console.log '          Actual:'
			console.log '          "' + color(err.actual, 'yellow') + '"\n'

		console.log '          Stack:'

		console.log '          %s\n', color(err.stack, 'yellow')

		return

	console.log '     √ \x1b[32m%s\x1b[0m', name


# The lovely should.js framework
global.should = require 'should'

# We're gonna need assert
global.assert = require 'assert'

# should.js doesn't do deep equal.
Array::shouldEqual = (b, msg = '') ->

	if msg

		msg = '| ' + msg

	assert.deepEqual @, b, "The two arrays are not equal " + msg