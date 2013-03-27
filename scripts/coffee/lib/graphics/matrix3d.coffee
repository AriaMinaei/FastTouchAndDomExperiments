if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./matrix3d/base', './matrix3d/skew', './matrix3d/scale', './matrix3d/perspective', './matrix3d/rotation', './matrix3d/translation'], (Base, Skew, Scale, Perspective, Rotation, Translation) ->

	class Matrix3d
		# If arg is an array, it will set the matrix from that array.
		# It won't check the length of the array to save some time, so, make sure
		# arg.length is 16
		# 
		# If it's a string, it'll call @fromString
		constructor: (arg) ->

			@_skew = new Skew 0.0, 0.0
			@_hasSkew = no

			@_scale = new Scale 1.0, 1.0, 1.0
			@_hasScale = no

			@_perspective = new Perspective 100000.0
			@_hasPerspective = no

			@_rotation = new Rotation 0.0, 0.0, 0.0
			@_hasRotation = no

			@_translation = new Translation 0.0, 0.0, 0.0
			@_hasTranslation = no
			
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

			if @_hasTranslation

				if result then result = Base.multiply result, @_translation.getMatrix()
				else result = @_translation.getMatrix()

			if @_hasSkew

				if result then result = Base.multiply result, @_skew.getMatrix()
				else result = @_skew.getMatrix()

			if @_hasScale

				if result then result = Base.multiply result, @_scale.getMatrix()
				else result = @_scale.getMatrix()

			if @_hasPerspective

				if result then result = Base.multiply result, @_perspective.getMatrix()
				else result = @_perspective.getMatrix()

			if @_hasRotation

				if result then result = Base.multiply result, @_rotation.getMatrix()
				else result = @_rotation.getMatrix()

			unless result then result = Base.identity()
			
			@r = result
		
		# Parses a string from css
		fromString: (s) ->

			@r = Base.cssToArray s

		# From a WebKitCSSMatrix object
		fromWebkit: (w) ->

			@r = Base.webkit2Array w

		setSkew: (x, y) ->

			@_skew.set x, y
			@_hasSkew = yes
			
		setScale: (x, y, z) ->

			@_scale.set x, y, z
			@_hasScale = yes

		setPerspective: (d) ->

			@_perspective.set d
			@_hasPerspective = yes

		setRotation: (x, y, z) ->

			@_rotation.set x, y, z
			@_hasRotation = yes

		setTranslation: (x, y, z) ->

			@_translation.set x, y, z
			@_hasTranslation = yes

	Matrix3d
