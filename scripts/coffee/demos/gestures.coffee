define ['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy'], (dr, GestureHandler, Dambo, Dommy) ->
	window.dambo = new Dambo
	window.dommy = new Dommy
	# Instantiate a new GestureHandler
	# We only assign it to the topmost element, and it'll delegate
	# the events to the descendants.
	g = new GestureHandler document

	# Start listening for events
	g.listen()

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
						transforms[id] = t = dommy.styles.getTransform id, el

					else t = transforms[id]

					# Get a temporary transformation matrix handler,
					t.temporarily()

						# then scale,
						.scale(e.scale, e.scale, 1)
						# and translate it.
						.move(e.translateX, e.translateY, 0)

					# Apply the temp transformation matrix to the element
					t.applyTo el

				.addEvent 'transform-instant:finish', (e, id, el) ->

					# Commit the temp transformation as the current transformation.
					# This way, the next time the user touches the element, the transformation
					# will pick up from where we left it off.
					do transforms[id].commit

					# Remove reference to transformation handler
					transforms[id] = null if transforms[id]

				# listen to 'move-instant', for all elements of 'babs' type
				.addEvent 'move-instant', (e, id, el) ->
					
					# If we don't have a reference to this element's transform handler
					unless transforms[id]
						# Get one
						transforms[id] = t = dommy.styles.getTransform id, el

					else t = transforms[id]

					# Get a temporary transformation matrix handler
					t.temporarily()
						# Set its rotation (not finished for now)
						# ._setRotationY(e.translateX * Math.PI / 720)
						# 
						# Translate it
						.move e.translateX, e.translateY, 0

					# Apply the temp transformation matrix to the element
					t.applyTo el

				# When move-instant-end fires
				.addEvent 'move-instant:finish', (e, id, el) ->
					
					# console.log 'received move-instant-end event for', e

					# Commit the temp transformation as the current transformation.
					# This way, the next time the user touches the element, the transformation
					# will pick up from where we left it off.
					do transforms[id].commit

					# Remove reference to transformation handler
					transforms[id] = null if transforms[id]