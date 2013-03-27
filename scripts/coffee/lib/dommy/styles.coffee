if typeof define isnt 'function' then define = require('amdefine')(module)

define ['dommy/styles/transform'], (DommyStylesTransform) ->

	class DommyStyles

		constructor: (@dommy) ->


		getTransform: (fastId, el) ->

			t = @dommy._get(fastId, 'style.transform')

			unless t

				t = new DommyStylesTransform(@dommy, fastId, el)
				@dommy._set(fastId, 'style.transform', t)
				
			t