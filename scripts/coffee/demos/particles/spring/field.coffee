define [

	'./vector'		 , 	'./particle'	,

	'./force/spring' , 	'./force/damper', './force/proxy', './force/attractor',

	'./force/tornado',

	'utility/object' , 	'utility/shims'	
	
	], (Vector, Particle, SpringForce, DamperForce, ProxyForce, AttractorForce, TornadoForce, object) ->

	class SpringField

		constructor: (@root = document.querySelector('body'), options = {}) ->

			@options = 

				particleMargin: 60

				forces:

					spring:

						intensity: 55000

					damper:

						intensity: 20

					attractor:

						radius: 100

						intensity: 150

					tornado:

						radius: 100

						intensity: 4000

						direction: 1

			object.overrideOnto options, @options

			@_fieldSize = new Vector Math.floor(@root.clientWidth  / @options.particleMargin),
									 Math.floor(@root.clientHeight / @options.particleMargin)

			do @_prepareMouse			

			do @_prepareParticles

			do @_prepareAnimation

			do @_frame
		
		_prepareMouse: ->

			@_mousePos = new Vector @root.clientWidth  * 2, 
									@root.clientHeight * 2

			@_mouseForce = new ProxyForce new TornadoForce(
				@_mousePos, 
				@options.forces.tornado.radius,
				@options.forces.tornado.intensity,
				@options.forces.tornado.direction
				)

			@_mouseForce = new ProxyForce new AttractorForce(
				@_mousePos, 
				@options.forces.attractor.radius,
				@options.forces.attractor.intensity
				)

			rootPos = @root.getBoundingClientRect()

			document.addEventListener 'mousemove', (e) =>

				@_mousePos.x = e.clientX - rootPos.left
				@_mousePos.y = e.clientY - rootPos.top

		_prepareParticles: ->

			@_damperForce = new DamperForce @options.forces.damper.intensity

			@_particles = []

			# do =>

			# 	pos = new Vector @_fieldSize.x * @options.particleMargin / 2, @_fieldSize.y * @options.particleMargin / 2
				
			# 	particle = new Particle pos
				
			# 	particle.addForce 'spring', new SpringForce pos, @options.forces.spring.intensity
			# 	particle.addForce 'damper', @_damperForce
			# 	particle.addForce 'mouse', @_mouseForce

			# 	@root.appendChild particle.el

			# 	@_particles.push particle

			# return

			for i in [0...@_fieldSize.x]

				for j in [0...@_fieldSize.y]

					do =>

						pos = new Vector i * @options.particleMargin, j * @options.particleMargin
						
						particle = new Particle pos
						
						particle.addForce 'spring', new SpringForce pos, @options.forces.spring.intensity
						particle.addForce 'damper', @_damperForce
						particle.addForce 'mouse', @_mouseForce

						@root.appendChild particle.el

						@_particles.push particle

		_prepareAnimation: ->

			@_boundFrame = @_frame.bind @

			@_currentParticlesCursor = 0

			@_particlesCount = @_particles.length

			@_maxFrameDuration = 7

			@_lastFrameTime = 0

		_frame: (t) ->

			requestAnimationFrame @_boundFrame

			renderedInThisFrame = 0

			if not t

				@_lastFrameTime = 0

				dt = 0.016

			else

				dt = (t - @_lastFrameTime) / 1000

				@_lastFrameTime = t

			started = Date.now()

			loop

				@_currentParticlesCursor++

				if @_currentParticlesCursor is @_particlesCount

					@_currentParticlesCursor = 0

				@_particles[@_currentParticlesCursor].continueMove dt

				renderedInThisFrame++

				break if renderedInThisFrame is @_particlesCount

				# if renderedInThisFrame % 50 is 0

				# 	break if Date.now() - started > @_maxFrameDuration