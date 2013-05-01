if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	math =

		square: (n) ->

			n * n

		distance: (x1, y1, x2, y2) ->

			Math.sqrt math.square(x2 - x1) + math.square(y2 - y1) 
		
		limit: (n, from, to) ->

			return to if n > to
			return from if n < from
			return n

		unit: (n) ->

			return -1 if n < 0
			return 1

		halfPi: Math.PI / 2
	