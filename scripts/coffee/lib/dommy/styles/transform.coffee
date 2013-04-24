if typeof define isnt 'function' then define = require('amdefine')(module)

define ['../../visuals/lightmatrix'], (LightMatrix) ->

	class Transform extends LightMatrix

		constructor: (@dommy, @id, el) ->

			super

		applyTo: (el) ->

			el.style.webkitTransform = @toCss()

			@