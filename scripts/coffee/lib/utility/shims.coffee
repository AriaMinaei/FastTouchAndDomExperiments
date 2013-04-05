if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	# RequestAnimationFrame shim. #
	# From https://github.com/soulwire/Coffee-Physics
	do ->

	    time = 0
	    vendors = ['webkit']

	    for vendor in vendors when not window.requestAnimationFrame
	    	
	        window.requestAnimationFrame = window[ vendor + 'RequestAnimationFrame']
	        window.cancelAnimationFrame = window[ vendor + 'CancelAnimationFrame']


	null