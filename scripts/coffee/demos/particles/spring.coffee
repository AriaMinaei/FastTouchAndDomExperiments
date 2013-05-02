								
define ['../../../../js/demos/particles/spring/field', 'domReady'], (SpringField, domReady) ->
	
	domReady ->

		field = new SpringField document.querySelector('.field'), 

			particleMargin: 80

			forces:

				spring:

					intensity: 8000

				damper:

					intensity: 500

				attractor:

					radius: 500

					intensity: 920000

				tornado:

					radius: 1500

					intensity: 900000

					direction: 1

