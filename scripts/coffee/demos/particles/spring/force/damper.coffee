define ->

	class DamperForce

		constructor: (@intensity = 20) ->

		applyTo: (particle, currentForceVector) ->

			currentForceVector.x -= particle.v.x * @intensity

			currentForceVector.y -= particle.v.y * @intensity

			currentForceVector