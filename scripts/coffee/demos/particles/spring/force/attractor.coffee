define ['utility/math'], (math) ->

	class Attractor

		constructor: (@pos, @radius = 300, @intensity = -1000) ->

		applyTo: (particle, currentForceVector) ->

			dx = math.unit @pos.x - particle.pos.x
			dy = math.unit @pos.y - particle.pos.y

			distance = math.distance particle.pos.x, particle.pos.y, @pos.x, @pos.y

			if distance < @radius

				d = 1 - @_curve distance / @radius

				currentForceVector.x += @intensity * dx *  d
				currentForceVector.y += @intensity * dy *  d

			currentForceVector

		_curve: (d) -> d * d