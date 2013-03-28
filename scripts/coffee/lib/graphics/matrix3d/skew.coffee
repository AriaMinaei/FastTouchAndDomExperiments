if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class Skew

		constructor: (x, y) ->

			@set x, y

		@create: ->

			new @ 0, 0

		set: (x, y) ->

			@x = parseFloat x
			@y = parseFloat y

		add: (x, y) ->

			@x += parseFloat x
			@y += parseFloat y

		reset: ->

			@x = 0
			@y = 0

		getMatrix: ->

			[
				# 0
				1,
				# 1
				Math.tan(@y),
				# 2
				0,
				# 3
				0,

				# 4
				Math.tan(@x),
				# 5
				1,
				# 6
				0,
				# 7
				0,

				# 8
				0,
				# 9
				0,
				# 10
				1,
				# 11
				0,

				# 12
				0,
				# 13
				0,
				# 14
				0,
				# 15
				1
			]