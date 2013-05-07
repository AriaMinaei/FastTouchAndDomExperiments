define ['../../../../js/demos/particles/spring/field', 'domReady'], (SpringField, domReady) ->
	
	domReady ->

		field = new SpringField document.querySelector('.field'), 

			particleMargin: 80

			forces:

				spring:

					intensity: 20000

				damper:

					intensity: 3000

				attractor:

					radius: 15000

					intensity: 420000

				# tornado:

				# 	radius: 100000

				# 	intensity: 300000

				# 	direction: 1