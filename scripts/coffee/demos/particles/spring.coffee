								
define ['../../../../js/demos/particles/spring/field', 'domReady'], (SpringField, domReady) ->
	
	domReady ->

		field = new SpringField document.querySelector('.field'), 

			particleMargin: 70

			forces:

				spring:

					intensity: 8000

				damper:

					intensity: 800

				attractor:

					radius: 300

					intensity: -9200000

				tornado:

					radius: 1000

					intensity: 900000

					direction: 1

