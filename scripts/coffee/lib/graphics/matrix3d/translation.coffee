if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class Translation

		constructor: (x, y, z) ->

			@set x, y, z

		@create: ->

			new @ 0, 0, 0

		set: (x, y, z) ->

			@x = parseFloat x
			@y = parseFloat y
			@z = parseFloat z

		add: (x, y, z) ->

			@x += parseFloat x
			@y += parseFloat y
			@z += parseFloat z

		reset: ->

			@x = 0
			@y = 0
			@z = 0

		getMatrix: ->

			[
				# 0
				1,
				# 1
				0,
				# 2
				0,
				# 3
				0,

				# 4
				0,
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
				@x,
				# 13
				@y,
				# 14
				@z,
				# 15
				1
			]