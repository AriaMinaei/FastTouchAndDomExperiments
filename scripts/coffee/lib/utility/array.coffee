if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	array = 

		pluck: (a, i) ->

			for value, index in a

				if index > i
					a[index - 1] = a[index]

			a.length = a.length - 1

			a