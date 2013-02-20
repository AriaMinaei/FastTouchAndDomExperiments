define ['gesture/definitions/standard', 'native'], (setupStandardDefinitions) ->
	Definitions =
		# List of all gesture definitions
		list: {}

		# To define a new gesture
		define: (name, stuff = {}) ->
			bare = 
				# This should check whether the user is performing this gesture or not.
				# 
				# Return values:
				# -1 -> It means its absolutely not this gesture.
				# 		The Gesture.Handler will not check this Gesture anymore, and move
				# 		on to the next possibility.
				# 1 ->  Positive that user is performing this gesture.
				# 		Gesture.Handler will then call init on this gesture, and offload everything
				# 		to this gesture.
				# 0 ->  We're not sure yet.
				# 		Gesture.Handler wil wait for next touch events and ask again.
				check: (h) -> return -1

				# Called when check has returned 1
				# You can use this for debugging, or you can configure the Gesture.Handler
				# Make sure you don't change Gesture.Handler's hidden type, as that will slow
				# things down.
				# 
				# If you need to introduce new variables, put them all in h.stuff
				init: -> #console.log 'Gesture "' + name + '" initialized'

				# Called on touchstart events, when this gesture is active.
				start: (h, e) -> #console.log 'Caught touchstart for "' + name + '"'

				# Called on touchend events, when this gesture is active.
				end: (h, e) -> #console.log 'Caught touchend for "' + name + '"'

				# Called on touchmove events, when this gesture is active.
				# touchmove events get throttled for every animation frame.
				move: (h, e) -> #console.log 'Caught touchmove for "' + name + '"'

				# Called by Gesture.Handler's shouldFinish(), which usually happens
				# when all fingers are off screen.
				# 
				# If this function returns true, then the gesture will end.
				# If false, it will continue. You then will have to call Gesture.Handler.finish()
				# to finish things.
				# 
				# Also, if this returns true, or if Gesture.Handler.finish() is called, a finish method
				# on this gesture will be called too.
				shouldFinish: (h) -> 
					#console.log 'Caught shouldFinish for "' + name + '"'
					true

				# Called by gestureHandler to inform that gesture is ending.
				# Look at shouldFinish() too
				finish: (h) -> #console.log 'Caught finish for ' + name + '"'

			bare.name = name

			bare = Object.append bare, stuff

			Definitions.list[name] = bare
			bare

		# Define a new gesture, based on an existing gesture. You can override
		# its methods.
		extend: (original, name, stuff = {}) ->
			stuff.name = name
			o = Object.append Object.clone(Definitions.list[original]), stuff
			Definitions.list[name] = o
			o

	setupStandardDefinitions(Definitions)

	Definitions