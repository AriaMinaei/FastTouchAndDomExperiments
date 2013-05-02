define ['utility/math'], (math) ->

	class Attractor

		constructor: (@pos, @radius = 300, @intensity = -1000) ->

		applyTo: (particle, currentForceVector) ->

			# dx = math.unit @pos.x - particle.pos.x
			# dy = math.unit @pos.y - particle.pos.y

			# distance = math.distance @pos.x, @pos.y, particle.pos.x, particle.pos.y

			# if distance < @radius

			# 	d = @_curve 1 - distance / @radius

			# 	# currentForceVector.x += @intensity * dx * d
			# 	# currentForceVector.y += @intensity * dy * d
				
			# 	currentForceVector.x += (Math.random() - 0.5) * 100000
			# 	currentForceVector.y += (Math.random() - 0.5) * 100000

			# currentForceVector
			

			dx = particle.pos.x - @pos.x
			dy = particle.pos.y - @pos.y
			
			teta = (Math.atan dy / dx)

			if dx < 0

				teta -= Math.PI

			distance = math.distance @pos.x, @pos.y, particle.pos.x, particle.pos.y

			if distance < @radius

				d = @_curve 1 - distance / @radius

				currentForceVector.x += (@intensity * d * Math.cos teta) + (-@intensity * math.unit(dx) * d / 10)
				currentForceVector.y += (@intensity * d * Math.sin teta) + (-@intensity * math.unit(dy) * d / 10)

			currentForceVector

		_curve: (d) -> d * d