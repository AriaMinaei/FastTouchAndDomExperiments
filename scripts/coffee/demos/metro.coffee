require ['domReady', 'gesture/handler', 'dommy/dommy'], (dr, GestureHandler, Dommy) ->
	window.dommy = new Dommy
	dr ->
		