Graphics = {}
window.Graphics = Graphics

# This is faster than array.slice(0)
# 11%  faster in chrome 25
# 800% faster in iOS6
# 11%  slower in FF Aurora 20
clone16 = (r) ->
	[r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]


# Returns the multiplication of two vectors
# Got it from famo.us (Tell me if I shouldn't have, since there was no license statement)
multiply = (a, b) ->
	[
		# 0
		a[0] * b[0] + a[1] * b[4] + a[2] * b[8],
		# 1
		a[0] * b[1] + a[1] * b[5] + a[2] * b[9],
		# 2
		a[0] * b[2] + a[1] * b[6] + a[2] * b[10]
		# 3
		0,
		# 4
		a[4] * b[0] + a[5] * b[4] + a[6] * b[8],
		# 5
		a[4] * b[1] + a[5] * b[5] + a[6] * b[9],
		# 6
		a[4] * b[2] + a[5] * b[6] + a[6] * b[10],
		# 7
		0,
		# 8
		a[8] * b[0] + a[9] * b[4] + a[10] * b[8],
		# 9
		a[8] * b[1] + a[9] * b[5] + a[10] * b[9],
		# 10
		a[8] * b[2] + a[9] * b[6] + a[10] * b[10],
		# 11
		0,
		# 12
		a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + b[12],
		# 13
		a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + b[13],
		# 14
		a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14],
		# 15
		1
	]

# An identity matrix
identity = () ->
	[
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]

class Graphics.Matrix3d
	# If arg is an array, it will set the matrix from that array
	# It won't check the length of the array to save some time, so, make sure
	# arg.length is 16
	# 
	# If it's a string, it'll call @fromString
	constructor: (arg) ->
		if Array.isArray(arg)
			@r = arg
		if typeof arg is 'string'
			@fromString arg
		else
			@r = identity()

	# From another Matrix3d object
	fromMatrix: (m) ->
		@r = clone16(m.r)
		@

	# Returns a copy of itself
	copy: ->
		new Graphics.Matrix3d clone16(@r)

	# Returns a string for css
	toString: () ->
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
			console.log 's.split', s.split(', ')
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

	# Sets the translation
	setTranslate: (x, y, z = 0) ->
		# I'm not calling the setTranslateX/Y/Z functions to save a little bit of time
		@r[12] = parseFloat x
		@r[13] = parseFloat y
		@r[14] = parseFloat z
		@

	# Sets X Translation
	setTranslateX: (x) ->
		@r[12] = parseFloat x
		@

	# Sets Y Translation
	setTranslateY: (y) ->
		@r[13] = parseFloat y
		@

	# Sets Z Translation
	setTranslateZ: (z) ->
		@r[14] = parseFloat z
		@

	# Translates relative to its current position
	translate: (x, y, z = 0) ->
		@r[12] += parseFloat x
		@r[13] += parseFloat y
		@r[14] += parseFloat z
		@

	# Translates in X axis relative to its current position
	translateX: (x) ->
		@r[12] += parseFloat x
		@

	# Translates in X axis relative to its current position
	translateY: (y) ->
		@r[13] += parseFloat y
		@

	# Translates in X axis relative to its current position
	translateZ: (z) ->
		@r[14] += parseFloat z
		@
	
	###
	 # Here is where it gets creepy!
	 # 
	 # All methods starting with '_' are supposed to work on matrixes
	 # that dont have any pair of [rotation, scale, skew] at the same time.
	 #
	 # For example, if a matrix has a scale other than [1, 1, 1], then you can't
	 # apply a rotation to it, or it will look weired.
	 #
	 # But since many transformations don't have these pairs, we can use these fast functions
	 # to save some calculation time.
	###

	_setScale: (x, y, z) ->
		@r[0] = parseFloat x
		@r[5] = parseFloat y
		@r[10] = parseFloat x
		@

	_setScaleX: (x) ->
		@r[0] = parseFloat x
		@

	_setScaleY: (y) ->
		@r[5] = parseFloat y
		@

	_setScaleZ: (z) ->
		@r[10] = parseFloat z
		@

	_scale: (x, y, z) ->
		@r[0] *= parseFloat x
		@r[5] *= parseFloat y
		@r[10] *= parseFloat x
		@

	_scaleX: (x) ->
		@r[0] *= parseFloat x
		@

	_scaleY: (y) ->
		@r[5] *= parseFloat y
		@

	_scaleZ: (z) ->
		@r[10] *= parseFloat z
		@

	_setRotation: (x, y, z) ->
		# I tried w3c's method with some optimizations and Famo.us` method.
		# They perform the same. Famo.us` is cleaner, so I'm going with that.
		cosx = Math.cos(x)
		sinx = Math.sin(x)

		cosy = Math.cos(y)
		siny = Math.sin(y)
		cosz = Math.cos(z)
		sinz = Math.sin(z)

		@r[0] = cosy * cosz
		@r[1] = cosx * sinz + sinx * siny * cosz
		@r[2] = sinx * sinz - cosx * siny * cosz

		@r[4] = -cosy * sinz
		@r[5] = cosx * cosz - sinx * siny * sinz
		@r[6] = sinx * cosz + cosx * siny * sinz

		@r[8] = siny
		@r[9] = -sinx * cosy
		@r[10] = cosx * cosy

		@

	_setRotationX: (x) ->
		cosx = Math.cos(x)
		sinx = Math.sin(x)

		@r[5] = cosx
		@r[6] = sinx

		@r[9] = -sinx
		@r[10] = cosx

		@

	_setRotationY: (y) ->
		# I tried w3c's method with some optimizations and Famo.us` method.
		# They perform the same. Famo.us` is cleaner, so I'm going with that.

		cosy = Math.cos(y)
		siny = Math.sin(y)

		@r[0] = cosy
		@r[2] = -siny

		@r[8] = siny
		@r[10] = cosy

		@

	_setRotationZ: (z) ->
		cosz = Math.cos(z)
		sinz = Math.sin(z)

		@r[0] = cosz
		@r[1] = sinz		

		@r[4] = -sinz
		@r[5] = cosz

		@

# do ->
# 	suite = new Benchmark.Suite

# 	g = new Graphics.Matrix3d

# 	rad = Math.PI / 4

# 	suite.on 'cycle', (e) ->
# 		console.log String(e.target)

# 	suite.add 'w3', ->
# 		g._setRotationFamous 1, 0, 0, rad

# 	suite.add 'famous', ->
# 		g._setRotationFamous rad, 0, 0

	

# 	suite.on 'complete', ->
# 		console.log 'Fastest:', this

# 	window.run = ->
# 		suite.run
# 			async: true

# 		return null