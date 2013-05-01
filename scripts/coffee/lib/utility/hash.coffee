if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./array'], (array) ->

	class Hash

		constructor: ->

			# Knows which index is this name stored in
			@_indexes = {}

			# The simple key/value pair
			@_pairs = {}

			# The plain array that holds all the values
			@array = []

			# Number of elements
			@_len = 0

		set: (name, value) ->

			if @_indexes[name] is undefined

				@_pairs[name] = value
				@array.push value

				index = @array.length - 1

				@_indexes[name] = index

			else

				@_pairs[name] = value

				@array[@_indexes[name]] = value

			@_len++

			@

		get: (name) ->

			@_pairs[name]

		each: (func) ->

			i = 0

			loop

				func i, @array[i]

				i++

				break if i is @_len

			null

		remove: (name) ->

			return @ if @_indexes[name] is undefined

			@_len--

			@_pairs[name] = undefined

			index = @_indexes[name]

			array.pluck @array, index

			@_indexes[name] = undefined

			for name, value of @_indexes

				continue if value is undefined

				if value > index

					@_indexes[name] = value - 1

			@