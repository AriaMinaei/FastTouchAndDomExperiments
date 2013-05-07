define ['utility/math', 'utility/func'], (math, func) ->

	class Tornado

		constructor: (@pos, @radius = 300, @intensity = -1000, @direction = 1) ->

		applyTo: (particle, currentForceVector) ->

			dx = particle.pos.x - @pos.x
			dy = particle.pos.y - @pos.y
			
			teta = (Math.atan dy / dx) - math.halfPi

			if dx < 0

				teta -= Math.PI

			distance = math.distance @pos.x, @pos.y, particle.pos.x, particle.pos.y

			if distance < @radius

				d = @_curve 1 - distance / @radius

				currentForceVector.x += (@intensity * d * Math.cos teta) + (-@intensity * math.unit(dx) * d / 10)
				currentForceVector.y += (@intensity * d * Math.sin teta) + (-@intensity * math.unit(dy) * d / 10)

			currentForceVector

		_curve: (d) -> d