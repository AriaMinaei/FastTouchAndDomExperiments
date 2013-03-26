define ->

	# This is faster than array.slice(0)
	# 11%  faster in chrome 25
	# 800% faster in iOS6
	# 11%  slower in FF Aurora 20
	clone16 = (r) ->

		[r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]

	# Returns the multiplication of two matrices
	multiply = (b, a) ->

		[
			a[0]  * b[0]    +    a[1]  *  b[4]    +    a[2]  * b[8]     +    a[3]  * b[12],
			a[0]  * b[1]    +    a[1]  *  b[5]    +    a[2]  * b[9]     +    a[3]  * b[13],
			a[0]  * b[2]    +    a[1]  *  b[6]    +    a[2]  * b[10]    +    a[3]  * b[14],
			a[0]  * b[3]    +    a[1]  *  b[7]    +    a[2]  * b[11]    +    a[3]  * b[15],
 
 			a[4]  * b[0]    +    a[5]  *  b[4]    +    a[6]  * b[8]     +    a[7]  * b[12],
 			a[4]  * b[1]    +    a[5]  *  b[5]    +    a[6]  * b[9]     +    a[7]  * b[13],
 			a[4]  * b[2]    +    a[5]  *  b[6]    +    a[6]  * b[10]    +    a[7]  * b[14],
 			a[4]  * b[3]    +    a[5]  *  b[7]    +    a[6]  * b[11]    +    a[7]  * b[15],
 
 			a[8]  * b[0]    +    a[9]  *  b[4]    +    a[10] * b[8]     +    a[11] * b[12],
 			a[8]  * b[1]    +    a[9]  *  b[5]    +    a[10] * b[9]     +    a[11] * b[13],
 			a[8]  * b[2]    +    a[9]  *  b[6]    +    a[10] * b[10]    +    a[11] * b[14],
 			a[8]  * b[3]    +    a[9]  *  b[7]    +    a[10] * b[11]    +    a[11] * b[15],
 
 			a[12] * b[0]    +    a[13] *  b[4]    +    a[14] * b[8]     +    a[15] * b[12],
 			a[12] * b[1]    +    a[13] *  b[5]    +    a[14] * b[9]     +    a[15] * b[13],
 			a[12] * b[2]    +    a[13] *  b[6]    +    a[14] * b[10]    +    a[15] * b[14],
			a[12] * b[3]    +    a[13] *  b[7]    +    a[14] * b[11]    +    a[15] * b[15]
		
		]

	# An identity matrix
	identity = ->

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
			0,
			# 13
			0,
			# 14
			0,
			# 15
			1
		]

	fromString = (s) ->

		result

		# Is it a matrix3d?
		if s.substr(8, 1) is '('

			# Remove the 'matrix3d(' and ')'
			s = s.substr(9, s.length - 10)
			result = s.split(', ').map(parseFloat)

		# Or a matrix?
		else if s.substr(6, 1) is '('

			s = s.substr(7, s.length - 8)
			temp = s.split(', ').map(parseFloat)
			result = [
				temp[0],
				temp[1],
				0, 0,

				temp[2],
				temp[3],
				0, 0,

				0, 0, 1, 0,

				temp[4],
				temp[5],
				0, 1
			]

		else if s[0] is 'n'

			# none
			result = identity()

		else
		
			throw Error 'Unkown matrix format'

		result

	fromWebkit = (w) ->

		[
			w.m11,
			w.m12,
			w.m13,
			w.m14,

			w.m21,
			w.m22,
			w.m23,
			w.m24,

			w.m31,
			w.m32,
			w.m33,
			w.m34,

			w.m41,
			w.m42,
			w.m43,
			w.m44
		]

	toWebkit = (r) ->

		w = new WebKitCSSMatrix

		w.m11 = r[0]
		w.m12 = r[1]
		w.m13 = r[2]
		w.m14 = r[3]

		w.m21 = r[4]
		w.m22 = r[5]
		w.m23 = r[6]
		w.m24 = r[7]

		w.m31 = r[8]
		w.m32 = r[9]
		w.m33 = r[10]
		w.m34 = r[11]

		w.m41 = r[12]
		w.m42 = r[13]
		w.m43 = r[14]
		w.m44 = r[15]

		w

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

		getMatrix: ->
			
			return multiply Rotation.rotateX(@x), Rotation.rotateY(@y)

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

			if not currentMatrix

				return identity()

			else

				return currentMatrix


	class Perspective

		constructor: (d) ->

			@set d

		set: (d) ->

			@d = parseFloat d

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

	class Matrix3d
		# If arg is an array, it will set the matrix from that array.
		# It won't check the length of the array to save some time, so, make sure
		# arg.length is 16
		# 
		# If it's a string, it'll call @fromString
		constructor: (arg) ->

			@_perspective = new Perspective 1500.0
			@_hasPerspective = no

			@_rotation = new Rotation 0.0, 0.0, 0.0
			@_hasRotation = no
			
			if Array.isArray(arg)

				@r = arg

			else if typeof arg is 'string'

				@fromString arg

			else

				@r = identity()

		# From another Matrix3d object
		fromMatrix: (m) ->

			@r = clone16(m.r)
			@

		# Returns a copy of itself
		copy: ->

			new FastMatrix clone16(@r)

		# Returns a string for css
		toString: ->

			do @generateMatrix

			a = @r

			'matrix3d(' + a[0] +
			', ' + a[1] +
			', ' + a[2] +
			', ' + a[3] +
			', ' + a[4] +
			', ' + a[5] +
			', ' + a[6] +
			', ' + a[7] +
			', ' + a[8] +
			', ' + a[9] +
			', ' + a[10] +
			', ' + a[11] +
			', ' + a[12] +
			', ' + a[13] +
			', ' + a[14] +
			', ' + a[15] + ')'
		
		generateMatrix: ->

			# result = null

			# if @_hasPerspective

			# 	result = @_perspective.getMatrix()

			# else

			# 	result = identity()

			# if @_hasRotation then result = multiply result, @_rotation.getMatrix()

			result = @_rotation.getMatrix()

			@r = result
		
		# Parses a string from css
		fromString: (s) ->

			# Is it a matrix3d?
			if s.substr(8, 1) is '('

				# Remove the 'matrix3d(' and ')'
				s = s.substr(9, s.length - 10)
				@r = s.split(', ').map(parseFloat)

			# Or a matrix?
			else if s.substr(6, 1) is '('

				s = s.substr(7, s.length - 8)
				temp = s.split(', ').map(parseFloat)
				@r = [
					temp[0],
					temp[1],
					0, 0,

					temp[2],
					temp[3],
					0, 0,

					0, 0, 1, 0,

					temp[4],
					temp[5],
					0, 1
				]

			else if s[0] is 'n'

				# none
				@r = identity()

			else
			
				throw Error 'Unkown matrix format'

			@

		# From a WebKitCSSMatrix object
		fromWebkit: (w) ->

			@r = [
				w.m11,
				w.m12,
				w.m13,
				w.m14,

				w.m21,
				w.m22,
				w.m23,
				w.m24,

				w.m31,
				w.m32,
				w.m33,
				w.m34,

				w.m41,
				w.m42,
				w.m43,
				w.m44
			]
			
			@

		setPerspective: (d) ->

			@_perspective.set d
			@_hasPerspective = yes

		setRotation: (x, y, z) ->

			@_rotation.set x, y, z
			@_hasRotation = yes

	Matrix3d.Rotation = Rotation

	Matrix3d.fromString = fromString

	Matrix3d.fromWebkit = fromWebkit

	Matrix3d.toWebkit = toWebkit

	Matrix3d.multiply = multiply

	Matrix3d
