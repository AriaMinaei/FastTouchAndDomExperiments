define ->

	class SpringForce

		constructor: (@pos, @intensity = 1000) ->

		applyTo: (particle, currentForceVector) ->

			currentForceVector.x -= (particle.pos.x - @pos.x) *
									@intensity

			currentForceVector.y -= (particle.pos.y - @pos.y) *
									@intensity

			currentForceVector