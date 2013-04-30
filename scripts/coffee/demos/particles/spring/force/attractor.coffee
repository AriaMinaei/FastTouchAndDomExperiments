define ['utility/math'], (math) ->

	class Attractor

		constructor: (@pos, @radius = 300, @intensity = -1000) ->

		applyTo: (particle, currentForceVector) ->

			dx = math.unit @pos.x - particle.pos.x
			dy = math.unit @pos.y - particle.pos.y

			distance = math.distance @pos.x, @pos.y, particle.pos.x, particle.pos.y

			if distance < @radius

				d = @_curve 1 - distance / @radius

				currentForceVector.x += @intensity * dx * d
				currentForceVector.y += @intensity * dy * d

				# currentForceVector.x += 500000				
				# currentForceVector.y -= 500000

			currentForceVector

		_curve: (d) -> d * d