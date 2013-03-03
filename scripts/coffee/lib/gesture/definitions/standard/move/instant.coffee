define ->
	(defineGesture) ->

		# Move gesture, always captures
		defineGesture

			name: 'move-instant'

			extends: 'move'
		
			check: (h) -> return 1

			init: (h) ->

				@_initFromEvent h.lastEvents[h.lastEventType]