root = @
document.addEventListener "DOMContentLoaded", ->
	g = new GestureHandler html

	# dommy.addEvent 'babs', 'tap', (e, id, el) ->
	# 	console.log 'received tap event for', el

	# dommy.addEvent 'babs', 'hold', (e, id, el) ->
	# 	console.log 'received hold event for', el

	do ->
		
		transforms = {}
		rafactive = false
		raf = null
		rafdo = ->
		dommy.addEvent 'babs', 'instantmove', (e, id, el) ->
			unless transforms[id]
				transforms[id] = t = dommy.styles.getTransform(id, el)
			else t = transforms[id]
			t.temporarily()._setRotationY(e.translateX * Math.PI / 720).translate(e.translateX, e.translateY, 0)

			t.apply(el)

		dommy.addEvent 'babs', 'instantmove-end', (e, id, el) ->
			console.log 'received instantmove-end event for', e

			transforms[id].commit(el)
			transforms[id] = null if transforms[id]


	g.listen()
	root.g = g
	
	# All of that above, compared to this one below, gives the same
	# performance on my iOS 6 iPad3, so I guess the architecture isn't too bad
	# el = document.querySelectorAll('.two.alone')[0]
	# document.addEventListener 'touchmove', (e) ->
	# 	e.stop()
	# 	el.style.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + parseInt(e.touches[0].clientX - 300) + ', ' + parseInt(e.touches[0].clientY - 300) + ', 0, 1)'
	




























	# window.t = 
	# 	el: null
	# 	m: new Graphics.FastMatrix
	# 	default: ->
	# 		@fromEl(document.querySelectorAll('.two.extra')[0])
	# 		@
	# 	fromEl: (@el) ->
	# 		@m.fromString getComputedStyle(@el).webkitTransform
	# 		@
	# 	apply: ->
	# 		@el.style.webkitTransform = @m.toString()
	# 		@

	# t.default()

	# window.m = t.m

	# setInterval ->
	# 	t.apply()
	# , 1000

	# # m._setRotation(Math.PI / 4, 0, 0)
	# m._setRotationZ(Math.PI / 4)
	# console.log 'm', m.toString()

	# console.log 'w', getComputedStyle(document.querySelectorAll('.two.alone')[0]).webkitTransform