if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class Rotation

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

			cosx = Math.cos @x
			sinx = Math.sin @x

			cosy = Math.cos @y
			siny = Math.sin @y

			cosz = Math.cos @z
			sinz = Math.sin @z

			[
				# 0
				cosy * cosz,
				# 1
				cosx * sinz + sinx * siny * cosz,
				# 2
				sinx * sinz - cosx * siny * cosz,
				# 3
				0,

				# 4
				-cosy * sinz,
				# 5
				cosx * cosz - sinx * siny * sinz,
				# 6
				sinx * cosz + cosx * siny * sinz,
				# 7
				0,

				# 8
				siny,
				# 9
				-sinx * cosy,
				# 10
				cosx * cosy,
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