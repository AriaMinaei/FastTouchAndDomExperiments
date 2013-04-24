define ['./vector', './particle'], (Vector, Particle) ->

	class SpringField

		constructor: (@root = document.querySelector 'body') ->

			@_fieldSize = new Vector 40, 40

			@_particleMargin = 

				x: (window.innerWidth - window.innerWidth / @_fieldSize.x) / @_fieldSize.x
				y: (window.innerHeight - window.innerHeight / @_fieldSize.y) / @_fieldSize.y

			@_particles = []

			@_boundFrame = @_frame.bind @
			
			do @_prepareParticles

			do @_senseMouse

			do @_frame
			
		_prepareParticles: ->

			for i in [0...@_fieldSize.x]

				for j in [0...@_fieldSize.y]

					particle = new Particle new Vector (j + 1) * @_particleMargin.x, (i + 1) * @_particleMargin.y

					@root.appendChild particle.el

					@_particles.push particle

		_frame: ->

			for particle in @_particles

				do particle.continueMove

			webkitRequestAnimationFrame @_boundFrame

		_senseMouse: ->

			document.addEventListener 'mousemove', (e) =>

				x = e.clientX
				y = e.clientY

				for particle in @_particles

					# do all that
					dx = x - particle.pos.x
					dy = y - particle.pos.y

					if Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < 50

						particle.applyForces new Vector -10 * dx, -10 * dy