								
define ['../../../../js/demos/particles/spring/field', 'domReady'], (SpringField, domReady) ->
	
	domReady ->

		field = new SpringField document.querySelector('.field'), 

			particleMargin: 60

			forces:

				spring:

					intensity: 80000

				damper:

					intensity: 700

				mouse:

					radius: 100

					intensity: 150000

