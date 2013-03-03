require ['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy'], (dr, GestureHandler, Dambo, Dommy) ->
	window.dambo = new Dambo
	window.dommy = new Dommy
	# Instantiate a new GestureHandler
	# We only assign it to the topmost element, and it'll delegate
	# the events to the descendants.
	g = new GestureHandler document

	# Start listening for events
	g.listen()

	# for debugging
	window.g = g
	dr ->
		# Wrap around an anonymous function
		do ->
			# holds refrences to transform handler objects for each element
			transforms = {}

			dambo.forThe('babs')
				.addEvent 'transform-instant', (e, id, el) ->
					# If we don't have a reference to this element's transform handler
					unless transforms[id]
						# Get one
						transforms[id] = t = dommy.styles.getTransform(id, el)
					else t = transforms[id]

					# Get a temporary transformation matrix handler,
					t.temporarily()
						# then scale,
						._scale(e.scale, e.scale, 1)
						# and translate it.
						.translate(e.translateX, e.translateY, 0)

					# Apply the temp transformation matrix to the element
					t.apply(el)

				.addEvent 'transform-instant:finish', (e, id, el) ->
					# Commit the temp transformation as the current transformation.
					# This way, the next time the user touches the element, the transformation
					# will pick up from where we left it off.
					transforms[id].commit(el)

					# Remove reference to transformation handler
					transforms[id] = null if transforms[id]

				# listen to 'move-instant', for all elements of 'babs' type
				.addEvent 'move-instant', (e, id, el) ->
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

				# When move-instant-end fires
				.addEvent 'move-instant:finish', (e, id, el) ->
					# console.log 'received move-instant-end event for', e

					# Commit the temp transformation as the current transformation.
					# This way, the next time the user touches the element, the transformation
					# will pick up from where we left it off.
					transforms[id].commit(el)

					# Remove reference to transformation handler
					transforms[id] = null if transforms[id]

					# Btw, the rotation doesn't work the way the user intents,
					# since the FastMatrix class isn't finished yet.



		# To quickly benchmark different possible approaches on stuff
		# do ->
		# 	suite = new Benchmark.Suite

		# 	suite.add 'case1', ->
				

		# 	suite.add 'case2', ->

		# 	suite.on 'cycle', (e) ->
		# 		console.log String(e.target)

		# 	suite.on 'complete', ->
		# 		console.log 'Fastest:', this

		# 	window.run = ->
		# 		suite.run
		# 			async: true

		# 		return null
		
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

