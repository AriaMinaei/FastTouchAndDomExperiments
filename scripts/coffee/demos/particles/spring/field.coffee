define ['./vector', './particle', 'utility/shims'], (Vector, Particle) ->

	_containerEl = document.createElement 'div'
	_containerEl.classList.add 'container'

	class SpringField

		constructor: (@root = document.querySelector 'body') ->

			@_fieldSize = new Vector 40, 40

			@_containerCapacity = 1600

			@_particleMargin = new Vector window.innerWidth / @_fieldSize.x,
				window.innerHeight / @_fieldSize.y

			@_particles = []

			@_boundFrame = @_frame.bind @

			@_mousePos = new Vector @_particleMargin.x * @_fieldSize.x / 2, @_particleMargin.y * @_fieldSize.y / 2

			@_mouseForce = new Vector 0, 0

			# Particles to render per frame
			@_ppf = 1600

			@_currentParticlesCursor = 0
			
			do @_prepareParticles

			@_particlesCount = @_particles.length

			do @_senseMouse

			do @_frame
			
		_prepareParticles: ->			

			for i in [0...@_fieldSize.x]

				for j in [0...@_fieldSize.y]

					if @_particles.length % @_containerCapacity is 0

						container = @_getContainer()

						@root.appendChild container

					particle = new Particle new Vector (j + 1) * @_particleMargin.x, (i + 1) * @_particleMargin.y

					container.appendChild particle.el

					@_particles.push particle

		_getContainer: ->
			
			do _containerEl.cloneNode

		_frame: ->

			renderedInThisFrame = 0

			loop


				@_currentParticlesCursor++

				if @_currentParticlesCursor is @_particlesCount

					@_currentParticlesCursor = 0

				particle = @_particles[@_currentParticlesCursor]

				dx = @_mousePos.x - particle.pos.x
				dy = @_mousePos.y - particle.pos.y

				if Math.pow(dx, 2) + Math.pow(dy, 2) < 16000

					@_mouseForce.x = -10 * dx
					@_mouseForce.y = -10 * dy

					particle.applyForce @_mouseForce 

				renderedInThisFrame++ if do particle.continueMove

				break if renderedInThisFrame is @_ppf or renderedInThisFrame is @_particlesCount

			requestAnimationFrame @_boundFrame

		_senseMouse: ->

			document.addEventListener 'mousemove', (e) =>

				@_mousePos.x = e.clientX
				@_mousePos.y = e.clientY
					