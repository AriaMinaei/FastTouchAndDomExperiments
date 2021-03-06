if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./definitions', './tools', 'utility/belt'], (GestureDefinitions, TouchTools, belt) ->

	emptyFunction = ->

	# Listens to touch events on an element and sends Dommy Events as gesture
	# events to that element.
	# 
	# Choose a high-level element, like the html element, since this can delegate events
	# to child elements.
	class Handler
		# Just specify the root element. document.body usually works
		constructor: (@root = window.document, @dommy = window.dommy) ->

			# Binding our few listeners to 'this'
			@_boundListeners =

				start: @_touchstartListener.bind @
				end: @_touchendListener.bind @
				move: @_touchmoveListener.bind @
				cancel: @_touchcancelListener.bind @

			# Latest touch events
			@lastEvents = {}

			# Candidate gestures with their elements
			@_candidates = []

			# Element event listeners for event with custom names
			@_elCustomEventListeners = {}

			# Current active gesture can use this to store its variables
			@vars = {}
			
			@options =

				real_move_distance: 16

			@_touchEventPool = new TouchTools.TouchEventPool 4, 3

			@forceFinish = =>

				@finish()

			@_reset()
				
		# Resets the whole object, but keeps the root el
		_reset: ->

			# Reset the latest touch events
			@lastEvents.start = null
			@lastEvents.move = null
			@lastEvents.end = null
			@lastEvents.cancel = null

			# First Event (which is, of course, a touchstart)
			@firstEvent = null

			# Type of the last event
			@lastEventType = null

			# Number of touch starts
			@starts = 0

			# Has this gesture contained any real move events?
			# It means that, even if user has moved fingers, if its been less than, like
			# 10 pixels of movement, then we dont consider it real move
			@hadRealMove = false

			# Candidate gestures with their elements
			@_candidates.length = 0

			# Gesture handler, only if determined
			@gesture = null

			# Name of gesture handler
			@gestureName = ''

			# If type is determined, so is the element
			@el = null

			# FastId of el
			@elFastId = 0;

			# Event listener function for el
			@_elEventListener = emptyFunction

			# Have we retrieved an eventListener for the current element from the dommy?
			@_elEventListenerInitialized = false

			belt.empty @_elCustomEventListeners

			belt.empty @vars

			null

		_copyTouchEvent: (e) ->

			@_touchEventPool.copy e

		# Start listening to touch events
		listen: ->

			@root.addEventListener 'touchstart', @_boundListeners.start
			@root.addEventListener 'touchend'  , @_boundListeners.end
			@root.addEventListener 'touchmove' , @_boundListeners.move
			@root.addEventListener 'touchcancel' , @_boundListeners.cancel

		# Stop listening to touch events
		quit: ->

			@root.removeEventListener 'touchstart', @_boundListeners.start
			@root.removeEventListener 'touchend'  , @_boundListeners.end
			@root.removeEventListener 'touchmove' , @_boundListeners.move
			@root.removeEventListener 'touchcancel' , @_boundListeners.cancel

		# Listener for touchstart
		_touchstartListener: (e) ->

			do e.stopPropagation
			do e.preventDefault

			@lastEvents.start = @_copyTouchEvent e

			@lastEventType = 'start'
			@starts++

			first = no

			unless @firstEvent

				first = yes
				
				@firstEvent = @_copyTouchEvent e
				
				do @_findCandidates

			if @gesture then @gesture.start @, e, first

			else

				@_checkForType()
				if @gesture then @gesture.start @, e, first

		# Listener for touchend
		_touchendListener: (e) ->

			do e.stopPropagation
			do e.preventDefault

			@lastEventType = 'end'
			@lastEvents.end = @_copyTouchEvent e

			if @gesture then @gesture.end @, e

			else 

				@_checkForType()

				if @gesture then @gesture.end @, e

			@_shouldFinish() if e.touches.length is 0

		_touchcancelListener: (e) ->

			do e.stopPropagation
			do e.preventDefault

			@lastEventType = 'cancel'
			@lastEvents.cancel = @_copyTouchEvent e

			if @gesture then @gesture.cancel @, e

			@_shouldFinish() if e.touches.length is 0

		# Listener for touchmove
		_touchmoveListener: (e) ->

			do e.stopPropagation
			do e.preventDefault

			@lastEvents.move = @_copyTouchEvent e
			@lastEventType = 'move'

			# Checking to see if we've had any real move
			unless @hadRealMove

				touch = @lastEvents.move.touches[0]
				first = @firstEvent.touches[0]

				if Math.abs(touch.screenX - first.screenX) >= @options.real_move_distance or
				Math.abs(touch.screenY - first.screenY) >= @options.real_move_distance
					@hadRealMove = true
						
			if @gesture then @gesture.move(@, @lastEvents.move)

			else

				@_checkForType()
				if @gesture then @gesture.move(@, @lastEvents.move)

		# Runs when there are no touches left.
		# If the gesture allows, it will finish
		_shouldFinish: ->

			shouldFinish = true
			
			shouldFinish = @gesture.shouldFinish(@) if @gesture

			return if not shouldFinish

			@finish()

		# Final method that runs when the gesture ends.
		finish: ->

			@gesture.finish(@) if @gesture

			#console.info 'finished with: ' + @gestureName if @gestureName
			#console.info '-----------------------------'
			@_reset()
			
		# Determines the potential targets and gestures for the current gesture
		_findCandidates: ->

			# The innermost target
			target = @firstEvent.target

			# Storing the list of gestures already candidated
			tempGests = {}

			# Lets bubble up through the DOM
			while target?

				id = @dommy.id target
				# Loading current target's gestures, if any
				gestures = @_getElGestures id, target

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
						#console.warn 'Invalid gesture name \'' + gestureName + '\'' if not Gesture[gestureName]
						@_candidates.push
							gestureName: gestureName
							target: target
							id: id

					tempGests[gestureName] = true
				
				break if target is @root

				# Bubbling up
				target = target.parentNode

			# #console.log 'candidates: ', @_candidates

		# Gets El's gestures either from its data-gestures attribute, or a chached
		# one from dommy.
		_getElGestures: (id, el) ->

			gestures = @dommy.get(id, 'gestures')
			return gestures if gestures isnt undefined

			gestures = el.getAttribute 'data-gestures' if el.getAttribute

			if !gestures

				@dommy.set(id, 'gestures', null)
				return null
			
			gestures = gestures.split(',').map (g) -> g.trim()
			@dommy.set(id, 'gestures', gestures)

			gestures
		
		# For when we haven't determined the gesture's type yet
		_checkForType: ->

			return if @_candidates.length is 0
			# console.group('Type')
			# Coffee doesn't support labels and stuff, so I gotta use this hack
			# for breaking outside the while loop
			shouldBreak = false

			while @_candidates.length != 0

				set = @_candidates[0]
				gestureName = set.gestureName
				# console.log 'checking ' + @_candidates[0].gestureName

				# reference to gesture definition object
				g = GestureDefinitionsList[gestureName]

				# Check if gesture applies
				switch g.check(@)
					# Doesn't apply > Remove it
					when -1
						@_candidates.shift()
						# console.log 'wasnt ' + gestureName
						continue
					# May apply > Wait for next touch event
					when 0
						# Break outside the while loop
						shouldBreak = true
						break
					# Does apply
					when 1
						@el = set.target
						@elFastId = set.id
						@gestureName = gestureName
						@gesture = g
						@gesture.init(@)

						# console.groupEnd()
						return

				break if shouldBreak

			if @_candidates.length isnt 0
				# console.log 'havent determined yet'
			else # console.log "Don't know!"
			# console.groupEnd()

		# Fires event on our elements
		fire: (e) ->

			# #console.group('Firing for', @gestureName)
			unless @_elEventListenerInitialized

				@_elEventListener = dommy.getListener(@elFastId, @el, @gestureName)
				@_elEventListenerInitialized = true

			@_elEventListener(e)
			# #console.groupEnd()

		# Fires an event with a custom name
		fireCustom: (name, e) ->

			# #console.group('Custom Firing', name, 'for', @gestureName)

			unless @_elCustomEventListeners[name] isnt undefined
			
				@_elCustomEventListeners[name] = dommy.getListener(@elFastId, @el, name)

			@_elCustomEventListeners[name](e)
			# #console.groupEnd()

		# Checks to see if touch of an event is inside
		# the current element
		isTouchInsideElement: (touch) ->

			target = touch.target

			while target?

				return true if target is @el
				
				break if target is @root

				target = target.parentNode

			return false

		# Forces a finish, and then starts another event
		# with 'e' as its first touchstart
		restartFromEvent: (e) ->

			do @finish

			@_touchstartListener e


	Handler.create = (root = window.document, dommy = window.dommy) ->
		
		h = new Handler root, dommy
		
		do h.listen

		h

	GestureDefinitionsList = GestureDefinitions.list

	Handler