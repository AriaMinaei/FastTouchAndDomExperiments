if typeof define isnt 'function' then define = require('amdefine')(module)

define ->
	
	class DommyType

		constructor: (@name) ->

			@events = {}

			@lazies = {}

		# Add an event to the elements of this type
		addEvent: (eventName, listener) ->

			if not @events[eventName]

				@events[eventName] = [listener]
				return @

			@events[eventName].push listener
			return @

		# Returns an array of 'eventName' listeners for elements of this type
		getListeners: (eventName) ->

			forName = @events[eventName]
			return [] unless forName
			forName

		addLazy: (name, initializer) ->

			@lazies[name] = initializer
			return @

		getLazy: (name) ->

			@lazies[name]