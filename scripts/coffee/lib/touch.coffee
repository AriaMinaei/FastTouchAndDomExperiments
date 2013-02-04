_getElGestures = (el) ->
	gestures = el.getAttribute 'data-gestures' if el.getAttribute
	return null if !gestures
	gestures.split(',').map (g) -> g.trim()

# Handles all gestures
class GestureHandler
	# Just specify the root element. document.body usually works
	constructor: (@root, @dommy = window.dommy) ->
		@reset()

		@options =
			real_move_distance	: 10
			
	
	# Resets the whole object, but keeps the root el
	reset: ->
		# Lests make sure class members don't change type.
		@_touchmoveThrottle = 
			active: false
			frame : requestAnimationFrame ->

		# Binding our few listeners to 'this'
		@_boundListeners =
			start: @touchstartListener.bind @
			end: @touchendListener.bind @
			move: @touchmoveListener.bind @
			handleMove: @handleTouchmove.bind @

		# Latest touch events
		@_lastEvents =
			start: null
			move: null
			end: null

		# First Event (which is, of course, a touchstart)
		@_firstEvent = null

		# Type of the last event
		@_lastEventType = null

		# Number of touch starts
		@_starts = 0

		# Has this gesture contained any real move events?
		# It means that, even if user has moved fingers, if its been less than, like
		# 10 pixels of movement, then we dont consider it real move
		@_hadRealMove = false

		# Candidate gestures with their elements
		@_candidates = []

		# Gesture handler, only if determined
		@gesture = null

		# Name of gesture handler
		@gestureName = ''

		# If type is determined, so is the element
		@el = null

		# FastId of el
		@elFastId = 0;

		# Event listener function for el
		@elEventListener = () ->

		@elEventListenerInitialized = false

		# When there are no touches left, should we finish?
		@_finishOnLastTouchEnd = true

		# When the gesture is determined, it can use this space to hold its variables
		@stuff = {}


	# Start listening to touch events
	listen: ->
		@root.addEventListener 'touchstart', @_boundListeners.start
		@root.addEventListener 'touchend'  , @_boundListeners.end
		@root.addEventListener 'touchmove' , @_boundListeners.move
		@

	# Stop listening to touch events
	quit: ->
		@root.removeEventListener 'touchstart', @_boundListeners.start
		@root.removeEventListener 'touchend'  , @_boundListeners.end
		@root.removeEventListener 'touchmove' , @_boundListeners.move
		@

	# Listener for touchstart
	touchstartListener: (e) ->
		e.stop()

		@_lastEvents.start = e
		@_lastEventType = 'start'
		@_starts++

		unless @_firstEvent
			@_firstEvent = e
			@findTargets()

		if @gesture then @gesture.start(@, e)
		else
			@_checkForType()
			if @gesture then @gesture.start(@, e)


	# Listener for touchend
	touchendListener: (e) ->
		e.stop()
		@_lastEventType = 'end'
		@_lastEvents.end = e

		if @gesture then @gesture.end(@, e)
		else 
			@_checkForType()
			if @gesture then @gesture.end(@, e)

		@finish() if e.touches.length is 0 and @_finishOnLastTouchEnd

	# This one doesn't handle the move itself, it just throttles the events
	touchmoveListener: (e) ->
		e.stop()
		@_lastEvents.move = e
		@_lastEventType = 'move'

		console.log 'move', e.touches[0].screenX

		unless @_touchmoveThrottle.active
			@_touchmoveThrottle.frame = window.requestAnimationFrame @_boundListeners.handleMove
			@_touchmoveThrottle.active = true

	# Handles touchmove events, every 16ms or so
	handleTouchmove: ->
		@_touchmoveThrottle.active = false



		unless @_hadRealMove
			touches = @_lastEvents.move.touches
			first = @_firstEvent.touches[0]
			console.log 'checking for real move', 'last touches', touches, 'first', first
			for touch in touches
				if Math.abs(touch.screenX - first.screenX) >= @options.real_move_distance or
				Math.abs(touch.screenY - first.screenY) >= @options.real_move_distance
					@_hadRealMove = true
					console.log '-- had real mvoe!'
					break



		if @gesture then @gesture.move(@, @_lastEvents.move)
		else
			@_checkForType()
			if @gesture then @gesture.move(@, @_lastEvents.move)

	# Runs when there are no touches left
	finish: ->

		console.log 'finished with: ' + @gestureName if @gestureName
		@reset()
		
	# Determines the elements as potential targets for current gesture
	findTargets: ->
		# The innermost target
		target = @_firstEvent.target

		# Storing the list of gestures already candidated
		tempGests = {}

		# Lets bubble up through the DOM
		while target?
			# Loading current target's gestures, if any
			gestures = _getElGestures target

			# Move on if there are no gestures
			if !gestures
				break if target is @root
				target = target.parentNode
				continue

			# Found gestures. Let's put the element in the candidates
			for gestureName in gestures
				# This means if there are multiple elements in the bubble
				# listening for this gesture, only the innermost may catch it.
				unless tempGests[gestureName]
					console.error 'Invalid gesture name \'' + gestureName + '\'' if not Gesture[gestureName]
					@_candidates.push
						gestureName: gestureName
						target : target
				

				tempGests[gestureName] = true
			
			break if target is @root

			# Bubbling up
			target = target.parentNode

		# console.log 'candidates: ', @_candidates
	
	# For when we haven't determined the gesture's type yet
	_checkForType: ->
		# Coffee doesn't support labels and stuff, so I gotta use this hack
		# for breaking outside the while loop
		shouldBreak = false
		while @_candidates.length != 0
			set = @_candidates[0]
			gestureName = set.gestureName
			console.log 'checking ' + @_candidates[0].gestureName

			# Check if gesture applies
			switch Gesture[gestureName].check(@)
				# Doesn't apply > Remove it
				when -1
					@_candidates.shift()
					console.log 'wasnt ' + gestureName
					continue
				# May apply > Wait for next touch event
				when 0
					# Break outside the while loop
					shouldBreak = true
					break
				# Does apply
				when 1
					@el = set.target
					@elFastId = @dommy.fastId(@el)
					@gestureName = gestureName
					@gesture = Gesture[gestureName]
					@gesture.init(@)
					return

			break if shouldBreak

		if @_candidates.length isnt 0
			console.log 'havent determined yet'

	# Fires event on our elements
	fire: (e) ->
		console.log 'firing'
		unless @elEventListenerInitialized
			@elEventListener = dommy.getListener(@elFastId, @el, @gestureName)
			@elEventListenerInitialized = true

		@elEventListener(e)
		
