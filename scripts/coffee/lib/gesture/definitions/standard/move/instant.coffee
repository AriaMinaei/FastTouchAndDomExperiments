define ->
	(defineGesture) ->

		# Move gesture, always captures
		defineGesture

			name: 'instant-move'

			extends: 'move'
		
			check: (h) -> return 1

			init: (h) ->

				@_initFromEvent h.lastEvents[h.lastEventType]