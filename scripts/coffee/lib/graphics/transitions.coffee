if typeof define isnt 'function' then define = require('amdefine')(module)

define ['native'], ->

	Transitions =
		
		linear: (p) -> p

	Transitions.define = (name, func) ->

		if typeof name is 'object'

			Transitions.define _name, _func for _name, _func of name

			return

		Transitions[name] =

			easeIn: func

			easeOut: (p) -> 1 - func( 1 - p )

			easeInOut: (p) ->

				if p <= 0.5
					return 0.5 * func( p * 2 )
				else
					return 0.5 * ( 2 - func( 2 * (1 - p) ) )
	
	Transitions.define

		quad: 	(p) -> Math.pow p, 2
		
		cubic: 	(p) -> Math.pow p, 3

		quart: 	(p) -> Math.pow p, 4

		quint: 	(p) -> Math.pow p, 5

		expo: 	(p) -> Math.pow 2, 8 * (p - 1)

		circ:	(p) -> 1 - Math.sin Math.cos p

		sine:	(p) -> 1 - Math.cos p * Math.PI / 2

	Transitions