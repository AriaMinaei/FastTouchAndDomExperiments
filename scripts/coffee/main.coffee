root = @
document.addEventListener "DOMContentLoaded", ->
	g = new GestureHandler document

	dommy.addEvent 'babs', 'tap', (e, id, el) ->
		console.log 'received tap event for', el

	dommy.addEvent 'babs', 'hold', (e, id, el) ->
		console.log 'received hold event for', el
	
	g.listen()
	root.g = g

	# alert('here1')