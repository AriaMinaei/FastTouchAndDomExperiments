define ['utility/math'], (math) ->

	class Tornado

		constructor: (@pos, @radius = 300, @intensity = -1000, @direction = 1) ->

		applyTo: (particle, currentForceVector) ->

			dx = particle.pos.x - @pos.x
			dy = particle.pos.y - @pos.y


			tan = -(dy / dx)
			cot = 1 / tan

			distance = math.distance @pos.x, @pos.y, particle.pos.x, particle.pos.y

			if distance < @radius

				# console.log dx, dy
				# d = @_curve 1 - distance / @radius

				currentForceVector.x += @intensity * tan #- math.unit(dx) * 10 * 0 / d )
				currentForceVector.y += @intensity * cot #- math.unit(dy) * 10 * 0 / d )

			currentForceVector

		_curve: (d) -> d * d