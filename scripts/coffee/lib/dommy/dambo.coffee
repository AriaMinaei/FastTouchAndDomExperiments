define ['dommy/dambo/type'], (type)->
	class Dambo
		constructor: ->
			@types = {}

		forThe: (name) ->
			if not @types[name]
				@types[name] = new type(name)

			@types[name]

	Dambo