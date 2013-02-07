# Hold a reference to window
root = @
document.addEventListener "DOMContentLoaded", ->
	# Instantiate a new GestureHandler
	# We only assign it to the topmost element, and it'll delegate
	# the events to the descendants.
	g = new GestureHandler html

	# Start listening for events
	g.listen()

	# for debugging
	root.g = g

	# Wrap around an anonymous function
	do ->
		# holds refrences to transform handler objects for each element
		transforms = {}

		# listen to 'instantmove', for all elements of 'babs' type
		dommy.addEvent 'babs', 'instantmove', (e, id, el) ->
			# If we don't have a reference to this element's transform handler
			unless transforms[id]
				# Get one
				transforms[id] = t = dommy.styles.getTransform(id, el)
			else t = transforms[id]

			# Get a temporary transformation matrix handler
			t.temporarily()
				# Set its rotation (not finished for now)
				# ._setRotationY(e.translateX * Math.PI / 720)
				# 
				# Translate it
				.translate(e.translateX, e.translateY, 0)

			# Apply the temp transformation matrix to the element
			t.apply(el)

		# When instantmove-end fires
		dommy.addEvent 'babs', 'instantmove-end', (e, id, el) ->
			# Log it (cause I think it doesn't fire properly sometimes)
			console.log 'received instantmove-end event for', e

			# Commit the temp transformation as the current transformation.
			# This way, the next time the user touches the element, the transformation
			# will pick up from where we left it off.
			transforms[id].commit(el)

			# Remove reference to transformation handler
			transforms[id] = null if transforms[id]

			# Btw, the rotation doesn't work the way the user intents,
			# since the FastMatrix class isn't finished yet.


	# All of that above, compared to this one below, gives the same
	# performance on my iOS6 iPad3, so I guess the architecture isn't too bad.
	# 
	# el = document.querySelectorAll('.two.alone')[0]
	# document.addEventListener 'touchmove', (e) ->
	# 	e.stop()
	# 	el.style.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + parseInt(e.touches[0].clientX - 300) + ', ' + parseInt(e.touches[0].clientY - 300) + ', 0, 1)'
	
	# This is to test Graphics.FastMatrix, since its not ready yet.
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