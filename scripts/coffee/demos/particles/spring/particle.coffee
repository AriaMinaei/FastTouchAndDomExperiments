define ['./vector', 'visuals/lightmatrix'], (Vector, LightMatrix)->

	class Particle

		constructor: (@initPos) ->

			@el = document.createElement 'div'

			@el.classList.add 'particle'

			@_transformMatrix = new LightMatrix

			@m = 50

			# @_lastT = 0

			@pos = new Vector @initPos.x, @initPos.y

			@v = new Vector 0, 0

			@_externalForces = new Vector 0, 0

			@_springForce = new Vector 0, 0

			@_damperForce = new Vector 0, 0

			@_t0 = Date.now()

			@_appliedPos = new Vector 0, 0

			@_moveEl @initPos.x, @initPos.y

		_gotoPos: (nextX, nextY) ->

			moved = false

			if Math.abs(Math.abs(nextX) - Math.abs(@_appliedPos.x)) > 0.99 or Math.abs(Math.abs(nextY) - Math.abs(@_appliedPos.y)) > 0.99

				@_moveEl nextX, nextY

				moved = true

			@pos.x = nextX
			@pos.y = nextY

			moved

		_moveEl: (nextX, nextY) ->

			@_appliedPos.x = nextX
			@_appliedPos.y = nextY

			@_transformMatrix.setMovement nextX, nextY, 0

			@el.style.webkitTransform = @_transformMatrix.toCss()

		# Returns dx
		# _integrate: (ax, ay) ->

		# 	# Euler's Integrator
		# 	# dt = (Date.now() - @_t0)/1000
			

		# 	# if dt is 0 
		# 	dt = .5

		# 	@pos.x = .5 * ax * Math.pow(dt, 2) + @v.x * dt + @pos.x
		# 	@pos.y = .5 * (ay) * Math.pow(dt, 2) + @v.y * dt + @pos.y

		# 	@v.x = ax * dt + @v.x
		# 	@v.y = (ay) * dt+ @v.y

		# 	@pos

		_integrateD: (a, dt, v0, d0) ->

			a / 2 * Math.pow(dt, 2) + v0 * dt + d0

		_integrateV: (a, dt, v0) ->

			a * dt + v0

		applyForces: (forces...) ->

			for force in forces

				@_externalForces.x += force.x
				@_externalForces.y += force.y

		applyForce: (force) ->

			@_externalForces.x += force.x
			@_externalForces.y += force.y

		continueMove: ->

			@_springForce.x = @pos.x - @initPos.x
			@_springForce.y = @pos.y - @initPos.y

			@_damperForce.x = 2 * @v.x
			@_damperForce.y = 2 * @v.y

			dt = 0.5

			aX = (@_externalForces.x - @_springForce.x - @_damperForce.x) / @m
			nextX = @_integrateD aX, dt, @v.x, @pos.x
			@v.x = @_integrateV aX, dt, @v.x

			aY = (@_externalForces.y - @_springForce.y - @_damperForce.y) / @m
			nextY = @_integrateD aY, dt, @v.y, @pos.y
			@v.y = @_integrateV aY, dt, @v.y

			# nextPos = @_gotoPos @_integrate((@_externalForces.x - @_springForce.x - @_damperForce.x) / @m, (@_externalForces.y - @_springForce.y - @_damperForce.y) / @m)

			@_externalForces.x = 0
			@_externalForces.y = 0

			@_gotoPos nextX, nextY

