if typeof define isnt 'function' then define = require('amdefine')(module)

define ['utility/math'], (math) ->
	return (defineGesture) ->

		# Transform gesture.
		# Waits to have at least two fingers on screen before it captures.
		defineGesture

			name: 'transform'

			check: (h) ->

				return 1 if h.lastEvents[h.lastEventType].touches.length > 1
				return -1 if h.hadRealMove and h.starts is 1
				return 0

			init: (h) ->

				# Last touch event
				last = h.lastEvents[h.lastEventType]

				# _prepareForTransform() needs to know the last transformation components
				# applied to the element. Since we're just stating, lets just set them
				# as none.
				h.vars.lastTranslateX = 0
				h.vars.lastTranslateY = 0
				h.vars.lastScale = 1

				# We know there are at least two fingers on the screen, so lets prepare
				@_prepareForTransform h, last.touches[0], last.touches[1]

				null

			_prepareForTransform: (h, a, b) ->

				# Set Current mode:
				# 1 means there are more than one fingers on the screen, and we have to
				# calculate scale and everything.
				# 0 means we are just moving with one finger
				h.vars.mode = 1

				# We hold the IDs of our current touches, so when a touchend fires, we can
				# know if we've lost our active touches or not.
				h.vars.aId = a.identifier
				h.vars.bId = b.identifier

				h.vars.scaleMultiplier = h.vars.lastScale

				h.vars.distance = math.distance a.pageX, a.pageY, b.pageX, b.pageY

				startX = parseInt (b.pageX + a.pageX) / 2
				startY = parseInt (b.pageY + a.pageY) / 2
				
				# Dimensions of our element
				elDims = h.vars.elDims = h.el.getBoundingClientRect()

				# Well, I figured this is the formula to keep the center of pinch/zoom
				# between the fingers:
				# addToTranslateX = (scale - 1) * width * (((Center of the fingers` placement in the x-axis) / width) - 1/2)
				# I call the last main paranthesis, 'pX'
				# I'm gonna hold pX and pY for now:
				h.vars.pX = ((startX - elDims.left) / elDims.width) - 0.5
				h.vars.pY = ((startY - elDims.top) / elDims.height) - 0.5

				# Hold el dimensions
				h.vars.width = elDims.width
				h.vars.height = elDims.height

				# Remember where the center of the fingers started from
				h.vars.startX = startX - h.vars.lastTranslateX
				h.vars.startY = startY - h.vars.lastTranslateY

				null

			_prepareForMove: (h, touch) ->

				# Set mode to move
				h.vars.mode = 0

				h.vars.scaleMultiplier = h.vars.lastScale

				h.vars.startX =  touch.pageX - h.vars.lastTranslateX
				h.vars.startY =  touch.pageY - h.vars.lastTranslateY

				null

			move: (h, e) ->

				# If we're in moving mode
				if h.vars.mode is 0
					a = e.touches[0]

					translateX = a.pageX - h.vars.startX
					translateY = a.pageY - h.vars.startY

					h.fire

						scale: h.vars.scaleMultiplier
						translateX: translateX
						translateY: translateY

					h.vars.lastTranslateX = translateX
					h.vars.lastTranslateY = translateY

					return

				# Currently in transforming mode
				a = e.touches[0]
				b = e.touches[1]

				distance = math.distance a.pageX, a.pageY, b.pageX, b.pageY

				# Scale, without considering how much the scale multiplier is
				scale = distance / h.vars.distance

				# Now, use that temporary scale to fix the positioning
				removeFromTranslateX = (scale - 1) * h.vars.width  * h.vars.pX
				removeFromTranslateY = (scale - 1) * h.vars.height * h.vars.pY

				# Translate, based on user's intended translation, and the fixed positioning
				translateX = parseInt((b.pageX + a.pageX) / 2) - h.vars.startX - removeFromTranslateX
				translateY = parseInt((b.pageY + a.pageY) / 2) - h.vars.startY - removeFromTranslateY

				# The real scale
				scale *= h.vars.scaleMultiplier

				# Fire the event
				h.fire

					scale: scale
					translateX: translateX
					translateY: translateY
				
				# Hold stuff for later use
				h.vars.lastTranslateX = translateX
				h.vars.lastTranslateY = translateY
				h.vars.lastScale = scale

				null

			end: (h, e) ->

				# End of gesture. Do nothing - finish() will take care of it.
				return if e.touches.length is 0

				# If we were in > two fingers mode
				if h.vars.mode is 1

					# Should we switch to moving mode?
					if e.touches.length is 1

						# Switch to moving mode
						@_prepareForMove(h, e.touches[0])

						return

					# Still in transforming mode
					
					# There are still two or more touches left on screen.
					# We have to see if our active touches have been removed or not
					return if e.touches[0].identifier is h.vars.aId and e.touches[1].identifier is h.vars.bId

					# Yup, at least one of the main touches has been removed. Let's use
					# the other fingers.
					a = e.touches[0]
					b = e.touches[1]

					@_prepareForTransform h, a, b

			start: (h, e) ->

				if h.vars.mode is 1
					if e.touches.length <= 2
						# Just for debugging
						console.error 'mode was 1, but touches.length is <= 2' 

					return

				return if e.touches.length is 1

				# Currently in moving mode
				# Should switch to transforming mdoe
				@_prepareForTransform h, e.touches[0], e.touches[1]

		# just like 'transform', only that this captures immediately
		defineGesture

			name: 'transform-instant'

			extends: 'transform'
			
			check: (h) -> 1

			init: (h) ->

				# Last touch event
				last = h.lastEvents[h.lastEventType]
				
				h.vars.lastTranslateX = 0
				h.vars.lastTranslateY = 0
				h.vars.lastScale = 1

				if last.touches.length is 1

					@_prepareForMove h, last.touches[0]
				
				else
				
					@_prepareForTransform(h, last.touches[0], last.touches[1])