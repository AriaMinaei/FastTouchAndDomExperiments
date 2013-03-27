if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class Scale

		constructor: (x, y, z) ->

			@set x, y, z

		set: (x, y, z) ->

			@x = parseFloat x
			@y = parseFloat y
			@z = parseFloat z

		getMatrix: ->

			[
				# 0
				@x,
				# 1
				0,
				# 2
				0,
				# 3
				0,

				# 4
				0,
				# 5
				@y,
				# 6
				0,
				# 7
				0,

				# 8
				0,
				# 9
				0,
				# 10
				@z,
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