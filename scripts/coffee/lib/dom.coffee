define [], ->
	# Shortcut
	window.$ = (id) ->

		document.getElementById id

	# Shortcut
	window.$$ = (selector) ->

		document.querySelectorAll selector

	# RequestAnimationFrame shim. #
	# From https://github.com/soulwire/Coffee-Physics
	do ->

	    time = 0
	    vendors = ['ms', 'moz', 'webkit']

	    for vendor in vendors when not window.requestAnimationFrame
	        window.requestAnimationFrame = window[ vendor + 'RequestAnimationFrame']
	        window.cancelAnimationFrame = window[ vendor + 'CancelAnimationFrame']