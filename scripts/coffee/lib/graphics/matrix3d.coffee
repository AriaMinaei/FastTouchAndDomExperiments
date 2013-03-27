if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./matrix3d/base', './matrix3d/rotation', './matrix3d/perspective'], (Base, Rotation, Perspective) ->

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

				@r = Base.identity()

		# From another Matrix3d object
		fromMatrix: (m) ->

			@r = Base.clone16 m.r
			@
		
		generateMatrix: ->

			result = null

			if @_hasPerspective

				result = @_perspective.getMatrix()

			else

				result = Base.identity()

			if @_hasRotation then result = Base.multiply result, @_rotation.getMatrix()

			@r = result
		
		# Parses a string from css
		fromString: (s) ->

			@r = Base.fromString s

		# From a WebKitCSSMatrix object
		fromWebkit: (w) ->

			@r = Base.fromWebkit w

		setPerspective: (d) ->

			@_perspective.set d
			@_hasPerspective = yes

		setRotation: (x, y, z) ->

			@_rotation.set x, y, z
			@_hasRotation = yes

	Matrix3d
