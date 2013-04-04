if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class Perspective

		constructor: (d) ->

			@set d

		@create: ->

			new @ 0

		set: (d) ->

			@d = parseFloat d

		add: (d) ->

			@d += parseFloat d

		reset: ->

			@d = 0

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
				-1 / @d,

				# 12
				0,
				# 13
				0,
				# 14
				0,
				# 15
				1
			]