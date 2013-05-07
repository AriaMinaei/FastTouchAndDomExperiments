define ['./vector', 'visuals/lightmatrix', 'utility/hash'], (Vector, LightMatrix, Hash)->

	class Particle

		constructor: (@initPos) ->

			@el = document.createElement 'div'

			@el.classList.add 'particle'

			@_transformMatrix = new LightMatrix

			@m = 50

			@pos = new Vector @initPos.x, @initPos.y

			@v = new Vector 0, 0

			@_forces = new Hash

			@_forceVector = new Vector 0, 0

			@_t0 = Date.now()

			@_appliedPos = new Vector 0, 0

			@_moveEl @initPos.x, @initPos.y

		_gotoPos: (nextX, nextY) ->

			moved = no

			@pos.x = nextX
			@pos.y = nextY

			if Math.abs(Math.abs(nextX) - Math.abs(@_appliedPos.x)) > 0.5 or
			   Math.abs(Math.abs(nextY) - Math.abs(@_appliedPos.y)) > 0.5

				@_moveEl nextX, nextY

				moved = yes

			v = Math.max Math.abs(@v.x), Math.abs(@v.y)

			max = 50

			if v < max

				@el.style.opacity = Math.max v / max, 0.1

			else

				@el.style.opacity = 1

			moved

		_moveEl: (nextX, nextY) ->

			@_appliedPos.x = nextX
			@_appliedPos.y = nextY

			@_transformMatrix.setMovement nextX, nextY, 0

			@el.style.webkitTransform = @_transformMatrix.toCss()

		_integrateD: (a, dt, v0, d0) ->

			a / 2 * Math.pow(dt, 2) + v0 * dt + d0

		_integrateV: (a, dt, v0) ->

			a * dt + v0

		addForce: (name, force) ->

			@_forces.set name, force

			@

		_getForceVector: ->

			@_forceVector.x = 0
			@_forceVector.y = 0

			force.applyTo(@, @_forceVector) for force in @_forces.array

			@_forceVector

		_getForceVector2: ->

			@_forceVector.x = 0
			@_forceVector.y = 0

			@_forces._pairs[name].applyTo(@, @_forceVector) for name of @_forces._pairs

			@_forceVector

		continueMove: (dt) ->

			forceVector = @_getForceVector2()

			aX = forceVector.x / @m
			nextX = @_integrateD aX, dt, @v.x, @pos.x
			@v.x = @_integrateV aX, dt, @v.x

			aY = forceVector.y / @m
			nextY = @_integrateD aY, dt, @v.y, @pos.y
			@v.y = @_integrateV aY, dt, @v.y

			@_gotoPos nextX, nextY