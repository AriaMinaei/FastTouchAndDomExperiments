if typeof define isnt 'function' then define = require('amdefine')(module)

define ['dommy/styles/transform'], (Transform) ->

	class Styles

		constructor: (@dommy) ->

		getTransform: (id, el) ->

			transform = @dommy.get id, '_style.transform'

			unless transform

				transform = new Transform @dommy, id, el

				@dommy.get(id, '_style.transform', transform)
				
			transform