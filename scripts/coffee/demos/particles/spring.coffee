								
define ['../../../../js/demos/particles/spring/field', 'domReady'], (SpringField, domReady) ->
	
	domReady ->

		field = new SpringField document.querySelector '.field'