define ['gesture/definitions/standard', 'native'], (setupStandardDefinitions) ->

	# List of classes of different gesture definitions
	classes = {}

	# Basic Gesture class
	classes['basic'] = class BasicGesture

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
			true

		# Called by gestureHandler to inform that gesture is ending.
		# Look at shouldFinish() too
		finish: (h) -> 
			h.fireCustom @name + ':end', {}

	Definitions =
		# List of all gesture definitions (instantiated)
		list: {}

		# To define a new gesture
		define: (structure) ->

			# The name fo the new gesture
			name = structure.name

			# Let's see which class it has to extend
			ExtendsFrom = do ->
				extendsFrom = structure.extends or 'basic'
				return classes[extendsFrom]

			# A dummy constructor function
			NewGesture = ->
				NewGesture.__super__.constructor.apply @, arguments

			# Extend from parent class
			NewGesture extends ExtendsFrom

			# Add the methods from structure to the class
			for key of structure
				NewGesture::[key] = structure[key]

			# Hold a reference to the class
			classes[name] = NewGesture

			# Instantiate and hold a reference
			Definitions.list[name] = new NewGesture()

	# A reference to the define() method
	define = (what) -> Definitions.define what
	
	# Setting up standard definitions
	setupStandardDefinitions(define)

	Definitions