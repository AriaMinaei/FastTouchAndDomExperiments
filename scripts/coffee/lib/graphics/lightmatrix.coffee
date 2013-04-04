if typeof define isnt 'function' then define = require('amdefine')(module)

define [
	'./lightmatrix/base', './lightmatrix/translation', './lightmatrix/scale', './lightmatrix/perspective',  './lightmatrix/rotation'
	], (Base, Translation, Scale, Perspective, Rotation) ->

	emptyStack = ->

		{
			mX: 0
			mY: 0
			mZ: 0

			sX: 1
			sY: 1
			sZ: 1

			p: 0

			rX: 0
			rY: 0
			rZ: 0

			tX: 0
			tY: 0
			tZ: 0
		}

	cloneStack = (stack) ->

		{
			mX: stack.mX
			mY: stack.mY
			mZ: stack.mZ

			sX: stack.sX
			sY: stack.sY
			sZ: stack.sZ

			p: stack.p

			rX: stack.rX
			rY: stack.rY
			rZ: stack.rZ

			tX: stack.tX
			tY: stack.tY
			tZ: stack.tZ
		}

	class LightMatrix

		constructor: ->

			@_main = emptyStack()
			@_temp = emptyStack()

			@_current = @_main

			@_has = 

				movement: no

				perspective: no

				rotation: no

				scale: no

				translation: no


			@_identityMatrix = Base.identity()
			
			@_tempMode = no

		temporarily: ->

			@_temp = cloneStack @_main
			@_current = @_temp

			@_tempMode = yes

			@

		commit: ->

			@_main = cloneStack @_temp
			@_current = @_main

			@_tempMode = no

			@

		rollBack: ->

			@_current = @_main

			@_tempMode = no

			@

		toCss: ->

			Base.toCss @toMatrix()

		toMatrix: ->

			soFar = @_getIdentityMatrix()

			# movement
			if @_has.m

				soFar = Translation.setTo soFar, @_current.mX, @_current.mY, @_current.mZ

			# scale
			if @_has.s

				Scale.applyTo soFar, @_current.sX, @_current.sY, @_current.sZ

			# perspectove
			if @_has.p

				Perspective.applyTo soFar, @_current.p

			# rotation
			if @_has.r

				Rotation.applyTo soFar, @_current.rX, @_current.rY, @_current.rZ

			# translation
			if @_has.t

				Translation.applyTo soFar, @_current.tX, @_current.tY, @_current.tZ

			soFar

		_getIdentityMatrix: ->

			Base.setIdentity @_identityMatrix

			@_identityMatrix

		###
		Movement
		###

		resetMovement: ->

			@_has.m = no

			@_current.mX = 0
			@_current.mY = 0
			@_current.mZ = 0

			@

		movement: ->

			{
				x: @_current.mX
				y: @_current.mY
				z: @_current.mZ
			}

		setMovement: (x, y, z) ->

			@_has.m = no if not x and not y and not z

			@_current.mX = x
			@_current.mY = y
			@_current.mZ = z

			@

		setMovementX: (x) ->

			@_has.m = yes if x

			@_current.mX = x

			@

		setMovementY: (y) ->

			@_has.m = yes if y

			@_current.mY = y

			@

		setMovementZ: (z) ->

			@_has.m = yes if z

			@_current.mZ = z

			@

		move: (x, y, z) ->

			# This *does* work most of the times
			@_has.m = yes if x or y or z

			@_current.mX += x
			@_current.mY += y
			@_current.mZ += z

			@

		moveX: (x) ->

			@_has.m = yes if x

			@_current.mX += x

			@

		moveY: (y) ->

			@_has.m = yes if y

			@_current.mY += y

			@

		moveZ: (z) ->

			@_has.m = yes if z

			@_current.mZ += z

			@

		###
		Scale
		###

		resetScale: ->

			@_has.s = no

			@_current.sX = 1
			@_current.sY = 1
			@_current.sZ = 1

			@

		getScale: ->

			{
				x: @_current.sX
				y: @_current.sY
				z: @_current.sZ
			}

		setScale: (x, y, z) ->

			@_has.s = no if x is 1 and y is 1 and z is 1

			@_current.sX = x
			@_current.sY = y
			@_current.sZ = z

			@

		setScaleX: (x) ->

			@_has.s = yes if x isnt 1

			@_current.sX = x

			@

		setScaleY: (y) ->

			@_has.s = yes if y isnt 1

			@_current.sY = y

			@

		setScaleZ: (z) ->

			@_has.s = yes if z isnt 1

			@_current.sZ = z

			@

		scale: (x, y, z) ->

			# This *does* work most of the times
			@_has.s = yes if x isnt 1 or y isnt 1 or z isnt 1

			@_current.sX *= x
			@_current.sY *= y
			@_current.sZ *= z

			@

		setScaleAll: (x) ->

			@_has.s = no if x is 1

			@_current.sX = @_current.sY = @_current.sZ = x

			@

		scaleX: (x) ->

			@_has.s = yes if x

			@_current.sX *= x

			@

		scaleY: (y) ->

			@_has.s = yes if y

			@_current.sY *= y

			@

		scaleZ: (z) ->

			@_has.s = yes if z

			@_current.sZ *= z

			@

		###
		Perspective
		###

		setPerspective: (d) ->

			@_current.p = d

			if d
				@_has.p = yes

			@

		###
		Rotation
		###

		resetRotation: ->

			@_has.r = no

			@_current.rX = 0
			@_current.rY = 0
			@_current.rZ = 0

			@

		rotation: ->

			{
				x: @_current.rX
				y: @_current.rY
				z: @_current.rZ
			}

		setRotation: (x, y, z) ->

			@_has.r = no if not x and not y and not z

			@_current.rX = x
			@_current.rY = y
			@_current.rZ = z

			@

		setRotationX: (x) ->

			@_has.r = yes if x

			@_current.rX = x

			@

		setRotationY: (y) ->

			@_has.r = yes if y

			@_current.rY = y

			@

		setRotationZ: (z) ->

			@_has.r = yes if z

			@_current.rZ = z

			@

		rotate: (x, y, z) ->

			# This *does* work most of the times
			@_has.r = yes if x or y or z

			@_current.rX += x
			@_current.rY += y
			@_current.rZ += z

			@

		rotateX: (x) ->

			@_has.r = yes if x

			@_current.rX += x

			@

		rotateY: (y) ->

			@_has.r = yes if y

			@_current.rY += y

			@

		rotateZ: (z) ->

			@_has.r = yes if z

			@_current.rZ += z

			@
		
		###
		Translation
		###

		resetTranslation: ->

			@_has.t = no

			@_current.tX = 0
			@_current.tY = 0
			@_current.tZ = 0

			@

		translation: ->

			{
				x: @_current.tX
				y: @_current.tY
				z: @_current.tZ
			}

		setTranslation: (x, y, z) ->

			@_has.t = no if not x and not y and not z

			@_current.tX = x
			@_current.tY = y
			@_current.tZ = z

			@

		setTranslationX: (x) ->

			@_has.t = yes if x

			@_current.tX = x

			@

		setTranslationY: (y) ->

			@_has.t = yes if y

			@_current.tY = y

			@

		setTranslationZ: (z) ->

			@_has.t = yes if z

			@_current.tZ = z

			@

		translate: (x, y, z) ->

			# This *does* work most of the times
			@_has.t = yes if x or y or z

			@_current.tX += x
			@_current.tY += y
			@_current.tZ += z

			@

		translateX: (x) ->

			@_has.t = yes if x

			@_current.tX += x

			@

		translateY: (y) ->

			@_has.t = yes if y

			@_current.tY += y

			@

		translateZ: (z) ->

			@_has.t = yes if z

			@_current.tZ += z

			@