								
define ['../../../../js/demos/particles/spring/field', 'domReady'], (SpringField, domReady) ->
	
	domReady ->

		field = new SpringField document.querySelector('.field'), 

			particleMargin: 60

			forces:

				spring:

					intensity: 0

				damper:

					intensity: 100

				mouse:

					radius: 300

					intensity: -92000

