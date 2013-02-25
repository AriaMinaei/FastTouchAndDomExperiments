define ['./move/instant', './move/persistent'], (setupInstant, setupPersistent) ->

	return (defineGesture) ->

		# Move gesture, waits to see if the user really intends a one-finger move gesture.
		# If the user immediately starts with more than one finger, 'move' won't capture.
		defineGesture

			name: 'move'
			
			check: (h) ->

				if not h.hadRealMove
					if h.starts is 1 then return 0 
					else return -1

				return 1
			
			init: (h) ->

				@_initOnEvent h, h.lastEvents.move

			_initOnEvent: (h, e) ->

				# Hold the starting position
				h.vars.startX = e.touches[0].pageX
				h.vars.startY = e.touches[0].pageY

				# Remember id of the main touch
				h.vars.id = e.touches[0].identifier

				h.fire
					translateX: 0
					translateY: 0

			move: (h, e) ->

				h.fire 
					translateX: e.touches[0].pageX - h.vars.startX
					translateY: e.touches[0].pageY - h.vars.startY

			end: (h, e) ->

				# Do nothing if there are no fingers left on screen
				return if e.touches.length is 0

				# Do nothing if the ended touch is not the touch we are tracking
				return if e.changedTouches[0].identifier isnt h.vars.id

				# Alright, now we should track the next finger on the screen
				
				# Let's remember its id
				h.vars.id = e.touches[0].identifier

				# And update the startX and startY
				h.vars.startX = e.touches[0].pageX - (e.changedTouches[0].pageX - h.vars.startX)
				h.vars.startY = e.touches[0].pageY - (e.changedTouches[0].pageY - h.vars.startY)
			
		# Setup the move-instant
		setupInstant defineGesture

		# Setup the move-persistent
		setupPersistent defineGesture