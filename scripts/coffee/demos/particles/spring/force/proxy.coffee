define ->

	class ProxyForce

		constructor: (@force) ->

		applyTo: (particle, currentForceVector) ->

			@force.applyTo particle, currentForceVector