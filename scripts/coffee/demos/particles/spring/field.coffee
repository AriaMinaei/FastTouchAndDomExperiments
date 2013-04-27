define ['./vector', './particle', 'utility/belt', 'utility/shims'], (Vector, Particle, belt) ->

	_containerEl = document.createElement 'div'
	_containerEl.classList.add 'container'

	class SpringField

		constructor: (@root = document.querySelector 'body', options = {}) ->

			@options = 

				particleMargin: 40

			belt.deepAppend @options, options

			@_fieldSize = new Vector Math.floor(@root.clientWidth / @options.particleMargin),
				Math.floor(@root.clientHeight / @options.particleMargin)

			@_containerCapacity = 600

			@_particles = []

			@_boundFrame = @_frame.bind @

			@_mousePos = new Vector @root.clientWidth / 2, @root.clientHeight / 2

			@_mouseForce = new Vector 0, 0

			do @_prepareParticles

			@_currentParticlesCursor = 0

			@_particlesCount = @_particles.length

			@_maxFrameDuration = 7

			do @_senseMouse

			do @_frame2
			
		_prepareParticles: ->			

			for i in [0...@_fieldSize.x]

				for j in [0...@_fieldSize.y]

					if @_particles.length % @_containerCapacity is 0

						container = @_getContainer()

						@root.appendChild container

					particle = new Particle new Vector (i + 1) * @options.particleMargin, (j + 1) * @options.particleMargin

					container.appendChild particle.el

					@_particles.push particle

		_getContainer: ->
			
			do _containerEl.cloneNode

		_frame: ->

			requestAnimationFrame @_boundFrame

			renderedInThisFrame = 0

			# movement = Math.random() * ( if Math.random() > 0.5 then 2 else -2 )

			started = Date.now()

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

				do particle.continueMove
				
				# particle._moveEl particle.pos.x + movement, particle.pos.y + movement
				
				renderedInThisFrame++

				break if renderedInThisFrame is @_particlesCount

				if renderedInThisFrame % 50 is 0

					break if Date.now() - started > @_maxFrameDuration

		_frame2: ->

			requestAnimationFrame @_boundFrame

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

			do particle.continueMove

		_senseMouse: ->

			document.addEventListener 'mousemove', (e) =>

				@_mousePos.x = e.clientX
				@_mousePos.y = e.clientY
					