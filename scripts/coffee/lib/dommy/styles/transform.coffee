if typeof define isnt 'function' then define = require('amdefine')(module)

define ['graphics/lightmatrix'], (LightMatrix) ->

	console.log LightMatrix

	class Transform extends LightMatrix

		constructor: (@dommy, @id, el) ->

			super

		applyTo: (el) ->

			console.log @toCss()

			el.style.webkitTransform = @toCss()

			@