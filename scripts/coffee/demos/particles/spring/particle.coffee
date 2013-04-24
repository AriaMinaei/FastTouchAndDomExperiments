define ['./vector', './transform'], (Vector, Transform)->

	class Particle

		constructor: (@initPos)->

			@el = document.createElement 'div'

			@el.classList.add 'particle'

			@transform = new Transform @el
			
			@gotoPos @initPos

			@m = 50

			# @_lastT = 0

			@pos = new Vector @initPos.x, @initPos.y

			@v = new Vector 0, 0

			@force = new Vector 0, 0

			@springForce = new Vector 0, 0

			@damperForce = new Vector 0, 0

			@t0 = Date.now()

			@lastPos = @initPos


		gotoPos: (pos)->

			@transform.toState pos

		# Returns dx
		_integrate: (ax, ay) ->

			# Euler's Integrator
			# dt = (Date.now() - @t0)/1000
			

			# if dt is 0 
			dt = .5

			@pos.x = .5 * ax * Math.pow(dt, 2) + @v.x * dt + @pos.x
			@pos.y = .5 * (ay) * Math.pow(dt, 2) + @v.y * dt + @pos.y

			@v.x = ax * dt + @v.x
			@v.y = (ay) * dt+ @v.y

			@pos

		applyForces: (forces...) ->

			for force in forces

				@force.x += force.x
				@force.y += force.y

		continueMove: ->

			@springForce.x = @pos.x - @initPos.x
			@springForce.y = @pos.y - @initPos.y

			@damperForce.x = 2 * @v.x
			@damperForce.y = 2 * @v.y

			nextPos = @gotoPos @_integrate((@force.x - @springForce.x - @damperForce.x) / @m, (@force.y - @springForce.y - @damperForce.y) / @m)

			@force.x = 0
			@force.y = 0

