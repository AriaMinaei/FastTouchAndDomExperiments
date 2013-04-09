if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./easing'], (Easing) ->

	class Tween

		constructor: (@from, @to, @duration, @curve = Easing.linear) ->

			@start = 0

		on: (t) ->

			( @to - @from ) * @curve( ( t - @start ) / @duration ) + @from

		frame: ->

			@on Date.now()

		startsAt: (@start) ->