# To define different gestures. See examples below
class Gesture
	constructor: (name, stuff = {}) ->
		bare = 
			# This should check whether the user is performing this gesture or not.
			# 
			# Return values:
			# -1 -> It means its absolutely not this gesture.
			# 		The GestureHandler will not check this Gesture anymore, and move
			# 		on to the next possibility.
			# 1 ->  Positive that user is performing this gesture.
			# 		GestureHandler will then call init on this gesture, and offload everything
			# 		to this gesture.
			# 0 ->  We're not sure yet.
			# 		GestureHandler wil wait for next touch events and ask again.
			check: (h) -> return -1

			# Called when check has returned 1
			# You can use this for debugging, or you can configure the GestureHandler
			# Make sure you don't change GestureHandler's hidden type, as that will slow
			# things down.
			# 
			# If you need to introduce new variables, put them all in h.stuff
			init: -> console.log 'Gesture "' + name + '" initialized'

			# Called on touchstart events, when this gesture is active.
			start: (h, e) -> console.log 'Caught touchstart for "' + name + '"'

			# Called on touchend events, when this gesture is active.
			end: (h, e) -> console.log 'Caught touchend for "' + name + '"'

			# Called on touchmove events, when this gesture is active.
			# touchmove events get throttled for every animation frame.
			move: (h, e) -> console.log 'Caught touchmove for "' + name + '"'

		bare.name = name

		bare = Object.append bare, stuff

		Gesture[name] = bare
		bare

# Defining a new gesture called 'tap'
new Gesture 'tap', 
	tap_time: 300
	check: (h) ->
		# Not this event, if had more than one finger on screen, or moved the finger more than
		# a few pixels
		return -1 if h._starts isnt 1 or h._hadRealMove

		# If last event wasn't touchend, cant know yet.
		return 0 if h._lastEventType isnt 'end'

		# If touch was held longer than 300ms, then its not a tap
		return -1 if h._lastEvents.end.timeStamp - h._firstEvent.timeStamp > @tap_time

		# Alright, its a tap!
		return 1

	end: (h, e) ->
		# Fire a tap event
		h.fire({})

# 'hold' gesture
new Gesture 'hold',
	hold_time: 600
	check: (h) ->
		return -1 if h._starts isnt 1 or h._hadRealMove

		return 0 if h._lastEventType isnt 'end' or
			h._lastEvents.end.timeStamp - h._firstEvent.timeStamp < @hold_time

		return 1

	end: (h, e) ->
		h.fire({})

new Gesture 'instantmove'
	# check: (h) ->
new Gesture 'transform'
new Gesture 'move'

@GestureHandler = GestureHandler