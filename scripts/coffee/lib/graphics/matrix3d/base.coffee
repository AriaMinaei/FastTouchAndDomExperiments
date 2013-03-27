if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	Base = {}

	# A set of basic tools for 4x4 matrices.
	# They all work with arrays of 16 indices.

	# This is faster than array.slice(0)
	# 11%  faster in chrome 25
	# 800% faster in iOS6
	# 11%  slower in FF Aurora 20
	clone16 = Base.clone16 = (r) ->

		[r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]

	# Returns the multiplication of two matrices
	multiply = Base.multiply = (b, a) ->

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
	identity = Base.identity = ->

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

	matrix2Matrix3d = Base.matrix2Matrix3d = (matrix) ->

		[
			matrix[0],
			matrix[1],
			0, 0,

			matrix[2],
			matrix[3],
			0, 0,

			0, 0, 1, 0,

			matrix[4],
			matrix[5],
			0, 1
		]

	# Parses a matrix() or matrix3d() css string and returns an array16
	fromString = Base.css2Array = (s) ->

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

	# Returns an array16 from a WebKitCSSMatrix Object
	fromWebkit = Base.webkitToArray = (w) ->

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

	# Turns an array16 into a WebKitCSSMatrix Object
	toWebkit = Base.arrayToWebkit = (r) ->

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

	Base
