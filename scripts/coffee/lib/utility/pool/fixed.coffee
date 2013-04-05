if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class FixedPool

		constructor: (size) ->

			@size = size | 0

			if @size <= 0

				throw new Error "FixedPool's size must be an integer greater than zero."

			@_current = 0

			@_pool = []

			@_filled = no

		_create: -> {}

		_reset: (item) ->

			for key of item

				delete item[key]

			item

		get: ->

			if @_filled

				item = @_pool[@_current]

				@_reset item

				@_current++

				@_current = 0 if @_current is @size

			else

				item = @_create()

				@_pool.push item

				@_current++

				if @_current is @size

					@_current = 0

					@_filled = yes

			item


