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

			constructor: () ->

				@_main = emptyStack()
				@_temp = emptyStack()

				@_current = @_main

				@_has = 

					movement: no

					perspective: no

					rotation: no

					scale: no

					translation: no


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

				soFar = Base.identity()

				# movement
				if @_has.m

					soFar = Translation.matrix @_current.mX, @_current.mY, @_current.mZ

				# scale
				if @_has.s

					soFar = Scale.applyTo soFar, @_current.sX, @_current.sY, @_current.sZ

				# perspectove
				if @_has.p

					soFar = Perspective.applyTo soFar, @_current.p

				# rotation
				if @_has.r

					soFar = Rotation.applyTo soFar, @_current.rX, @_current.rY, @_current.rZ

				# translation
				if @_has.t

					soFar = Translation.applyTo soFar, @_current.tX, @_current.tY, @_current.tZ

				soFar

			rotation: ->

				{
					x: @_current.rX
					y: @_current.rY
					z: @_current.rZ
				}

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


			translate: (x, y, z) ->

				@_current.tX += x
				@_current.tY += y
				@_current.tZ += z

				@_has.t = yes

				@

			move: (x, y, z) ->

				@_current.mX += x
				@_current.mY += y
				@_current.mZ += z

				@_has.m = yes

				@

			scale: (x, y, z) ->

				@_current.sX *= x
				@_current.sY *= y
				@_current.sZ *= z

				@_has.s = yes

				@

			setPerspective: (d) ->

				@_current.p = d

				if d
					@_has.p = yes

				@