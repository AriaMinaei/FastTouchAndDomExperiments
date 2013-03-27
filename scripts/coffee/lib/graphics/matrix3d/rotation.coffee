if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class Rotation

		constructor: (x, y, z) ->

			@set x, y, z

		set: (x, y, z) ->

			@x = parseFloat x
			@y = parseFloat y
			@z = parseFloat z

		@rotateX: (alpha) ->

			alphaHalf = alpha / 2

			sinAlphaHalf = Math.sin(alphaHalf)
			sc = sinAlphaHalf * Math.cos(alphaHalf)
			sq = Math.pow sinAlphaHalf, 2

			f = 1 - (2 * sq)

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
				f,
				# 6
				2 * sc,
				# 7
				0,

				# 8
				0,
				# 9
				-2 * sc,
				# 10
				f,
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

		@rotateY: (alpha) ->

			alphaHalf = alpha / 2

			sinAlphaHalf = Math.sin(alphaHalf)
			sc = sinAlphaHalf * Math.cos(alphaHalf)
			sq = Math.pow sinAlphaHalf, 2

			f = 1 - (2 * sq)

			[
				# 0
				f,
				# 1
				0,
				# 2
				-2 * sc,
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
				2 * sc,
				# 9
				0,
				# 10
				f,
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

		@rotateZ: (alpha) ->

			alphaHalf = alpha / 2

			sinAlphaHalf = Math.sin(alphaHalf)
			sc = sinAlphaHalf * Math.cos(alphaHalf)
			sq = Math.pow sinAlphaHalf, 2

			f = 1 - (2 * sq)

			[
				# 0
				f,
				# 1
				2 * sc,
				# 2
				0,
				# 3
				0,

				# 4
				-2 * sc,
				# 5
				f,
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

		@rotate: (x, y, z) ->

			cosx = Math.cos(x)
			sinx = Math.sin(x)

			cosy = Math.cos(y)
			siny = Math.sin(y)
			cosz = Math.cos(z)
			sinz = Math.sin(z)

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

		getMatrix: ->

			return Rotation.rotate @x, @y, @z
			
			# currentMatrix = null
			
			# if @x

			# 	currentMatrix = Rotation.rotateX @x

			# if @y

			# 	if not currentMatrix 

			# 		currentMatrix = Rotation.rotateY @y

			# 	else

			# 		currentMatrix = multiply currentMatrix, Rotation.rotateY(@y)

			# if @z

			# 	if not currentMatrix 

			# 		currentMatrix = Rotation.rotateZ @z

			# 	else

			# 		currentMatrix = multiply currentMatrix, Rotation.rotateZ(@z)

			# if not currentMatrix

			# 	return identity()

			# else

			# 	return currentMatrix