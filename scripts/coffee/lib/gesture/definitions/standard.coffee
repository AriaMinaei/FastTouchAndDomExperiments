if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./standard/tap', './standard/hold', './standard/move', './standard/transform'], (tap, hold, move, transform) ->

	return (defineGesture) ->

		# define all standard gestures
		tap defineGesture
		hold defineGesture
		move defineGesture
		transform defineGesture

