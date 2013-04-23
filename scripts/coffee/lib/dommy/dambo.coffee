if typeof define isnt 'function' then define = require('amdefine')(module)

define ['dommy/dambo/type'], (Type)->
	
	class Dambo

		constructor: ->

			@types = {}

		forThe: (name) ->

			if not @types[name]

				@types[name] = new Type name

			@types[name]

	Dambo