define ['./vector', 'visuals/lightmatrix'], (Vector, LightMatrix)->

	class Particle

		constructor: (@initPos) ->

			@el = document.createElement 'div'

			@el.classList.add 'particle'

			@_transformMatrix = new LightMatrix

			@m = 50

			@pos = new Vector @initPos.x, @initPos.y

			@v = new Vector 0, 0

			@_forces = {}

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

			@_forces[name] = force

			@

		_getForceVector: ->

			@_forceVector.x = 0
			@_forceVector.y = 0

			@_forces[name].applyTo(@, @_forceVector) for name of @_forces

			@_forceVector

		continueMove: (dt) ->

			forceVector = @_getForceVector()

			aX = forceVector.x / @m
			nextX = @_integrateD aX, dt, @v.x, @pos.x
			@v.x = @_integrateV aX, dt, @v.x

			aY = forceVector.y / @m
			nextY = @_integrateD aY, dt, @v.y, @pos.y
			@v.y = @_integrateV aY, dt, @v.y

			@_gotoPos nextX, nextY