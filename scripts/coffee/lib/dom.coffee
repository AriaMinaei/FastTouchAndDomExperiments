define [], ->
	# Shortcut
	window.$ = (id) ->
		document.getElementById id

	# Shortcut
	window.$$ = (selector) ->
		document.querySelectorAll selector

	# requestAnimationFrame
	unless window.requestAnimationFrame
		window.requestAnimationFrame = do ->
			return  window.webkitRequestAnimationFrame 	||
			window.mozRequestAnimationFrame				||
			# window.oRequestAnimationFrame				||  :(
			window.msRequestAnimationFrame 				||
			(callback, el) -> window.setTimeout(callback, 16)

	# Shortcut to html element
	window.html = document.getElementsByTagName('html')[0]